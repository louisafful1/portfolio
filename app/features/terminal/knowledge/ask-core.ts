// Runtime-agnostic core for the portfolio Q&A assistant: builds a Web
// Response (status/headers/streaming body) using standard fetch/Response/
// ReadableStream APIs. Both the Vercel serverless function (api/ask.ts) and
// the Vite dev-server middleware (vite.config.ts) are thin adapters around
// this so local dev and production behave identically.
import { buildKnowledgeBase, searchKnowledgeBase, type KnowledgeDoc } from "./portfolio-knowledge";
import { SOURCES_DELIMITER } from "./ask-protocol";

const MAX_QUESTION_LENGTH = 300;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;
const CONTEXT_DOC_COUNT = 5;
const MAX_SOURCES = 2;
const MIN_SOURCE_SCORE = 3;
const MIN_SOURCE_SCORE_RATIO = 0.5;

const SYSTEM_PROMPT = `You are the portfolio assistant embedded in Louis Afful's personal terminal. Visitors ask you questions about Louis's work, and you answer ONLY using the PORTFOLIO CONTEXT provided in this message. Do not use outside knowledge about Louis, his employers, or his projects.

Rules:
- Only state facts directly supported by the context. Never invent technologies, dates, metrics, employers, achievements, or outcomes.
- Pay close attention to the difference between building something and supporting or administering it. Words like "built", "developed", or "designed" mean Louis personally created it. Words like "supported", "administered", "coordinated", "maintained", or "troubleshot" mean he worked with an existing system, not that he built it. Never describe supported work as something Louis built.
- Recognizing a common abbreviation or acronym for something already named in the context (e.g. matching "UMaT" to "University of Mines and Technology") is not outside knowledge - it's still working from the given context, so answer normally in that case.
- When a visitor asks for a real fact that's genuinely absent from the context (e.g. GPA, age, salary) - not just phrased differently than the question - say so in a natural, varied sentence of your own, never a fixed canned line. Then, in the same reply, point them to a way to ask Louis directly using whatever contact details are in the context (email, LinkedIn, WhatsApp) - e.g. "That's not something the portfolio covers, but you could ask him directly at [email] or on WhatsApp at [number]." Vary the phrasing each time so it doesn't read as a template. Do not guess or speculate about facts that truly aren't there.
- Greetings and small talk directed at you ("hi", "how are you", "thanks") are not information requests and don't need a contact suggestion - reply briefly and naturally, and steer toward what you can help with (Louis's work, projects, experience, skills).
- Keep answers concise: 1-3 sentences for simple questions, up to 4-5 short paragraphs or bullet points for project questions covering the problem, what was built, and a relevant technical or operational detail.
- Write in a mature, plain, professional voice. No emojis, no corporate buzzwords, no "not just... but...", no "I'm passionate about leveraging...", no overselling.
- Refer to Louis in the third person (he/his) - you are describing his work to a visitor, not speaking as him.
- This is a plain-text terminal, not a markdown renderer. Never use markdown syntax (no **bold**, no _italic_, no [links](url), no backticks, no bullet dashes) - write plain sentences, and give emails/URLs as bare plain text.`;

const knowledgeBase = buildKnowledgeBase();
const requestLog = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = requestLog.get(key);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLog.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

function isCitable(doc: KnowledgeDoc): boolean {
  return (doc.type === "project" || doc.type === "journal") && Boolean(doc.route);
}

function buildContext(question: string): { contextBlock: string; sources: { title: string; route: string }[] } {
  const results = searchKnowledgeBase(question, knowledgeBase, CONTEXT_DOC_COUNT);

  // Always include "about" and "contact" regardless of retrieval score - the
  // model needs contact info on hand at all times so it can point a visitor
  // there whenever a question falls outside what the portfolio covers.
  const finalResults = [...results];
  for (const forcedId of ["about", "contact"]) {
    const doc = knowledgeBase.find((candidate) => candidate.id === forcedId);
    if (doc && !finalResults.some((result) => result.doc.id === forcedId)) {
      finalResults.unshift({ doc, score: 0 });
    }
  }

  const contextBlock = finalResults
    .map((result, index) => `[${index + 1}] ${result.doc.title}\n${result.doc.text}`)
    .join("\n\n");

  const topScore = Math.max(0, ...results.map((result) => result.score));
  const sources = finalResults
    .filter((result) => isCitable(result.doc))
    .filter((result) => result.score >= MIN_SOURCE_SCORE && result.score >= topScore * MIN_SOURCE_SCORE_RATIO)
    .slice(0, MAX_SOURCES)
    .map((result) => ({ title: result.doc.title, route: result.doc.route as string }));

  return { contextBlock, sources };
}

function isDeclineAnswer(text: string): boolean {
  return (
    !text.trim() ||
    /don'?t have (that|this|access to that)|not (something )?(covered|available|mentioned|documented|specified)|isn'?t (covered|available|in the portfolio)|no (information|details) (on|about)/i.test(
      text,
    )
  );
}

async function streamAssistantAnswer(upstream: Response, onDelta: (text: string) => void): Promise<string> {
  if (!upstream.body) return "";
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const rawEvent = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      boundary = buffer.indexOf("\n\n");

      if (!rawEvent.startsWith("data:")) continue;
      const payload = rawEvent.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload);
        const delta: unknown = parsed?.choices?.[0]?.delta?.content;
        if (typeof delta === "string" && delta.length > 0) {
          full += delta;
          onDelta(delta);
        }
      } catch {
        // Ignore malformed/partial SSE chunks.
      }
    }
  }

  return full;
}

function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleAskRequest(rawQuestion: unknown, clientKey: string): Promise<Response> {
  if (isRateLimited(clientKey)) {
    return jsonError(429, "Too many questions at once. Try again in a moment.");
  }

  const question = typeof rawQuestion === "string" ? rawQuestion.trim() : "";
  if (!question || question.length > MAX_QUESTION_LENGTH) {
    return jsonError(400, "Send a non-empty question under 300 characters.");
  }

  const token = process.env.AI_API_KEY;
  if (!token) {
    console.error("Portfolio assistant misconfigured: AI_API_KEY is not set");
    return jsonError(500, "The assistant isn't configured yet.");
  }

  const { contextBlock, sources } = buildContext(question);
  const apiUrl = process.env.AI_API_URL || "https://api.groq.com/openai/v1/chat/completions";
  const model = process.env.AI_MODEL || "openai/gpt-oss-20b";

  let upstream: Response;
  try {
    upstream = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `${SYSTEM_PROMPT}\n\nPORTFOLIO CONTEXT:\n${contextBlock || "(no closely matching portfolio content found)"}`,
          },
          { role: "user", content: question },
        ],
      }),
    });
  } catch (error) {
    console.error("Portfolio assistant upstream request failed", error);
    return jsonError(502, "Could not reach the assistant right now.");
  }

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    console.error("Portfolio assistant upstream error", upstream.status, detail.slice(0, 500));
    return jsonError(502, "Could not reach the assistant right now.");
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const full = await streamAssistantAnswer(upstream, (delta) => controller.enqueue(encoder.encode(delta)));
        if (!full.trim()) {
          controller.enqueue(encoder.encode("I don't have that information in Louis's portfolio."));
        } else if (sources.length > 0 && !isDeclineAnswer(full)) {
          controller.enqueue(encoder.encode(`${SOURCES_DELIMITER}${JSON.stringify(sources)}`));
        }
      } catch (error) {
        console.error("Portfolio assistant streaming error", error);
        controller.enqueue(encoder.encode("\n\nSomething went wrong while answering. Try again in a moment."));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
