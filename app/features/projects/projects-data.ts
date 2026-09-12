export interface DiagramNode {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  kind?: "client" | "service" | "data" | "external";
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface ProjectArchitecture {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface ProjectChallenge {
  title: string;
  detail: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  timeframe: string;
  tech: string[];
  problem: string;
  architecture: ProjectArchitecture;
  features: string[];
  challenges: ProjectChallenge[];
  lessons: string[];
  futureImprovements: string[];
  links?: { repo?: string; demo?: string };
}

export const projects: Project[] = [
  {
    slug: "arl-attendance-system",
    title: "ARL Attendance System",
    summary:
      "A geofenced, photo-verified attendance system for Adamus Resources Limited's internal meetings - employees check in via GPS + camera, managers schedule recurring meetings and review exceptions, and admins/HR pull audit-ready reports across departments.",
    role: "Sole developer", // TODO: confirm - contractor vs. sole developer?
    timeframe: "2026",
    tech: [
      "React 19",
      "React Router 8 (SSR framework, file-based routes)",
      "TypeScript",
      "Tailwind CSS 4",
      "MongoDB + Mongoose 9",
      "Zod (validation)",
      "bcryptjs (OTP hashing)",
      "Nodemailer (SMTP email OTP delivery)",
      "SMSOnlineGH (SMS OTP delivery)",
      "Cloudinary (check-in photo storage/CDN)",
      "node-cron (scheduled jobs)",
      "ExcelJS (Excel report export)",
      "PDFKit (branded PDF report export)",
      "Recharts (dashboard charts)",
      "Vite 8 + Vitest (build/test)",
      "Docker (multi-stage Alpine build)",
      "PWA (manifest + service worker)",
    ],
    problem:
      "Verifying that employees were physically present at company meetings across departments had no reliable, auditable mechanism - sign-offs are easy to fake and don't scale across an organization with distributed departments and recurring mandatory/training meetings. HR and managers needed a way to enforce real GPS + photo proof of attendance, automatically flag no-shows, and generate exportable, audit-ready reports without manually cross-referencing paper or spreadsheet records.",
    architecture: {
      nodes: [
        { id: "client", label: "React Router PWA", sublabel: "GPS + camera check-in UI", x: 20, y: 140, kind: "client" },
        { id: "server", label: "React Router Server", sublabel: "SSR + role-based middleware", x: 280, y: 140, kind: "service" },
        { id: "cron", label: "Scheduled Jobs", sublabel: "Absent sweep + meeting gen", x: 280, y: 260, kind: "service" },
        { id: "db", label: "MongoDB Atlas", sublabel: "Users, meetings, attendance", x: 540, y: 140, kind: "data" },
        { id: "cloudinary", label: "Cloudinary", sublabel: "Check-in photo storage", x: 540, y: 20, kind: "external" },
        { id: "otp-channel", label: "SMTP / SMS Gateway", sublabel: "OTP delivery (email/SMS)", x: 540, y: 260, kind: "external" },
      ],
      edges: [
        { from: "client", to: "server", label: "loaders/actions" },
        { from: "server", to: "db", label: "read/write" },
        { from: "server", to: "cloudinary", label: "photo upload" },
        { from: "server", to: "otp-channel", label: "send OTP" },
        { from: "cron", to: "db", label: "absent sweep" },
      ],
    },
    features: [
      "Passwordless OTP login by email or SMS (Ghana phone normalization), with per-identifier rate limiting, resend cooldown, attempt lockout, and full audit logging of login events",
      "Geofenced, photo-verified meeting check-in: GPS accuracy gating, haversine distance-to-venue calculation, and automatic present/late/absent classification against the meeting's attendance window",
      "Recurring meeting templates (daily/weekly/monthly/yearly) that auto-generate upcoming meeting instances just-in-time via a cron job",
      "Automatic absent-sweep cron that closes meetings once their attendance window ends and marks any employee who never checked in as absent",
      "Role-scoped visibility (admin sees everything; meeting managers see only meetings they created) enforced through one shared scope resolver across meetings, attendance, feedback, and reports",
      "Employee feedback/appeal flow for late or absent records, reviewed by managers/HR, plus branded Excel and PDF report exports alongside in-app Recharts dashboards",
    ],
    challenges: [
      {
        title: 'Rethinking what "out of radius" should mean',
        detail:
          'The check-in logic originally treated failing the geofence as a hard rejection. It now deliberately downgrades an out-of-radius check-in to "absent" but still saves the GPS location, photo, and computed distance as evidence, and marks it final immediately - so the employee has proof they tried and can explain themselves through the feedback flow, instead of silently vanishing until the absent-sweep runs with no record at all.',
      },
      {
        title: "Idempotent, just-in-time recurring meetings",
        detail:
          "Meeting templates support daily/weekly/monthly/yearly recurrence with custom intervals, but occurrences are only generated when they're within a 2-hour horizon, tracked via a lastGeneratedThrough cursor and a pure nextOccurrences() stepping function. This keeps repeated cron runs from double-creating meetings while avoiding a naive 'generate everything up front' approach that would clutter the schedule weeks in advance.",
      },
      {
        title: "One visibility rule, many call sites",
        detail:
          "Admin-vs-manager data scoping (meetings, attendance, feedback, dashboards, reports, exports) all route through a single resolveMeetingScope/scopeToMeetingRefFilter pair rather than being reimplemented per feature. That surfaced a real gotcha: raw Model.aggregate() calls skip Mongoose's automatic string-to-ObjectId casting that .find() gets for free, so scope filters have to explicitly wrap IDs in new Types.ObjectId(...) or they silently match zero rows under aggregation while working fine elsewhere.",
      },
    ],
    lessons: [
      "Model the lifecycle/finality of a status up front - the isFinal flag on attendance records reads like it was retrofitted to distinguish 'definitively known now' (out-of-radius) from 'pending until the meeting closes' (present/late), which would have been simpler to design in from the start.",
      "Aggregation-pipeline ID casting is a repeat bug source, not a one-off - the same defensive comment about Model.aggregate() skipping ObjectId casting shows up independently in two separate services, suggesting it's worth solving once in a shared helper instead of re-warning future-me at every call site.",
      "A demo-driven shortcut (an explicit OTP bypass code, commented as temporary) is exactly the kind of thing that quietly survives past the demo if there's no tracked follow-up - worth ticketing removal instead of trusting a code comment to get seen again.",
    ],
    futureImprovements: [
      "The service worker is explicitly network-first with no offline caching yet - real offline support would matter for check-ins at mining sites with unreliable connectivity, but isn't built.",
      "Test coverage is limited to pure logic (haversine, recurrence, geo, status engine) - the attendance, auth, and report services, which carry most of the actual business rules, have no automated tests.",
      "The demo OTP bypass code path is still present in the codebase; it should be removed or hardened before treating this as fully production-locked-down rather than relying on an operator to unset an env var.",
    ],
  },
  {
    slug: "myskillsmate",
    title: "MySkillsMate",
    summary:
      "A services marketplace that matches clients in Ghana with local skilled workers (mechanics, plumbers, electricians, cleaners, etc.) by understanding a plain-language description of the problem rather than requiring a category pick - with a web app, a native mobile app, and a shared backend.",
    role: "Sole developer",
    timeframe: "2025–2026",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Zustand",
      "React Router",
      "React Hook Form + Zod",
      "Leaflet / react-leaflet",
      "i18next",
      "React Native",
      "Expo",
      "NativeWind",
      "React Navigation",
      "TanStack Query",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Socket.IO",
      "JWT (HTTP-only cookies)",
      "Cloudinary",
      "Nodemailer",
      "Jest + Supertest + mongodb-memory-server",
      "Paystack",
      "GitHub AI Models (GPT-4o)",
      "Docker",
    ],
    problem:
      "In Ghana's informal services market, finding a trustworthy nearby worker for a specific problem ('my fridge stopped cooling', 'car won't start') usually means asking around or scrolling generic classifieds with no real matching, no trust signals, and no way to track a job once it's booked. MySkillsMate exists to let a client describe their actual problem in plain language and get ranked, nearby, vetted providers - with booking, in-app chat, payment, and reviews handled end to end, instead of requiring them to correctly self-categorize their problem first.",
    architecture: {
      nodes: [
        { id: "web", label: "Web App", sublabel: "React 19 + Vite SPA", x: 20, y: 40, kind: "client" },
        { id: "mobile", label: "Mobile App", sublabel: "React Native (Expo)", x: 20, y: 280, kind: "client" },
        { id: "api", label: "API Server", sublabel: "Express REST + Socket.IO", x: 280, y: 160, kind: "service" },
        { id: "ai", label: "Intent Detection", sublabel: "GPT-4o + keyword fallback", x: 540, y: 40, kind: "external" },
        { id: "db", label: "MongoDB", sublabel: "Geo + aggregation matching", x: 540, y: 280, kind: "data" },
        { id: "external", label: "Cloudinary / Paystack", sublabel: "Media storage + payments", x: 800, y: 160, kind: "external" },
      ],
      edges: [
        { from: "web", to: "api", label: "REST + WS" },
        { from: "mobile", to: "api", label: "REST + WS" },
        { from: "api", to: "ai", label: "classify request" },
        { from: "api", to: "db", label: "geo match" },
        { from: "api", to: "external", label: "uploads/pay" },
      ],
    },
    features: [
      "Description-first provider matching: a client's free-text problem description is classified into a category/skills by GPT-4o (with a deterministic keyword-overlap fallback if the AI call fails), then used as the primary signal in a weighted MongoDB aggregation that also scores distance, rating, completion rate, response time, repeat-client history, and subscription tier",
      "Map-first, geolocation-aware match results (Leaflet on web) showing ranked nearby providers rather than a flat list",
      "Real-time messaging and notifications over Socket.IO, including online-status tracking, typing indicators, and chat attachments (images/PDFs)",
      "End-to-end booking lifecycle: request → quote → booking → in-app Paystack checkout → completion → review, plus dispute handling and a provider earnings ledger with commission tracking",
      "Native mobile app (React Native/Expo) with its own onboarding, auth, provider dashboard, and push notifications - feature-parity pass against the web app rather than a wrapped webview",
      "Role-based experience for clients, workers (providers), and admins, including an admin dashboard for worker-application review and service approval",
      "i18n support (English/French) across both web and mobile clients",
    ],
    challenges: [
      {
        title: "Category-blind matching bug",
        detail:
          "The original matching pipeline hard-filtered candidate providers by the category the client manually selected before scoring even began, so a wrong or approximate category pick made it structurally impossible for the right provider to ever surface - e.g. a mechanic never showing up for 'my car won't start' filed under the wrong category. The fix removed the pre-filter, cast the candidate pool wide on availability/geography only, and made the AI-detected category/skills from the description the dominant scoring factor while the user-picked category became a small secondary signal - right by construction, not by luck.",
      },
      {
        title: "AI dependency without a hard failure mode",
        detail:
          "Intent detection depends on an external LLM call (GitHub AI Models/GPT-4o) that can time out or fail. The service wraps it with a timeout and falls back to a hand-tuned keyword/synonym scorer over the same skill taxonomy, with its confidence explicitly capped below what a real AI classification would report so downstream UI never overstates certainty from a heuristic match - and any category/skill the model returns is validated against the real taxonomy before being trusted, since a hallucinated category would otherwise be a silent dead end.",
      },
      {
        title: "Migrating mobile from a WebView wrapper to a native app",
        detail:
          "Mobile started as a hybrid app embedding the web app in a WebView with an auth-synchronization bridge, then was rebuilt screen-by-screen into a fully native React Navigation app with its own screens, drawer navigation, and native profile UI - driven by real-device testing that surfaced release-build bugs (upload crashes, a double-hashing password bug locking users out, safe-area padding issues) that a webview shell couldn't paper over.",
      },
    ],
    lessons: [
      "Filtering candidates before scoring (instead of scoring everyone and letting weights decide) silently caps what a matching system can ever return - worth designing the 'who's even eligible' step as wide as possible from day one, not as an afterthought fix.",
      "Any AI call in a user-facing path needs a same-shape, clearly-lower-confidence fallback from the start, not bolted on later - the keyword fallback and confidence-capping were a direct response to the AI endpoint being an external, sometimes-slow dependency.",
      "Starting mobile as a WebView wrapper got something shippable fast, but the eventual full native rewrite (and the crash/bug backlog real-device testing turned up) suggests it would have been cheaper to commit to native navigation earlier rather than migrating screen-by-screen later.",
    ],
    futureImprovements: [
      "Payment provider is hard-coupled to Paystack behind an internal interface intended for a future escrow/split-payment provider - that abstraction exists but no second provider is implemented yet.",
      "Admin/audit tooling suggests ongoing manual QA rather than automated linting/i18n-completeness checks in CI - worth formalizing.",
    ],
  },
  {
    slug: "borderhub-operating-system",
    title: "BorderHub Operating System",
    summary:
      "A multi-division ERP for a small holding company that runs several unrelated businesses (transport/fleet, construction, retail trading, services) under one roof - it consolidates income, expenses, and trading capital from every division into a single live profit ledger, with automated WhatsApp reminders for outstanding loans.",
    role: "Sole developer",
    timeframe: "2026",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "React Router 7",
      "Zustand",
      "React Hook Form + Zod",
      "Recharts",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "JWT (access + refresh tokens)",
      "whatsapp-web.js (Puppeteer)",
      "wwebjs-mongo (remote session store)",
      "node-cron",
      "helmet + express-rate-limit",
      "Render",
    ],
    problem:
      "The business ran several unrelated ventures (a small transport fleet, a construction arm, cement/drinks trading, and misc. services) with money, stock, and cash loans moving between them informally - tracked in people's heads or scattered paper/phone records. There was no single place to see whether the company as a whole was profitable, which division was actually making money, how much cash was tied up in stock vs. loaned out to staff, or who owed money and when it was due. BorderHub was built to give the owner one dashboard that answers those questions in real time instead of reconstructing them at month-end.",
    architecture: {
      nodes: [
        { id: "client", label: "React SPA", sublabel: "Vite + Zustand SPA", x: 20, y: 140, kind: "client" },
        { id: "api", label: "Express API", sublabel: "REST + role-based auth", x: 280, y: 140, kind: "service" },
        { id: "ledger", label: "Division Ledger Engine", sublabel: "Aggregates division revenue", x: 540, y: 20, kind: "service" },
        { id: "db", label: "MongoDB", sublabel: "Mongoose models", x: 800, y: 140, kind: "data" },
        { id: "cron", label: "Cron Scheduler", sublabel: "Daily loan-due check", x: 280, y: 280, kind: "service" },
        { id: "whatsapp", label: "WhatsApp Web Client", sublabel: "Headless Chrome (Puppeteer)", x: 540, y: 280, kind: "external" },
      ],
      edges: [
        { from: "client", to: "api", label: "REST + JWT" },
        { from: "api", to: "db", label: "CRUD" },
        { from: "api", to: "ledger", label: "get report" },
        { from: "ledger", to: "db", label: "reads data" },
        { from: "cron", to: "db", label: "check loans" },
        { from: "cron", to: "whatsapp", label: "reminder" },
      ],
    },
    features: [
      "Pluggable division registry - each business unit (transport, construction, retail, services) implements a common revenue-summary interface, and a central LedgerService fans out to all of them in parallel (Promise.allSettled) to build one consolidated profit report",
      "Trading capital ledger with a running state machine: injections, stock restocks, sales, loans-out, loan returns, and manual adjustments all move a single capital account between cash/cement-stock/drinks-stock/loaned buckets, with every transaction storing a snapshot of the resulting balances",
      "Automated 'carryover debt' calculation - walks each division's income/expenses day by day to compute how much of today's profit is actually free cash vs. still owed to cover a prior day's loss, before crediting anything to the bank total",
      "Daily automated WhatsApp loan reminders sent to staff who borrowed against trading capital and haven't returned it by their expected date, via a headless-Chrome WhatsApp Web session persisted in MongoDB (RemoteAuth) so it survives redeploys",
      "Role-based access control (super admin, operations admin, branch manager, accountant, transport operator, shop operator, view-only) with JWT access/refresh tokens and axios interceptor auto-refresh on 401",
      "Legacy fleet-operations module (vehicles, drivers, trips, inventory, sales) kept live in the API for backward compatibility while hidden from the new UI, after the product pivoted from a single-business fleet tracker to a multi-division profit-intelligence platform",
    ],
    challenges: [
      {
        title: "Consolidating profit across unrelated business models",
        detail:
          "Each division makes money differently - transport is per-trip, retail is per-sale, others are simpler income/expense - so a naive shared schema wouldn't fit all of them. The fix was a shared division-service interface each division implements independently (its own aggregation query against its own data), with a LedgerService that calls all of them in parallel and merges the results into one report, so adding a new business line later means writing one new service class rather than touching shared logic.",
      },
      {
        title: "Turning raw income/expense entries into an accurate bank balance",
        detail:
          "An early version of the treasury summary just summed all income minus all expenses per bank, which overstated cash on hand because a loss on one day doesn't roll backward - it has to be paid off by a later day's profit before anything actually reaches the bank. This was rewritten into a day-by-day walk per division that accumulates a 'carryover debt' balance and only credits bank-deposited cash once that debt is cleared.",
      },
      {
        title: "Keeping a WhatsApp bot session alive on a memory-constrained host",
        detail:
          "whatsapp-web.js drives a real headless Chrome instance via Puppeteer, which is heavy for a small Render web service and kept crashing or losing its session on redeploy. The session was moved to RemoteAuth backed by wwebjs-mongo (so login persists in the database instead of local disk), and Puppeteer was tuned with single-process/disable-gpu flags and a platform-conditional executable path across several follow-up commits to get it stable on Render's Linux environment.",
      },
    ],
    lessons: [
      "Ship the simplest financial model first and correct it once real data exposes the edge case - the carryover-debt logic only got built after the naive income-minus-expense sum produced a bank balance that didn't match reality, which was faster to spot in production data than to have predicted upfront.",
      "A background process that drives a real browser (Puppeteer/WhatsApp) has very different deployment constraints than the rest of the stack - it deserved its own resource budget and startup sequencing from day one instead of being bolted onto the same web service late.",
      "Building the division system as a registry of independent services (rather than one shared schema trying to fit every business type) made adding new business lines cheap after the fact, which justified the extra upfront abstraction for a project that was explicitly going to grow past its first business type.",
    ],
    futureImprovements: [
      "The loan-reminder cron sends a flat daily digest with no de-duplication once a loan is overdue, and skips loans with no expected-return date entirely - it needs actual scheduling logic (e.g. remind at T-3, T-0, then weekly) and a fallback for loans recorded without a due date.",
      "The legacy fleet routes (trips, vehicles, inventory, sales) are still live on the API purely for backward compatibility with no scheduled removal - they should either be migrated into the division model or formally deprecated.",
    ],
  },
  {
    slug: "keepxtra",
    title: "KeepXtra",
    summary:
      "Cold-chain logistics platform connecting smallholder farmers in Ghana to cold storage, quality inspection, and delivery for restaurants, hotels, retailers, and wholesalers - reducing post-harvest produce loss across the supply chain.",
    role: "Sole developer",
    timeframe: "2026",
    tech: [
      "React 19",
      "TypeScript",
      "Vite",
      "React Router",
      "Tailwind CSS",
      "TanStack Query",
      "React Hook Form + Zod",
      "Framer Motion",
      "Recharts",
      "Node.js",
      "Express 5",
      "MongoDB + Mongoose",
      "Redis (ioredis, rate-limit-redis)",
      "JWT (jsonwebtoken)",
      "bcrypt",
      "Swagger/OpenAPI",
      "Vitest + Supertest + mongodb-memory-server",
      "Prometheus (prom-client)",
      "Pino (structured logging)",
      "Docker + Docker Compose",
      "GitHub Actions CI",
    ],
    problem:
      "Post-harvest food loss is a major problem for smallholder farmers in Ghana: without access to cold storage, a large share of harvested produce spoils before it ever reaches a buyer, and farmers have no reliable channel to sell directly to restaurants, hotels, retailers, or wholesalers at fair prices. KeepXtra targets that gap by giving farmers a way to submit a harvest for pickup and cold storage, and by giving operations staff a system to manage pickup logistics, warehouse placement, quality grading, and sales through to farmer payout.",
    architecture: {
      nodes: [
        { id: "client", label: "React frontend", sublabel: "Marketing site + dashboards", x: 20, y: 140, kind: "client" },
        { id: "api", label: "Express REST API", sublabel: "/api/v1 REST routes", x: 270, y: 140, kind: "service" },
        { id: "services", label: "Services + event bus", sublabel: "Auto-create chains", x: 520, y: 140, kind: "service" },
        { id: "mongo", label: "MongoDB", sublabel: "Mongoose models", x: 770, y: 140, kind: "data" },
        { id: "redis", label: "Redis", sublabel: "Rate-limit store + cache", x: 770, y: 260, kind: "data" },
      ],
      edges: [
        { from: "client", to: "api", label: "REST + JWT" },
        { from: "api", to: "services", label: "calls service" },
        { from: "services", to: "mongo", label: "read/write" },
        { from: "services", to: "redis", label: "rate limit" },
      ],
    },
    features: [
      "10 end-to-end business modules covering the full produce lifecycle: auth, farmer management, storage requests, pickups, driver/vehicle fleet, warehouse/cold-room inventory, quality inspection, orders/sales, payouts, and reporting",
      "Role-based access control across 6 operations roles (Operations, Warehouse Staff, Driver, Finance, Manager, Super Admin) plus a farmer role, enforced per-endpoint via permission middleware",
      "Event-driven auto-creation chain: an approved storage request spawns a pickup, a completed pickup spawns an inventory record - decoupled via an in-process event bus rather than hand-called at each mutation site",
      "JWT access + rotating refresh-token auth with reuse detection (a stolen/replayed refresh token revokes the entire token family and force-logs-out all sessions), refresh token held in an httpOnly cookie, access token kept in memory only on the client",
      "Audit logging on every state-changing mutation (who changed what, from what value, to what value) plus a separate human-readable activity timeline for dashboards",
      "Production-hardening pass: containerized (multi-stage Dockerfile + docker-compose for dev and prod), rate-limited, Prometheus metrics, structured Pino logging, Swagger/OpenAPI docs served live, Vitest test suite (125 test files) run against an in-memory MongoDB in CI",
    ],
    challenges: [
      {
        title: "Refresh-token rotation with reuse detection",
        detail:
          "Implemented short-lived (15 min) JWT access tokens paired with a 30-day opaque refresh token stored server-side by hash, not raw value. Every refresh call rotates the token and revokes the one presented; if a revoked token is ever presented again - meaning it was stolen and used after the legitimate client already rotated - the whole rotation 'family' is revoked and the user is logged out everywhere. On the frontend, concurrent 401s from several in-flight requests are coalesced into a single refresh call instead of firing one refresh per failed request.",
      },
      {
        title: "Decoupling the produce lifecycle with an event bus",
        detail:
          "The lifecycle from storage request → pickup → warehouse receipt → inventory → sale → payout spans multiple services, each of which needs to trigger side effects (auto-creating the next record, sending notifications, writing audit entries) without every service knowing about every downstream consumer. Solved with a lightweight in-process event bus and dedicated listener modules per concern, registered once at startup - auto-creation is fire-and-forget so the triggering HTTP response isn't held up, and failures are logged rather than thrown.",
      },
      {
        title: "Wiring a real backend onto a frontend built against mocked services",
        detail:
          "The frontend was originally built end-to-end against mock data with a documented service contract. The backend's architecture was designed as a reverse-engineering exercise against those existing function signatures before implementation started, and the first real integration preserves the mock's flat-array return contract by transparently fetching every page of a paginated backend endpoint and flattening it client-side, so existing components needed no prop changes.",
      },
    ],
    lessons: [
      "Writing the backend architecture doc (data model, auth flow, layering) against the frontend's already-agreed mock contracts before touching implementation code caught several contract gaps early that would have been more expensive to discover mid-implementation.",
      "Money should be modeled as integer minor units from day one - this was designed in from the start specifically to avoid floating-point rounding drift, rather than being a retrofit.",
      "Finishing backend production-hardening (Docker, rate limiting, monitoring, CI) before finishing the frontend integration left a gap where two of three frontend service modules still run on mock data - a reminder to sequence full vertical slices rather than polishing one layer at a time.",
    ],
    futureImprovements: [
      "Wire the remaining frontend service modules to the real backend API (only auth is connected today) - the biggest remaining gap between what the UI shows and what's actually persisted",
      "Add a frontend automated test suite - the backend has 125 test files (Vitest/Supertest against an in-memory MongoDB) but the frontend currently has none",
      "Integrate a real payment gateway behind the existing payments/payout module, and wire a real error-tracking provider into the existing error-reporting hook",
    ],
  },
  {
    slug: "meditrack",
    title: "Meditrack",
    summary:
      "A multi-facility pharmaceutical inventory system that tracks drug stock, dispensing, and cross-facility redistribution, with AI-assisted suggestions for moving near-expiry surplus stock to facilities that need it - built for resource-constrained pharmacies/health facilities in Ghana.",
    role: "Sole developer",
    timeframe: "2025",
    tech: [
      "React 19",
      "Vite 6",
      "Redux Toolkit",
      "React Router v7",
      "Tailwind CSS v4",
      "Recharts",
      "Socket.IO client",
      "jsPDF / jsPDF-AutoTable",
      "@zxing/browser + html5-qrcode",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "Redis",
      "Socket.IO",
      "JWT",
      "Nodemailer",
      "node-cron",
      "OpenAI SDK (GitHub Models inference, gpt-4.1)",
    ],
    problem:
      "Small health facilities often manage drug stock manually or in spreadsheets, which makes it hard to catch expiring medication before it's wasted or to know that a nearby facility already has surplus of a drug another facility is running low on. Meditrack was built to give staff at multiple facilities a shared, real-time view of stock levels, automate expiry/low-stock alerts, and let facilities formally request and approve redistribution of drugs between each other instead of letting near-expiry stock go to waste.",
    architecture: {
      nodes: [
        { id: "client", label: "React SPA", sublabel: "Vite + Redux Toolkit", x: 20, y: 140, kind: "client" },
        { id: "api", label: "Express API", sublabel: "REST + Socket.IO server", x: 280, y: 140, kind: "service" },
        { id: "db", label: "MongoDB", sublabel: "Mongoose models", x: 540, y: 140, kind: "data" },
        { id: "cron", label: "node-cron jobs", sublabel: "Expiry checks + snapshots", x: 280, y: 280, kind: "service" },
        { id: "cache", label: "Redis", sublabel: "Report + response cache", x: 540, y: 280, kind: "data" },
        { id: "external", label: "External services", sublabel: "SMTP + LLM inference", x: 800, y: 280, kind: "external" },
      ],
      edges: [
        { from: "client", to: "api", label: "REST + WS" },
        { from: "api", to: "db", label: "read/write" },
        { from: "api", to: "cache", label: "cache r/w" },
        { from: "cron", to: "db", label: "snapshots" },
        { from: "cron", to: "api", label: "notify" },
        { from: "api", to: "external", label: "email + LLM call" },
      ],
    },
    features: [
      "Facility-scoped drug inventory tracking (stock levels, batch numbers, expiry dates, reorder thresholds) with QR-code scanning to auto-fill and submit new stock intake",
      "Dispensation logging that decrements stock and records who a drug was dispensed to",
      "Cross-facility redistribution workflow with request/approve/decline states and a post-hoc effectiveness/feedback field",
      "AI-assisted redistribution suggestions: computes each facility's average daily drug consumption, flags near-expiry surplus, matches it against facilities under their reorder level, and calls an LLM to generate a human-readable justification for each suggested transfer",
      "Real-time low-stock/expiry/redistribution notifications pushed via Socket.IO to facility- and user-scoped rooms, plus a daily cron job that scans inventory for items expiring within 30 days",
      "Role-based dashboards and reports (expired, near-expiry, dispensed, redistribution, inventory) exportable as PDF/CSV, with role-gated access for staff/pharmacist/supervisor/admin",
    ],
    challenges: [
      {
        title: "AI-assisted redistribution suggestions",
        detail:
          "The hardest feature was going beyond simple stock alerts to actually suggest which facility should receive which surplus drug. This required computing average daily consumption per facility from dispensation history, cross-referencing it against near-expiry surplus elsewhere, and then calling an LLM (via the GitHub Models inference API, gpt-4.1) to turn the matched data into a readable justification - including exponential-backoff retry handling for rate limits from the inference endpoint.",
      },
      {
        title: "Multi-tenant data isolation bugs",
        detail:
          "Because every entity (inventory, notifications, activity logs) is scoped to a facility, a few bugs slipped through where users could see data outside their own facility - fixed by explicitly limiting notification access to the user's assigned facility - and a related caching bug where activity logs weren't showing new entries due to a facility-ID type mismatch interacting with the Redis cache key.",
      },
      {
        title: "Transactional stock updates across facilities",
        detail:
          "Redistribution has to decrement stock at the sending facility and credit it at the receiving facility as one logical operation. This was implemented as a distinct transactional update to avoid stock drifting out of sync if one side of the update failed.",
      },
    ],
    lessons: [
      "CORS and Socket.IO origin config were hardcoded to localhost initially and had to be refactored to read from an environment variable later - environment-driven config for cross-origin and real-time connections should be set up from day one, not retrofitted.",
      "Introducing Redis caching without deciding cache-invalidation and key-scoping rules together with the multi-tenant facility model up front led directly to a stale-cache bug on the activity log - caching strategy needs to be designed alongside data isolation, not layered on after.",
      "The project has almost no authored documentation - writing setup/architecture docs as features ship, rather than after, would make the project far easier for anyone else (including future me) to pick up.",
    ],
    futureImprovements: [
      "Add Docker/docker-compose and CI (none exist currently) so the app can be built and deployed reproducibly instead of manually",
      "Document and centralize required environment variables - the committed example env file is missing variables that the code actually requires",
      "Replace the free-text supplier field on inventory with a real Supplier entity, and clean up leftover scaffolding from early setup",
    ],
  },
  {
    slug: "fire-truck-checklist",
    title: "Fire Truck Inspection Checklist",
    summary:
      "An internal web app for Adamus Resources Ltd's fire and emergency response crew to replace paper pre-use inspection forms for fire tenders and portable fire pumps with a digital checklist, dashboard, and PDF reporting system.",
    role: "Sole developer",
    timeframe: "2025",
    tech: [
      "React 19",
      "React Router 7 (framework mode, SSR)",
      "TypeScript",
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "Tailwind CSS 4",
      "Vite 7",
      "html2canvas",
      "jsPDF",
      "react-hot-toast",
      "cookie-based sessions (React Router createCookieSessionStorage)",
      "Docker (multi-stage node:20-alpine build)",
    ],
    problem:
      "Fire tender and portable fire pump pre-use inspections at the mine site were done on paper checklists (Section A: ~42-point vehicle/fire tender check, Section B: 7-point pump check), which were slow to fill out, easy to lose, and gave no searchable record of past inspections or recurring defects. Supervisors had no quick way to see inspection history, filter by vehicle or crew, or pull a report for a specific date. The goal was a simple, mobile-friendly replacement that inspectors could fill out on a phone or tablet during their shift and that produced an auditable, downloadable record.",
    architecture: {
      nodes: [
        { id: "client", label: "Inspector Browser", sublabel: "Mobile + desktop UI", x: 20, y: 140, kind: "client" },
        { id: "ssr-app", label: "React Router SSR App", sublabel: "Route loaders/actions", x: 280, y: 140, kind: "service" },
        { id: "session", label: "Cookie Session Store", sublabel: "httpOnly cookie (userId)", x: 280, y: 280, kind: "service" },
        { id: "mongo", label: "MongoDB", sublabel: "Inspections + users", x: 540, y: 140, kind: "data" },
        { id: "pdf", label: "Client-side PDF export", sublabel: "html2canvas + jsPDF", x: 540, y: 20, kind: "client" },
      ],
      edges: [
        { from: "client", to: "ssr-app", label: "HTTP forms" },
        { from: "ssr-app", to: "session", label: "read/write" },
        { from: "ssr-app", to: "mongo", label: "read/write" },
        { from: "client", to: "pdf", label: "render → PDF" },
      ],
    },
    features: [
      "Employee-ID-based login (no self-registration - admins pre-provision users via a CLI script; name and role are looked up from the ID, no password flow in the current build)",
      "Digital inspection form split into Section A (fire tender, ~42 checklist/reading items) and Section B (portable fire pump, 7 items), with per-item OK/Defective toggles, required remarks on any defect, and a numeric odometer/reading input",
      "Client-side progress bar and validation that blocks submission until all required fields, statuses, and defect remarks are filled in, with toast notifications for specific missing items",
      "'Mark All OK' / 'Mark All Defective' bulk actions per section to speed up routine inspections",
      "Dashboard listing all inspections with search (vehicle/inspector), crew and vehicle filters, date-range filtering, and pagination, plus status badges (Draft / Defect Found / No Defect)",
      "Per-inspection report view that mirrors the paper form layout and can be exported to a multi-page PDF in-browser via html2canvas + jsPDF",
    ],
    challenges: [
      {
        title: "Reproducing a multi-page paper form as a validated digital flow",
        detail:
          "The original paper checklist had two structurally different sections (pure pass/fail checks vs. numeric readings like pump pressure and flow rate) mixed into the same list, plus a rule that any 'Defective' mark requires a written remark. The form logic had to branch per-item on a check-vs-input type, track validation errors keyed by item id (and a separate key for missing defect explanations), and surface all of this with per-field error styling and toasts before allowing submission - there's no server-side schema validation backing it up, so all the real enforcement lives in that client handler.",
      },
      {
        title: "Exporting a styled HTML report to a reliable multi-page PDF",
        detail:
          "jsPDF alone can't lay out the existing Tailwind-styled report, so the report DOM is rasterized with html2canvas at 2x scale and then sliced into A4-height pages by tracking the remaining height and repeatedly calling addPage() - a manual pagination loop since the canvas image is one continuous bitmap rather than reflowable text.",
      },
      {
        title: "Migrating the login system from name-based to employee-ID-based auth",
        detail:
          "An earlier version of the app apparently logged users in by name, which broke down once multiple users shared a name. The fix was a schema change (unique employee ID, non-unique name) plus a one-off migration script that backfills IDs for existing users and a duplicate-resolution script to fix collisions before the unique index could be applied.",
      },
    ],
    lessons: [
      "Authentication here is intentionally minimal (no password check - the User model even has a password field with a comment admitting it should be hashed in a real app, and the session secret is a literal hardcoded string instead of an env var); fine for a trusted internal tool, but next time I'd set up real credential checks and env-based secrets from day one rather than retrofitting them later.",
      "Putting all form-completeness rules (required fields, defect-remarks requirement, per-item validation) only on the client means the create-inspection action would happily persist a malformed report if called directly - I'd move at least the defect-requires-remarks and required-field rules into the action/loader layer next time.",
      "Building the signature-pad component before deciding where signatures fit in the workflow meant it shipped fully coded (drawing, clear, touch support) but unused by any route - a sign that component and workflow design should happen together, not in advance of feature sequencing.",
    ],
    futureImprovements: [
      "Wire up the already-built signature-pad component into the inspection form/report so inspectors and supervisors can actually sign off on reports, since it's fully implemented but currently imported nowhere",
      "Add real password-based (or SSO) authentication and move the session secret to an environment variable - current login trusts employee ID alone and the cookie secret is hardcoded",
      "Move form-validation rules (required fields, defect-remarks-required) server-side in the create-inspection action so an incomplete/invalid report can't be created by bypassing the client, and make vehicle registration options (currently hardcoded to two trucks) configurable instead of hardcoded",
    ],
  },
  {
    slug: "lecturemate-wellness",
    title: "LectureMate - LMS & Student Wellness Platform",
    summary:
      "A role-based learning management system where educators publish vetted courses and students track progress, alongside a built-in mental-wellness layer (daily mood tracking and an AI counselor) aimed at students juggling coursework and wellbeing.",
    role: "Sole full-stack developer",
    timeframe: "2025 (Jul–Aug, ~3 week build)",
    tech: [
      "React 19",
      "Vite",
      "React Router v7",
      "Tailwind CSS v4",
      "Radix UI",
      "Recharts",
      "Node.js",
      "Express 5",
      "MongoDB",
      "Mongoose",
      "JWT (httpOnly cookies)",
      "bcryptjs",
      "Multer",
      "Cloudinary",
      "Nodemailer",
      "Azure AI Inference SDK (GitHub Models, GPT-4.1)",
    ],
    problem:
      "Educators without an existing platform have no lightweight way to get vetted and publish structured courses (chapters/lectures) to students, while students enrolled in courses have no way to track how the workload is affecting their mental state. LectureMate targets both sides at once: a small admin team approving educator applications, and students who want course progress tracking and a low-friction wellness check-in without leaving the LMS.",
    architecture: {
      nodes: [
        { id: "frontend", label: "React SPA", sublabel: "Vite, Tailwind, Radix UI", x: 20, y: 140, kind: "client" },
        { id: "api", label: "Express API", sublabel: "REST + role middleware", x: 280, y: 140, kind: "service" },
        { id: "mongodb", label: "MongoDB", sublabel: "User, course, mood models", x: 540, y: 140, kind: "data" },
        { id: "cloudinary", label: "Cloudinary", sublabel: "Course thumbnail hosting", x: 540, y: 280, kind: "external" },
        { id: "ai-service", label: "GitHub Models", sublabel: "GPT-4.1 via Azure AI SDK", x: 540, y: 20, kind: "external" },
      ],
      edges: [
        { from: "frontend", to: "api", label: "REST + JWT" },
        { from: "api", to: "mongodb", label: "read/write" },
        { from: "api", to: "cloudinary", label: "thumbnail upload" },
        { from: "api", to: "ai-service", label: "chat completions" },
      ],
    },
    features: [
      "Role-based auth (student/educator/admin) using httpOnly JWT cookies, with an admin approval queue that gates educators (status: pending/approved/rejected) before they can publish",
      "Multi-step educator vetting/onboarding (expertise, institution, teaching mode, availability, platforms used) and a separate student onboarding (university, major, learning style, goals) stored as dedicated profile documents",
      "Course authoring with nested chapters/lectures, thumbnail upload to Cloudinary, and per-lecture progress tracking that recomputes completion % and flips an isCompleted flag once every lecture is marked done",
      "Course catalog with search, category filter, pagination, a featured-courses endpoint, and a 'recommended' endpoint sorted by enrollments + rating, plus a course review/ratings system",
      "Daily mood tracker (5-point scale + notes) enforced to one entry per user per day via a compound unique Mongo index, rendered as a 7-day trend chart",
      "AI wellness insights and an AI counselor chat for students, backed by GPT-4.1 through GitHub Models/Azure AI Inference SDK, using the student's real mood history as prompt context",
    ],
    challenges: [
      {
        title: "Onboarding state machine + role-gated routing",
        detail:
          "A user can be authenticated but not yet onboarded, or onboarded but the wrong role for a route. This was reworked so a private-route wrapper checks auth, onboarding status, and role before rendering, redirecting to the right onboarding page per role, while the backend rejects a second onboarding submission for a profile that already exists.",
      },
      {
        title: "Lecture-level progress calculation",
        detail:
          "Marking a lecture complete has to recompute a course's overall completion percentage from nested chapter/lecture arrays rather than a flat count, guard against double-marking the same lecture, and flip the course's completed flag only when every lecture across every chapter is done - logic that's easy to get subtly wrong with nested subdocuments.",
      },
      {
        title: "Multipart thumbnail upload through Cloudinary",
        detail:
          "Course creation accepts a multipart form (Multer) so a thumbnail file and structured course data (chapters/tags/contentLinks) can travel in one request; since multipart fields arrive as strings, those array/object fields are JSON-stringified on the client and parsed server-side before the image is streamed to Cloudinary. A dedicated follow-up fix was needed after the initial upload integration, since the first pass didn't return/render the URL correctly.",
      },
    ],
    lessons: [
      "The AI content generator page for educators (course outline/description/quiz generation) still calls mock stub functions instead of the real backend AI service - only the student-facing wellness insights and counselor chat are actually wired to GPT-4.1. Shipping a stub integration alongside a real one made it easy to lose track of what was actually live.",
      "A one-off migration script has a hardcoded MongoDB Atlas connection string instead of reading it from env like the rest of the app does - a reminder that 'just a quick script' still needs the same secrets discipline as production code, especially in a public repo.",
      "CORS and the frontend API base URL are hardcoded to localhost with no env-based config, so the app can't be pointed at a deployed backend without code changes - environment config should have been set up from the first commit, not retrofitted later.",
    ],
    futureImprovements: [
      "No deployment setup exists (no Dockerfile, no hosted env config) - the project only runs locally today",
      "Wire the educator AI content generator to the real backend AI service instead of the mocked stubs",
      "Rotate the exposed MongoDB credentials in the migration script and move them to environment variables",
      "No automated tests - the backend's test script is still the default placeholder that exits with an error",
    ],
  },
  {
    slug: "jkm-drinks-depot",
    title: "JKM Drinks Depot",
    summary:
      "A mobile-first point-of-sale system for a drinks depot business, built so attendants, managers, and the owner share one live inventory and sales ledger across multiple phones/devices, with FIFO-accurate cost tracking and a tamper-resistant daily cash-up.",
    role: "Sole developer",
    timeframe: "2026",
    tech: [
      "React 19",
      "React Router v8 (SSR framework mode)",
      "TypeScript",
      "MongoDB (native driver, multi-document transactions)",
      "Tailwind CSS v4",
      "JWT session auth (jsonwebtoken)",
      "@dnd-kit (drag-and-drop reordering)",
      "Recharts",
      "Vite",
      "Docker",
    ],
    problem:
      "A small drinks depot is staffed by rotating attendants on shared devices, with a manager and CEO needing an accurate daily read on stock, sales, and profit. Paper or spreadsheet tracking makes it easy for stock counts to drift or be quietly adjusted to hide shrinkage, and gives the owner no reliable per-sale cost/profit figure when restock prices change over time.",
    architecture: {
      nodes: [
        { id: "client", label: "Browser / mobile client", sublabel: "React 19 UI, 30s bootstrap poll", x: 20, y: 140, kind: "client" },
        { id: "server", label: "React Router SSR server", sublabel: "SSR pages + JSON API routes", x: 280, y: 140, kind: "service" },
        { id: "auth", label: "JWT session + role gate", sublabel: "scrypt passwords, role checks", x: 280, y: 20, kind: "service" },
        { id: "data", label: "MongoDB Atlas", sublabel: "FIFO stock batches, transactions", x: 520, y: 140, kind: "data" },
      ],
      edges: [
        { from: "client", to: "server", label: "fetch + SSR" },
        { from: "server", to: "auth", label: "verify JWT" },
        { from: "server", to: "data", label: "read/write" },
      ],
    },
    features: [
      "POS checkout against live shared stock - blocks oversell, and voiding a sale reverses the exact FIFO batches it drew from",
      "FIFO cost-layer inventory: each restock opens an immutable stock batch at its own cost, while selling-price changes apply storewide immediately",
      "Three-tier role access (CEO / manager / attendant) enforced server-side per API route, with a client-side role guard as defense in depth",
      "Business-day lifecycle with one shared day per calendar date - auto-opened/closed, attendants can only close using system-expected stock, managers can record counted stock with mandatory reasons for variance",
      "Drag-to-reorder product list (@dnd-kit) with sort order persisted and audit-stamped (who/when reordered)",
      "Dashboard and reports (Recharts) covering sales, profit, expenses, attendants, and inventory",
    ],
    challenges: [
      {
        title: "MongoDB driver breaking under Vite's SSR pipeline",
        detail:
          "The native mongodb driver's low-level socket/DNS code hung when Vite tried to transform it through the SSR module pipeline. Fixed by excluding mongodb from both ssr.external and optimizeDeps.exclude in vite.config.ts so it loads via native Node require instead of being bundled.",
      },
      {
        title: "Reversible FIFO cost accounting",
        detail:
          "Sales need to consume stock oldest-batch-first for accurate cost/profit, but voids have to undo that exactly. Solved by never deleting stock batches - they're kept at zero quantity after depletion - so voidSale can look up and restore the precise batches a sale drew from.",
      },
      {
        title: "Keeping attendants from manipulating the daily close",
        detail:
          "Attendants can close a business day, but the server discards any counted-stock or adjustment-reason fields they submit and forces the close to equal system-expected stock regardless of the request body. Managers/CEO are the only roles allowed to record a physical count and variance reason, keeping shrinkage reporting honest.",
      },
    ],
    lessons: [
      "The README was never rewritten from the create-react-router scaffold - documentation was treated as optional and is now a real gap; next time write it alongside the first feature commit, not after.",
      "Shipped with no .env.example, so the two required env vars (MONGODB_URI, JWT_SECRET) are only discoverable by hitting the runtime error messages - a five-minute file would have saved onboarding friction.",
      "'Shared inventory' is a 30-second poll-and-refetch of the whole dataset, not real push sync - fine at single-depot scale, but wouldn't hold up with more devices or locations without moving to websockets/SSE.",
    ],
    futureImprovements: [
      "No offline support: the service worker is a deliberate no-op that unregisters itself, so a dropped connection mid-shift stops checkout cold on a phone-based POS.",
      "No receipt or printer integration (no ESC/POS, no print flow) despite being a natural next step for a retail POS.",
      "No automated tests and no CI - correctness currently relies entirely on manual testing.",
    ],
  },
  {
    slug: "stellopos",
    title: "StelloPOS",
    summary:
      "A restaurant point-of-sale system for taking orders, routing them to a kitchen display, processing payments, and printing receipts on thermal printers - built for small restaurants/cafes (default branding references a Ghana-based restaurant, GH₵ currency).",
    role: "Sole developer",
    timeframe: "2025-2026",
    tech: [
      "React 19",
      "Vite 7",
      "React Router 7",
      "Tailwind CSS 4",
      "Radix UI",
      "React Hook Form + Zod",
      "Framer Motion",
      "QZ Tray (ESC/POS thermal printing)",
      "Recharts",
      "Node.js",
      "Express 4",
      "MongoDB",
      "Mongoose",
      "JWT (jsonwebtoken)",
      "bcryptjs",
      "multer",
      "helmet + express-rate-limit",
      "PDFKit",
      "Render",
    ],
    problem:
      "Small restaurants and cafes need a way to take orders at the counter, get them to the kitchen instantly, and print a receipt on a real thermal printer - without paying for a full commercial POS subscription. Generic tools either don't support role-specific workflows (cashier vs. kitchen vs. owner) or don't integrate with local ESC/POS receipt printers and cash drawers from a browser-based app.",
    architecture: {
      nodes: [
        { id: "pos-client", label: "POS Web App", sublabel: "Orders, kitchen, payment", x: 20, y: 40, kind: "client" },
        { id: "customer-display", label: "Customer Display", sublabel: "Second-screen order view", x: 20, y: 280, kind: "client" },
        { id: "api", label: "Express API", sublabel: "REST + role middleware", x: 280, y: 40, kind: "service" },
        { id: "qz-tray", label: "QZ Tray", sublabel: "Desktop printer agent", x: 280, y: 280, kind: "external" },
        { id: "mongo", label: "MongoDB", sublabel: "Orders, menu, users", x: 540, y: 40, kind: "data" },
        { id: "uploads", label: "Local file storage", sublabel: "Multer-uploaded images", x: 540, y: 280, kind: "data" },
      ],
      edges: [
        { from: "pos-client", to: "api", label: "REST + JWT" },
        { from: "customer-display", to: "api", label: "polls state" },
        { from: "pos-client", to: "qz-tray", label: "WS print jobs" },
        { from: "api", to: "mongo", label: "read/write" },
        { from: "api", to: "uploads", label: "menu images" },
      ],
    },
    features: [
      "Role-based access control across 7 roles (admin, owner, manager, cashier, chef/kitchen, waitstaff) with per-route navigation filtering and backend-enforced authorization middleware",
      "Kitchen display system with a background polling monitor that alerts kitchen/waitstaff roles with sound + toast when new pending orders arrive",
      "Direct thermal receipt printing via QZ Tray using raw ESC/POS commands - supports 58mm/80mm paper widths, itemized columns, and opening the cash drawer on cash payments",
      "Order lifecycle management (pending → preparing → ready → completed/cancelled/refunded) with discount handling, customer attachment, and payment status tracking",
      "Dashboard reporting built on MongoDB aggregation pipelines - daily sales totals, order counts, top-selling items, and sales-by-payment-method breakdowns",
      "Customer-facing second-screen display with an idle slideshow and live order/payment view for front-of-house counters",
    ],
    challenges: [
      {
        title: "Mid-project database migration from PostgreSQL/Sequelize to MongoDB/Mongoose",
        detail:
          "The backend started on Sequelize + PostgreSQL with relational associations, then was rewritten to MongoDB/Mongoose. Models like MenuItem still carry inline comments working through how to translate the old relational category association into a document-store shape, and standalone migration scripts using raw Sequelize queries were left in the backend root alongside the new Mongoose models - evidence the switch happened without a clean cutover.",
      },
      {
        title: "Duplicate/flooding toast notifications and duplicate order submissions",
        detail:
          "Rapid button clicks on payment confirmation could fire duplicate API calls, and error toasts (especially network errors) would stack and flood the screen. This was fixed with a centralized toast manager that deduplicates by message and throttles network errors to one every 3 seconds, plus async-action/click-cooldown hooks that lock buttons during in-flight requests.",
      },
      {
        title: "Broken menu images after deploying frontend and backend to separate hosts",
        detail:
          "Menu item images were stored via multer on the backend's local disk and referenced by relative URL, which worked in local dev but broke once the frontend (static Render site) and backend (separate Render web service) lived on different origins. Fixed with a helper that resolves relative upload paths against the API's host at render time, while leaving already-absolute (e.g. external CDN) URLs untouched.",
      },
    ],
    lessons: [
      "Pick the database and ORM before building out models - switching from Postgres/Sequelize to MongoDB/Mongoose mid-project left behind dead migration scripts and awkward schema compromises that a single up-front decision would have avoided.",
      "Design for multi-origin deployment (separate static frontend + API host) from the start - assuming same-origin relative URLs for uploaded assets caused a production-only bug that only surfaced after deploying to Render.",
      "Debounce/lock async UI actions and centralize notification state early - duplicate submissions and toast flooding were retrofitted late rather than being part of the original component design.",
    ],
    futureImprovements: [
      "Replace client-side polling with WebSockets or server-sent events for real kitchen-order push updates instead of periodic re-fetching",
      "QZ Tray certificate/signature handling is currently stubbed to auto-resolve with no real signing - production use needs a properly signed QZ certificate",
      "Menu item image uploads still go to local backend disk storage rather than a persistent object store (e.g. S3/Cloudinary), so uploaded images won't survive a Render redeploy without a persistent disk",
    ],
  },
  {
    slug: "mydentist",
    title: "MyDentist",
    summary:
      "An AI-assisted dental clinic platform where patients book appointments with real dentists and talk to a voice AI assistant for dental guidance, with a separate admin dashboard for managing doctors and appointments.",
    role: "Sole developer",
    timeframe: "2025",
    tech: [
      "Next.js 15 (App Router, Turbopack)",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Prisma ORM",
      "PostgreSQL",
      "Clerk (authentication + billing/plans)",
      "@vapi-ai/web (voice AI SDK)",
      "Resend + react-email",
      "TanStack Query",
      "react-hook-form + Zod",
      "Radix UI",
      "Recharts",
    ],
    problem:
      "Booking a dentist and getting basic dental questions answered usually means calling a front desk during business hours. Patients with simple questions (is this normal, do I need an emergency visit, what should I do about sensitivity) have no fast way to get guidance outside a paid in-person visit, and clinics spend staff time on routine scheduling and triage. MyDentist targets patients who want self-serve booking plus instant, always-available AI guidance, with a lightweight admin view for clinic staff to manage doctors and appointments.",
    architecture: {
      nodes: [
        { id: "client", label: "Next.js Client", sublabel: "Patient + admin UI", x: 20, y: 140, kind: "client" },
        { id: "server", label: "Next.js Server", sublabel: "Server Actions + API", x: 280, y: 140, kind: "service" },
        { id: "db", label: "PostgreSQL", sublabel: "via Prisma ORM", x: 540, y: 140, kind: "data" },
        { id: "clerk", label: "Clerk", sublabel: "Auth + subscription plans", x: 280, y: 20, kind: "external" },
        { id: "vapi", label: "Vapi AI", sublabel: "Voice assistant (browser)", x: 20, y: 280, kind: "external" },
        { id: "resend", label: "Resend", sublabel: "Confirmation emails", x: 540, y: 280, kind: "external" },
      ],
      edges: [
        { from: "client", to: "server", label: "Server Actions" },
        { from: "server", to: "db", label: "Prisma r/w" },
        { from: "client", to: "clerk", label: "sign-in + plans" },
        { from: "server", to: "clerk", label: "auth check" },
        { from: "client", to: "vapi", label: "voice (WebRTC)" },
        { from: "server", to: "resend", label: "send email" },
      ],
    },
    features: [
      "Multi-step appointment booking: pick a doctor, pick an open date/time slot (already-booked slots are queried and filtered out), confirm - backed by a User/Doctor/Appointment Prisma schema",
      "AI voice assistant gated behind paid plans: the voice page checks Clerk's plan entitlements server-side and only then renders a live mic conversation via the Vapi browser SDK, with real-time transcript and speaking-state UI",
      "Tiered subscriptions (Free / AI Basic / AI Pro) sold and managed through Clerk's built-in pricing-table billing component rather than a custom payments integration",
      "Patient dashboard showing next appointment, appointment stats (total vs. completed), and a dental health overview",
      "Admin dashboard (gated by a single admin-email env check) for CRUD on doctors and viewing/updating all patient appointments and stats, charted with Recharts",
      "Automatic user sync: on first sign-in, a client component calls a server action that mirrors the Clerk identity into the app's own User table",
    ],
    challenges: [
      {
        title: "Plan-gated AI access via Clerk billing entitlements",
        detail:
          "Rather than building custom subscription/entitlement logic, feature access to the voice AI is checked server-side against plan slugs configured in Clerk's dashboard. This kept billing out of the app's own database but means the plan slugs are an implicit contract with Clerk config that isn't visible anywhere in code.",
      },
      {
        title: "Client-side, server-bypassing voice integration",
        detail:
          "The voice assistant runs as a direct browser-to-Vapi connection rather than being proxied through the Next.js server, so the widget component has to manage the full call lifecycle itself (connecting/active/ended states, live transcript messages, speaking indicators) purely from Vapi's client-side event emitter.",
      },
      {
        title: "Preventing double-booked appointment slots",
        detail:
          "A query for all confirmed or completed appointments for a given doctor and date removes those times from the picker before a user can select one. This is an application-level check only - the Prisma schema has no unique constraint on doctor+date+time, so it's a best-effort UX guard rather than a race-safe guarantee.",
      },
    ],
    lessons: [
      "The email integration ships with a hardcoded test sender address and an explicit code comment not to use it in production - for a real case study this is a reminder that email deliverability (a verified sending domain) needs to be planned for before launch, not bolted on after the feature 'works'.",
      "Gating a paid feature entirely on a string plan slug from an external dashboard (Clerk) is fast to ship but has no local source of truth - next time I'd type the expected plan slugs in code so the dependency is visible instead of implicit.",
      "Admin access via a single hardcoded email comparison was fine for a one-clinic prototype but doesn't extend to multiple staff members or roles - a real deployment would need this modeled from the start.",
    ],
    futureImprovements: [
      "Move off the test email sender to a verified production domain, and add appointment reminder emails (the pricing copy already promises reminders but only booking-confirmation emails are implemented)",
      "Add a database-level unique constraint (or transaction) on doctor+date+time to close the double-booking race condition instead of relying solely on a pre-booking query",
      "Replace the single admin-email env var with a real role field on the User model so multiple staff accounts can be granted admin access",
    ],
  },
  {
    slug: "fitterone",
    title: "FitterOne",
    summary:
      "A marketing and lead-generation site for an on-demand roadside assistance and mobile mechanic service in Ghana, built for both individual drivers and corporate/fleet clients.",
    role: "Sole developer",
    timeframe: "2026",
    tech: [
      "React 19",
      "TypeScript",
      "Vite 8",
      "React Router 7",
      "Tailwind CSS 4",
      "Framer Motion",
      "lucide-react",
      "@emailjs/browser",
      "oxlint",
    ],
    problem:
      "Drivers in Ghana who break down have no fast, trustworthy way to find a mechanic - most roadside issues get an unnecessary tow because there's no on-demand dispatch option. Fleet operators (delivery, ride-hailing, construction) face the same problem at scale, with vehicle downtime cutting into revenue and no consolidated way to manage maintenance across many vehicles. FitterOne's site exists to explain the on-demand mobile mechanic concept and capture leads from both segments before/while the underlying dispatch product is built.",
    architecture: {
      nodes: [
        { id: "host", label: "Static Host", sublabel: "Serves Vite build", x: 20, y: 140, kind: "service" },
        { id: "browser", label: "Browser (React SPA)", sublabel: "React 19 + Router SPA", x: 260, y: 140, kind: "client" },
        { id: "unsplash", label: "Unsplash CDN", sublabel: "Hot-linked stock photos", x: 500, y: 40, kind: "external" },
        { id: "emailjs", label: "EmailJS API", sublabel: "Client-side form send", x: 500, y: 240, kind: "external" },
        { id: "inbox", label: "Business Email Inbox", sublabel: "Structured lead emails", x: 740, y: 240, kind: "external" },
      ],
      edges: [
        { from: "host", to: "browser", label: "serves build" },
        { from: "browser", to: "unsplash", label: "images" },
        { from: "browser", to: "emailjs", label: "sendForm()" },
        { from: "emailjs", to: "inbox", label: "email" },
      ],
    },
    features: [
      "11-route marketing site (Home, About, Services, Corporate Fleets, How It Works, Pricing, Coverage Areas, Careers, Investors, Blog, Contact) built with React Router",
      "Lead-capture contact form (name, phone, location, service type, message) sent via EmailJS with a custom email template and explicit sending/submitted/error UI states",
      "Catalog of 12 distinct services (roadside assistance, mobile mechanic, battery replacement, tyre repair, jump start, diagnostics, oil change, brake service, fleet maintenance, vehicle inspection, fuel delivery, electrical repairs) shared across the Home page, Services page, and the Contact form's service dropdown",
      "Separate corporate/fleet track (dedicated page, pricing tier, and CTAs) distinguishing B2B fleet-maintenance customers from individual roadside-assistance customers",
      "Scroll-triggered reveal animations (Framer Motion) and an animated count-up hook for the impact-stats section",
      "Per-page SEO handling via a small Seo component that updates document title/meta description on route change, plus static Open Graph/Twitter tags in index.html",
    ],
    challenges: [
      {
        title: "Mid-build rebrand",
        detail:
          "Git history shows the entire site was built under the name 'AutoFix360' and then renamed to 'FitterOne' in the very next commit - touching over 30 files, renaming a component, replacing every logo/favicon asset, and updating copy, meta tags, and the email template all at once without leaving stray references (the GitHub repo itself is still named autofix360, so the rename wasn't propagated everywhere).",
      },
      {
        title: "No backend, real lead delivery",
        detail:
          "There's no server in this project - the contact form is entirely client-side, calling EmailJS's API directly from the browser. The interesting part is making a backend-less form feel production-ready: a configuration guard turns missing env vars into a clear rejected-promise error instead of a silent failure, and the form has real loading/success/error states instead of just firing and hoping.",
      },
    ],
    lessons: [
      "Config validation stops at a boolean check - a misconfigured .env.local only surfaces as a runtime error when someone submits the form, not at build/dev-server start; next time I'd fail loudly in dev.",
      "Hot-linking all imagery from Unsplash by ID was fast to build with but makes hero/LCP images fully dependent on a third-party CDN with no control over optimization or availability.",
      "All content - services, pricing, testimonials, impact stats - lives in static TypeScript data files. That's the right call for a single-developer MVP shipped in days, but it means every copy change requires a code change and redeploy.",
    ],
    futureImprovements: [
      "No CMS or backend: services, pricing, and testimonials are hardcoded data files, so there's no way for a non-engineer to update site content without a redeploy.",
      "The site markets features that don't exist yet as a working product - live technician tracking, GPS dispatch matching, digital service history - these are presentation-only; the actual booking/dispatch backend hasn't been built.",
      "No spam protection or server-side validation on the contact form beyond HTML required attributes, and no deployment config is committed to the repo, so hosting setup isn't documented.",
    ],
  },
  {
    slug: "chat-api",
    title: "Chat API",
    summary:
      "A REST API for a chat application with JWT-authenticated users and full CRUD on messages (send, list, fetch, update, delete). Built as a backend-only exercise, not paired with a client app.",
    role: "Sole developer",
    timeframe: "2024",
    tech: [
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "JWT (jsonwebtoken)",
      "bcrypt",
      "cookie-parser",
      "express-async-handler",
    ],
    problem:
      "Started as a self-assigned challenge (inspired by a LinkedIn post) to practice building a backend from scratch: modeling data, wiring authentication, and exposing clean CRUD endpoints without relying on a starter template. The goal was to demonstrate core REST/CRUD and auth patterns for a chat-style app, aimed at Louis's own portfolio/learning rather than a specific external user base.",
    architecture: {
      nodes: [
        { id: "client", label: "API Client", sublabel: "REST consumer", x: 20, y: 140, kind: "client" },
        { id: "express", label: "Express App", sublabel: "Routing + middleware", x: 280, y: 140, kind: "service" },
        { id: "auth-mw", label: "Auth Middleware", sublabel: "Verifies JWT cookie", x: 410, y: 20, kind: "service" },
        { id: "controllers", label: "Controllers", sublabel: "User + chat logic", x: 540, y: 140, kind: "service" },
        { id: "mongo", label: "MongoDB", sublabel: "User + Chat models", x: 800, y: 140, kind: "data" },
      ],
      edges: [
        { from: "client", to: "express", label: "HTTP + JWT" },
        { from: "express", to: "auth-mw", label: "protected routes" },
        { from: "auth-mw", to: "controllers", label: "req.user" },
        { from: "express", to: "controllers", label: "public routes" },
        { from: "controllers", to: "mongo", label: "read/write" },
      ],
    },
    features: [
      "User registration and login with bcrypt-hashed passwords",
      "JWT auth issued as an httpOnly cookie (30-day expiry), verified by a protect() middleware on private routes",
      "Message CRUD: send, list all (newest first), fetch by ID, update content, delete",
      "User profile retrieval and update behind authentication",
      "Centralized error handling middleware, including a 404 handler and Mongoose CastError -> 404 translation for invalid ObjectIds",
    ],
    challenges: [
      {
        title: "Cookie-based JWT auth flow",
        detail:
          "Rather than bearer tokens in headers, auth uses an httpOnly JWT cookie set on login/register and read by a protect() middleware on every request to private routes. This required coordinating cookie-parser, secure/httpOnly cookie flags tied to the environment, and consistent cookie naming between the token-generation and auth-middleware modules.",
      },
      {
        title: "Consistent error handling across async routes",
        detail:
          "All controllers are wrapped in express-async-handler to avoid repetitive try/catch blocks, feeding into a shared error handler that maps Mongoose CastErrors (bad ObjectId) to clean 404s instead of raw 500s.",
      },
    ],
    lessons: [
      "The Chat schema's sender/recipient fields are typed as ObjectId but their reference to the User model is commented out, so messages were never actually linked/populated with user data - next time I'd wire that relationship up from the start rather than leaving it disconnected.",
      "Building the message CRUD before deciding how conversations/threads should be modeled meant there's no concept of a conversation between two specific users, only a flat list of messages - I'd design the data model around conversations first.",
    ],
    futureImprovements: [
      "Link Chat sender/recipient to the User model (uncomment and use the refs) and support populating sender/recipient details on message responses",
      "Add an endpoint to fetch messages between two specific users (a real conversation view) instead of only get-all and get-by-id",
      "No tests exist and there's no real-time layer (no WebSockets/Socket.io), so messages are polled via REST rather than pushed live",
    ],
  },
  {
    slug: "book-management-system",
    title: "Book Management System",
    summary:
      "A Windows console application that lets a librarian log in and track book borrowing, automatic due-date calculation, and late-return alerts, storing all records in plain text files.",
    role: "One of four student developers (team academic project)",
    timeframe: "2023",
    tech: [
      "C++",
      "Object-oriented C++ (class hierarchy)",
      "Windows API (windows.h)",
      "C++ standard library (iostream, fstream, iomanip, ctime)",
      "Code::Blocks / GCC (MinGW)",
      "Flat-file (.txt) storage",
    ],
    problem:
      "The project was assigned as a university OOP exercise to give a librarian a simple digital way to record which student borrowed which book, when it's due back, and whether it came back late - replacing manual/paper tracking with automatic due-date math and a login-gated console tool.",
    architecture: {
      nodes: [
        { id: "console-ui", label: "Console UI", sublabel: "Menu + loading screen", x: 20, y: 140, kind: "client" },
        { id: "auth", label: "Librarian Login", sublabel: "Hardcoded password check", x: 280, y: 140, kind: "service" },
        { id: "loan-logic", label: "Loan Management", sublabel: "Borrow/return logic", x: 540, y: 140, kind: "service" },
        { id: "flat-files", label: "Text File Storage", sublabel: "6 .txt files, line-indexed", x: 800, y: 140, kind: "data" },
      ],
      edges: [
        { from: "console-ui", to: "auth", label: "login input" },
        { from: "auth", to: "loan-logic", label: "grants access" },
        { from: "loan-logic", to: "flat-files", label: "append/read lines" },
      ],
    },
    features: [
      "Librarian login gated by a password check before the menu is reachable",
      "Borrow-book flow that captures student ID/name, book ID/name, librarian name, and loan duration in one form",
      "Automatic due-date generation from days-allowed + current day-of-month",
      "Return-book flow that looks up a student's record by ID and flags whether the book came back on time or late",
      "\"Borrowed books\" report that lists every recorded loan by reading all six data files in lockstep",
      "Menu-driven console UI with ASCII banners, screen-clearing, and a loading animation between actions",
    ],
    challenges: [
      {
        title: "Faking relational records with six parallel text files",
        detail:
          "There's no database or struct-based record - each borrow appends one line to six separate files (student ID, student name, book ID, book name, etc.), correlated purely by line number. Returning a book has to first scan the student-ID file to find which line number matches the entered ID, then re-open and re-read all six files in a second pass to pull the matching line out of each - a manual, fragile stand-in for a real joined record lookup.",
      },
      {
        title: "Due-date tracking without a date library",
        detail:
          "Due dates are computed by adding the allowed loan days to the current day-of-month from ctime, then the return flow compares that stored integer against the current day-of-month to decide 'on time' vs 'late'. It works for loans that don't cross a month boundary, but the comparison logic doesn't account for month/year rollover - a real limitation the code doesn't currently handle.",
      },
    ],
    lessons: [
      "Splitting one logical record across six separate flat files (correlated only by line index) made every read/write far more fragile than a single delimited record per line, or a real embedded DB like SQLite, would have been.",
      "Hardcoding the librarian password directly in source is insecure and inflexible - even a simple config file or per-librarian hashed credentials would have been a meaningful improvement.",
      "There's no input validation anywhere (numeric fields, menu navigation) - for a next project, validating input at the boundary would prevent silent bad state.",
    ],
    futureImprovements: [
      "Replace the six parallel .txt files with a single structured record format (or SQLite) and add a way to actually delete/mark a loan as returned - currently returned books are never removed from the files, so the borrowed-books report lists them forever",
      "Fix due-date math to handle month/year boundaries instead of only comparing day-of-month",
      "Replace the single hardcoded shared password with per-librarian accounts and hashed credentials",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
