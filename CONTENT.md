# Content checklist

Everything below is a placeholder. Replace these before shipping.

## `app/lib/site-config.ts`
- `email` — real contact email
- `resumeUrl` — currently points at `/resume-placeholder.pdf`. Drop your real
  resume PDF into `public/` and update the path (or keep the same filename).
- `social.github` / `social.githubUsername` — your real GitHub profile + handle.
  The handle also powers the live GitHub stats widget in the hero dashboard.
- `social.linkedin` / `social.twitter` — real profile URLs.
- `location` — currently set to "Ghana" as a placeholder region.
- `stats` — projects built / technologies / years building.

## Projects — real content in, a few small confirmations left
`app/features/projects/projects-data.ts` now holds 13 real case studies (ARL
Attendance System, KeepXtra, JKM Drinks Depot, FitterOne, MySkillsMate,
BorderHub Operating System, StelloPOS, Fire Truck Inspection Checklist,
MyDentist, Book Management System, Meditrack, LectureMate, Chat API) — no
fictional placeholders left. The portfolio-website entry (a case study
about this site itself) was removed by request. A few things still need a
decision:
- `arl-attendance-system.role` is set to `"Sole developer"` as a guess —
  confirm whether that's accurate or it was contractor work.
- No `links` field yet for: keepxtra, myskillsmate,
  borderhub-operating-system, stellopos, fire-truck-checklist, meditrack
  (repo given but no demo), lecturemate-wellness (repo given but no demo),
  chat-api (repo given but no demo). Add `links: { repo: "...", demo: "..." }`
  once available and a "View code" / "Live demo" button appears
  automatically (wired up in `project-detail-view.tsx`).
- `book-management-system` is a Windows console `.exe` and `chat-api` is a
  backend-only API with no client — neither has a meaningful "live demo" in
  the browser sense; consider a video/GIF walkthrough link instead if you
  want a demo link for either.
- With 13 total project cards now, strongly consider whether the home page
  "Projects" section should feature a curated subset (e.g. top 4-6) with a
  "View all" link to a dedicated `/projects` archive page, rather than
  showing every card inline in the scroll — this is now a real UX
  consideration, not just a nice-to-have. Say the word and I'll build it.

## Content data files (edit copy without touching layout)
- `app/features/journal/journal-data.ts` — 4 seeded articles.
- `app/features/experience/experience-data.ts` — current role at Adamus
  Resources Ltd + the journey timeline steps.
- `app/features/skills/skills-data.ts` — skill categories & items.

## Contact form
`app/features/contact/contact-form.tsx` currently simulates a send (no
network call) per your request. When ready to wire up real delivery, replace
the `setTimeout` block in `handleSubmit` with a call to your chosen service
(Formspree, EmailJS, Resend, or your own API route).

## Favicon / metadata
`public/favicon.ico` is still the framework default — swap it for a real one.
