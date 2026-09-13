# Louis Afful - Portfolio

A personal engineering portfolio built to feel like a product, not a template.

## Stack

- React 19 + React Router v7 (framework mode, SPA build - `ssr: false`)
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Radix primitives) + Lucide icons
- Motion (Framer Motion) for animation

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Building

```bash
npm run build       # outputs a static site to build/client
npm run start        # preview the production build locally
```

Since this is a static SPA build, the contents of `build/client` can be
deployed to any static host (Vercel, Netlify, GitHub Pages, Cloudflare
Pages, S3 + CloudFront, etc.) - no Node server required. Configure your
host to fall back to `index.html` for unknown paths (SPA routing).

## Terminal assistant (⌘K → Terminal, or the terminal dock trigger)

The terminal's `ask`/natural-language input is answered by a small RAG
pipeline, not a hardcoded script:

- `app/features/terminal/knowledge/portfolio-knowledge.ts` turns the site's
  own content (projects, experience, skills, about, journal) into short
  documents and ranks them against a question with BM25 (no embeddings/vector
  DB - the corpus is small enough that a lexical ranker is sufficient).
- `api/ask.ts` is a Vercel serverless function (the app itself builds as a
  static SPA, so this is the one server-side piece). It retrieves the top
  matching documents, sends them plus the question to an LLM with a strict
  "answer only from this context" system prompt, and streams the reply back
  as plain text. Relevant project/journal links are computed from retrieval
  scores server-side (never invented by the model) and sent via an
  `X-Sources` response header.
- The LLM call goes to Groq (OpenAI-compatible API, free tier) - see
  `.env.example` for the required `AI_API_KEY` and optional
  `AI_API_URL`/`AI_MODEL` overrides (swapping to another OpenAI-compatible
  provider later is just an env var change, no code change).

To test locally, copy `.env.example` to `.env` with a real `AI_API_KEY`
(free at console.groq.com/keys), then just run `npm run dev` as usual - a
small Vite dev-server middleware (`vite.config.ts`) serves `/api/ask`
locally using the exact same `handleAskRequest` core that `api/ask.ts` uses
in production, so dev and prod behave identically. No extra Vercel project
config is needed for deployment either - Vercel auto-detects the `/api`
folder as serverless functions regardless of the static build - just add
`AI_API_KEY` under the project's Environment Variables.

## Content

Before shipping, see [CONTENT.md](./CONTENT.md) for the placeholder values
(resume PDF, social links, GitHub username, project/journal copy) that need
to be swapped for real content.

## Project structure

Feature-first under `app/features/*` (theme, navigation, hero, about,
skills, projects, experience, lab, journal, terminal, contact), route
components under `app/routes/*`, shared UI primitives in
`app/components/ui/*` (shadcn), and site-wide copy/config in
`app/lib/site-config.ts`.
