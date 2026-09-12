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
    role: "Software & IT Operations",
    org: "Adamus Resources Limited · Nkroful, Ghana (National Service Personnel)",
    period: "Dec 2025 - Present",
    current: true,
    summary:
      "Worked across software and IT operations in a mining environment, supporting internal applications, operational workflows, users, networking, and IT infrastructure.",
    responsibilities: [
      "Built and improved internal systems for operational processes, including vehicle/equipment inspections and attendance management",
      "Administered and supported internal applications for KPI reporting, fuel management, attendance, and other departmental workflows",
      "Coordinated daily KPI submissions across departments and audited fuel records against actual fuel dispensed, while training users and supporting system adoption",
      "Worked with supervisors and end users to identify workflow issues and suggest practical improvements to internal applications",
      "Supported site networking, IP phones, servers, CCTV/NVR systems, workstations, and other IT infrastructure",
      "Provided hands-on troubleshooting and day-to-day IT support across hardware, connectivity, software, and user issues",
    ],
  },
  {
    id: "byf-consulting",
    role: "Freelance Web Developer",
    org: "BYF Consulting Ghana · Accra, Ghana",
    period: "Jun 2025",
    summary:
      "Built and deployed the company's public website end to end, from service pages to interactive application forms.",
    responsibilities: [
      "Built and deployed the company website (byfconsultinggh.com), showcasing services, divisions, training programs, and vacancies",
      "Developed dynamic pages with interactive forms for job applications, staffing requests, and newsletter subscriptions",
      "Ensured responsive design and smooth navigation across all sections (Home, About, Services, Training, Vacancies, Contact)",
    ],
  },
  {
    id: "umat-srid",
    role: "Backend Development Intern",
    org: "University of Mines and Technology - SRID · Takoradi, Ghana",
    period: "Oct 2023 - Nov 2023",
    summary:
      "Built a secure backend API for an internal hostel management system, collaborating remotely with the development team.",
    responsibilities: [
      "Developed a secure RESTful API for a Hostel Management System using Node.js, Express, and MongoDB",
      "Participated in code reviews and remote collaboration sessions",
    ],
  },
];

export const journeySteps: string[] = [
  "Problem First",
  "Full-Stack Development",
  "Business & Operational Software",
  "Real-World Systems",
  "AI-Powered Applications",
  "Software Engineer",
];
