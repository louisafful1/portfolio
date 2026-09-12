# Content checklist

## `app/lib/site-config.ts` - resolved from Louis's real CV (`public/Louis-Afful-Resume.pdf`)
`email`, `phone`, `resumeUrl`, `social.github`/`githubUsername`/`linkedin`,
and `location` are now real values sourced from the CV. Still open:
- `social.twitter` - optional, left blank.
- `stats.technologies` (20) is an estimate, not computed from the CV/projects
  - adjust if you want it exact.
- `role` / `eyebrow` ("Software Engineer") intentionally kept as the site's
  stated positioning rather than the CV's literal title ("Software
  Developer (Data, Automation & AI)") - say the word if you want the site
  copy to match the CV title instead.

## Projects - 13 real case studies, no fictional placeholders left
`app/features/projects/projects-data.ts`: ARL Attendance System, KeepXtra,
JKM Drinks Depot, FitterOne, MySkillsMate, BorderHub Operating System,
StelloPOS, Fire Truck Inspection Checklist, MyDentist, Book Management
System, Meditrack, LectureMate, Chat API. A few things still open:
- `arl-attendance-system.role` is set to `"Sole developer"` as a guess -
  confirm whether that's accurate or it was contractor work.
- No `links` field yet for: keepxtra, myskillsmate,
  borderhub-operating-system, stellopos, fire-truck-checklist, meditrack
  (repo given but no demo), lecturemate-wellness (repo given but no demo),
  chat-api (repo given but no demo). Add `links: { repo: "...", demo: "..." }`
  once available and a "View code" / "Live demo" button appears
  automatically (wired up in `project-detail-view.tsx`).
- `book-management-system` is a Windows console `.exe` and `chat-api` is a
  backend-only API with no client - neither has a meaningful "live demo" in
  the browser sense; consider a video/GIF walkthrough link instead if you
  want a demo link for either.
- With 13 total project cards, consider whether the home page "Projects"
  section should feature a curated subset (e.g. top 4-6) with a "View all"
  link to a dedicated `/projects` archive page, rather than showing every
  card inline in the scroll. Say the word and I'll build it.

## Experience - now real, sourced from the CV
`app/features/experience/experience-data.ts` holds 3 real roles (National
Service at Adamus Resources, Freelance Web Developer at BYF Consulting,
Backend Development Intern at UMaT–SRID). The CV also lists two projects
(AI-Powered LMS, Drug Inventory Management System) that already exist as
full case studies here (`lecturemate-wellness`, `meditrack`) - not
duplicated into Experience.

## Content data files still placeholder (edit copy without touching layout)
- `app/features/journal/journal-data.ts` - 4 seeded articles.
- `app/features/skills/skills-data.ts` - skill categories & items. The CV's
  actual skills list (Node.js, Express, React, Redux, MongoDB, SQL, Redis,
  WebSocket/Socket.io, LLM integration, Git, network troubleshooting) could
  replace or refine this - say the word if you want that swapped in too.
- The hero dashboard's "Tech stack" badges
  (`app/features/hero/dashboard-panel.tsx`) are still a generic placeholder
  list (React, Node.js, TypeScript, Docker, PostgreSQL, AWS) rather than
  pulled from real project data - flagging in case you want it accurate.

## Contact form
`app/features/contact/contact-form.tsx` currently simulates a send (no
network call) per your request. When ready to wire up real delivery, replace
the `setTimeout` block in `handleSubmit` with a call to your chosen service
(Formspree, EmailJS, Resend, or your own API route).

## Favicon / metadata
Resolved - `public/favicon.svg` (the real "LA" logo mark) is wired up via
`<link rel="icon">` in `root.tsx`. `public/favicon.ico` is still the old
framework default and unused by modern browsers now, but harmless to leave.
