// Runtime-agnostic core for the contact form, mirroring the pattern in
// app/features/terminal/knowledge/ask-core.ts: both api/contact.ts (Vercel)
// and the Vite dev middleware (vite.config.ts) are thin adapters around this.
// Relative import on purpose (not "~/"): this module is also bundled
// standalone by Vercel for api/contact.ts, which won't resolve the app's
// tsconfig path alias the way Vite does.
import { siteConfig } from "../../lib/site-config";

const MAX_NAME_LENGTH = 100;
const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

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

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function handleContactRequest(payload: unknown, clientKey: string): Promise<Response> {
  if (isRateLimited(clientKey)) {
    return jsonResponse(429, { error: "Too many messages sent. Try again later." });
  }

  const body = payload as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!name || name.length > MAX_NAME_LENGTH) {
    return jsonResponse(400, { error: "Enter a valid name." });
  }
  if (!isValidEmail(email)) {
    return jsonResponse(400, { error: "Enter a valid email address." });
  }
  if (!message || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, { error: "Enter a message (up to 2000 characters)." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form misconfigured: RESEND_API_KEY is not set");
    return jsonResponse(500, { error: "The contact form isn't configured yet." });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || siteConfig.email;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact Form <onboarding@resend.dev>",
        to: [toEmail],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Contact form send failed", response.status, detail.slice(0, 500));
      return jsonResponse(502, { error: "Could not send your message right now. Try emailing directly instead." });
    }
  } catch (error) {
    console.error("Contact form send error", error);
    return jsonResponse(502, { error: "Could not send your message right now. Try emailing directly instead." });
  }

  return jsonResponse(200, { ok: true });
}
