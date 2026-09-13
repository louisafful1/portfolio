// Central place for editable site copy & links.
// Anything marked PLACEHOLDER should be swapped for the real value - see CONTENT.md.

export const siteConfig = {
  name: "Louis Afful",
  role: "Software Engineer",
  eyebrow: "SOFTWARE ENGINEER",
  headline: "Building software that powers businesses, people and infrastructure.",
  intro:
    "I design and build systems end to end - from enterprise applications to the networks and infrastructure they run on. Currently deepening my focus on cloud, DevOps, and AI engineering.",
  location: "Takoradi, Ghana",
  availability: "Available for opportunities",
  focus: ["Enterprise Applications", "AI Systems", "Networking", "DevOps"],

  email: "louisafful1@gmail.com",
  phone: "+233 591 414 352",
  resumeUrl: "/Louis-Afful-Resume.pdf",

  social: {
    linkedin: "https://linkedin.com/in/louisafful",
    whatsapp: "https://wa.me/233591414352",
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
    projectsBuilt: 13,
    technologies: 20,
    yearsBuilding: 4,
  },

  currentlyLearning: [
    "Networking & Infrastructure",
    "CCTV & NVR Systems",
    "AI & Intelligent Systems",
    "Retrieval-Augmented Generation",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
