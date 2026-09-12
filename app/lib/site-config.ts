// Central place for editable site copy & links.
// Anything marked PLACEHOLDER should be swapped for the real value — see CONTENT.md.

export const siteConfig = {
  name: "Louis Afful",
  role: "Software Engineer",
  eyebrow: "SOFTWARE ENGINEER",
  headline: "Building software that powers businesses, people and infrastructure.",
  intro:
    "I design and build systems end to end — from enterprise applications to the networks and infrastructure they run on. Currently deepening my focus on cloud, DevOps, and AI engineering.",
  location: "Ghana", // PLACEHOLDER
  availability: "Available for opportunities",
  focus: ["Enterprise Applications", "AI Systems", "Networking", "DevOps"],

  email: "louis.afful@example.com", // PLACEHOLDER
  resumeUrl: "/resume-placeholder.pdf", // PLACEHOLDER — drop your real resume PDF into /public

  social: {
    github: "https://github.com/louisafful", // PLACEHOLDER
    githubUsername: "louisafful", // PLACEHOLDER — used for the live GitHub activity widget
    linkedin: "https://linkedin.com/in/louisafful", // PLACEHOLDER
    twitter: "", // PLACEHOLDER (optional) e.g. "https://x.com/yourhandle"
  },

  nav: [
    { label: "Home", href: "#home" },
    { label: "Projects", href: "#projects" },
    { label: "Experience", href: "#experience" },
    { label: "Journal", href: "#journal" },
    { label: "Contact", href: "#contact" },
  ],

  stats: {
    projectsBuilt: 8,
    technologies: 20,
    yearsBuilding: 2,
  },

  currentlyLearning: ["Distributed Systems", "Kubernetes", "Retrieval-Augmented Generation"],
} as const;

export type SiteConfig = typeof siteConfig;
