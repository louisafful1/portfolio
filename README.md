# Louis Afful — Portfolio

A personal engineering portfolio built to feel like a product, not a template.

## Stack

- React 19 + React Router v7 (framework mode, SPA build — `ssr: false`)
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
Pages, S3 + CloudFront, etc.) — no Node server required. Configure your
host to fall back to `index.html` for unknown paths (SPA routing).

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
