import type { ContentBlock } from "~/lib/content-blocks";

export interface JournalArticle {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  blocks: ContentBlock[];
}

export const journalArticles: JournalArticle[] = [
  {
    slug: "what-a-mining-network-taught-me",
    title: "What a Mining Site Network Taught Me About Reliability",
    date: "2026-02-10",
    tags: ["Networking", "Infrastructure"],
    excerpt:
      "Uptime isn't an abstract SLA when the network you're maintaining connects real equipment on a real site.",
    blocks: [
      {
        type: "paragraph",
        text: "In enterprise software, 'downtime' is often an inconvenience. On a mining site, a network hiccup can stall equipment coordination and safety systems. That difference changed how I think about reliability.",
      },
      { type: "heading", text: "What changed in my mental model" },
      {
        type: "list",
        items: [
          "Redundancy isn't a 'nice to have' — it's the difference between a blip and an incident.",
          "Monitoring has to tell you about a problem before a person does.",
          "Documentation is a reliability feature, not paperwork — the fastest fix is the one where someone already wrote down the topology.",
        ],
      },
      {
        type: "paragraph",
        text: "I now design software with the same bias: assume the network will fail sometimes, and make sure the system degrades gracefully instead of catastrophically.",
      },
    ],
  },
  {
    slug: "containers-clicked-for-me",
    title: "The Day Containers Finally Clicked",
    date: "2026-01-18",
    tags: ["DevOps", "Docker"],
    excerpt:
      "I understood Docker's commands long before I understood why they mattered. Here's what changed.",
    blocks: [
      {
        type: "paragraph",
        text: "I could run docker build and docker run correctly for months before I actually understood the problem containers solve: 'works on my machine' isn't a joke, it's a reproducibility failure.",
      },
      { type: "heading", text: "The reframe" },
      {
        type: "paragraph",
        text: "A container isn't a lightweight VM — it's a promise: this process runs the same way here as it will in production, because the environment is shipped with the code.",
      },
    ],
  },
  {
    slug: "designing-for-the-i-dont-know-case",
    title: "Designing for the 'I Don't Know' Case in AI Systems",
    date: "2026-02-24",
    tags: ["AI", "System Design"],
    excerpt:
      "The most trustworthy thing an AI feature can do is admit it doesn't have an answer.",
    blocks: [
      {
        type: "paragraph",
        text: "Building a retrieval-augmented assistant taught me that the hardest and most valuable feature isn't the correct answer — it's a well-designed 'I don't know'.",
      },
      {
        type: "list",
        items: [
          "A confident wrong answer is worse than a slower correct one.",
          "Retrieval confidence thresholds matter more than most prompt tweaks.",
          "Users trust a system faster once they've seen it refuse to guess.",
        ],
      },
    ],
  },
  {
    slug: "student-to-systems-thinker",
    title: "From Student to Systems Thinker",
    date: "2025-12-05",
    tags: ["Career", "Reflection"],
    excerpt:
      "A reflection on the shift from 'can I make this work' to 'how should this be built'.",
    blocks: [
      {
        type: "paragraph",
        text: "Early on, success meant getting a feature to run. Somewhere between enterprise systems, networking, and an industrial environment, the question changed to: how does this fail, and what happens when it does?",
      },
      {
        type: "paragraph",
        text: "That shift — from feature-thinking to systems-thinking — is the throughline of my journey from student to the engineer I'm becoming.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return journalArticles.find((article) => article.slug === slug);
}
