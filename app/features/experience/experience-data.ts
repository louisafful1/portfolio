export interface ExperienceEntry {
  id: string;
  role: string;
  org: string;
  period: string;
  current?: boolean;
  summary: string;
  responsibilities: string[];
}

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "adamus",
    role: "National Service Personnel — IT & Systems",
    org: "Adamus Resources Ltd",
    period: "2025 — Present",
    current: true,
    summary:
      "Supporting enterprise software, IT infrastructure, and networking operations at a mining company, where uptime and reliability are non-negotiable.",
    responsibilities: [
      "Enterprise software support and troubleshooting for business-critical systems",
      "IT support across departments — hardware, software, and access issues",
      "Networking: maintaining and troubleshooting site connectivity",
      "Infrastructure upkeep for servers and workstations",
      "System administration — user accounts, permissions, backups",
    ],
  },
];

export const journeySteps: string[] = [
  "Student",
  "Software Development",
  "Enterprise Systems",
  "Networking",
  "Mining Industry",
  "AI",
  "Cloud & DevOps",
  "Future",
];
