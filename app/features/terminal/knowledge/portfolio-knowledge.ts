// Relative imports on purpose (not the app-wide "~/" alias): this module is
// also imported from /api/ask.ts, which is bundled standalone by Vercel and
// won't resolve the app's tsconfig path alias the way Vite does.
import { projects } from "../../projects/projects-data";
import { experienceEntries } from "../../experience/experience-data";
import { skillCategories } from "../../skills/skills-data";
import { journalArticles } from "../../journal/journal-data";
import { siteConfig } from "../../../lib/site-config";
import type { ContentBlock } from "../../../lib/content-blocks";

export type KnowledgeDocType = "about" | "experience" | "skills" | "project" | "journal";

export interface KnowledgeDoc {
  id: string;
  type: KnowledgeDocType;
  title: string;
  text: string;
  route?: string;
}

function blocksToText(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(". ");
      if (block.type === "code") return block.code;
      return block.text;
    })
    .join(" ");
}

export function buildKnowledgeBase(): KnowledgeDoc[] {
  const docs: KnowledgeDoc[] = [];

  docs.push({
    id: "about",
    type: "about",
    title: "About Louis Afful",
    text: [
      `${siteConfig.name} - ${siteConfig.role}.`,
      siteConfig.intro,
      `Current focus areas: ${siteConfig.focus.join(", ")}.`,
      `Currently learning: ${siteConfig.currentlyLearning.join(", ")}.`,
      `Based in ${siteConfig.location}.`,
    ].join(" "),
  });

  docs.push({
    id: "contact",
    type: "about",
    title: "How to contact Louis",
    text: [
      `To reach or contact ${siteConfig.name}, get in touch by email at ${siteConfig.email}, on LinkedIn at ${siteConfig.social.linkedin}, or on WhatsApp at ${siteConfig.social.whatsapp}.`,
      `His resume/CV is available to download at ${siteConfig.resumeUrl}.`,
      `He is currently available for software engineering opportunities.`,
      "The portfolio site also has a Contact section with these same links.",
    ].join(" "),
  });

  for (const entry of experienceEntries) {
    docs.push({
      id: `experience:${entry.id}`,
      type: "experience",
      title: `${entry.role} - ${entry.org}`,
      text: [
        `${entry.role} at ${entry.org}, ${entry.period}.`,
        entry.summary,
        entry.responsibilities.join(". "),
      ].join(" "),
    });
  }

  docs.push({
    id: "skills",
    type: "skills",
    title: "Technical skills",
    text: [
      "Technologies and skill areas Louis works with, grouped by category:",
      ...skillCategories.map((category) => `${category.label}: ${category.items.join(", ")}.`),
    ].join(" "),
  });

  for (const project of projects) {
    docs.push({
      id: `project:${project.slug}`,
      type: "project",
      title: project.title,
      route: `/projects/${project.slug}`,
      text: [
        `${project.title} (${project.role}, ${project.timeframe}).`,
        project.summary,
        `Problem: ${project.problem}`,
        `Key features: ${project.features.join("; ")}.`,
        `Technologies: ${project.tech.join(", ")}.`,
      ].join(" "),
    });
  }

  for (const article of journalArticles) {
    docs.push({
      id: `journal:${article.slug}`,
      type: "journal",
      title: article.title,
      route: `/journal/${article.slug}`,
      text: [article.excerpt, blocksToText(article.blocks)].join(" "),
    });
  }

  return docs;
}

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "to", "of", "in",
  "on", "for", "with", "that", "this", "it", "its", "and", "or", "but", "if", "do", "does",
  "did", "has", "have", "had", "how", "what", "why", "which", "who", "whom", "about", "i",
  "you", "he", "she", "they", "we", "his", "her", "their", "my", "your", "as", "at", "by",
  "from", "not", "so", "than", "then", "there", "when", "where", "will", "would", "can",
  "could", "should", "just", "tell", "me", "please", "know", "give", "let", "get", "some",
  "any", "more",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

interface IndexedDoc {
  doc: KnowledgeDoc;
  termFreq: Map<string, number>;
  length: number;
}

function buildIndex(docs: KnowledgeDoc[]): IndexedDoc[] {
  return docs.map((doc) => {
    const tokens = tokenize(`${doc.title} ${doc.text}`);
    const termFreq = new Map<string, number>();
    for (const token of tokens) {
      termFreq.set(token, (termFreq.get(token) ?? 0) + 1);
    }
    return { doc, termFreq, length: tokens.length };
  });
}

export interface SearchResult {
  doc: KnowledgeDoc;
  score: number;
}

// Standard BM25 ranking - a small, dependency-free retrieval layer that's
// enough for a few dozen short documents. No embeddings/vector store needed
// at this scale.
const K1 = 1.5;
const B = 0.75;

export function searchKnowledgeBase(query: string, docs: KnowledgeDoc[], topK = 6): SearchResult[] {
  const index = buildIndex(docs);
  const queryTokens = Array.from(new Set(tokenize(query)));
  if (queryTokens.length === 0) return [];

  const avgLength = index.reduce((sum, entry) => sum + entry.length, 0) / (index.length || 1);
  const docFrequency = new Map<string, number>();
  for (const token of queryTokens) {
    docFrequency.set(token, index.filter((entry) => entry.termFreq.has(token)).length);
  }

  const scored = index.map((entry) => {
    let score = 0;
    for (const token of queryTokens) {
      const freq = entry.termFreq.get(token) ?? 0;
      if (freq === 0) continue;
      const matchingDocs = docFrequency.get(token) ?? 0;
      const idf = Math.log((index.length - matchingDocs + 0.5) / (matchingDocs + 0.5) + 1);
      const denominator = freq + K1 * (1 - B + (B * entry.length) / (avgLength || 1));
      score += idf * ((freq * (K1 + 1)) / denominator);
    }
    return { doc: entry.doc, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, topK);
}
