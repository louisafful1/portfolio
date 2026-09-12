import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  Cloud,
  Code2,
  Database,
  Layers,
  Network,
  Terminal as TerminalIcon,
  Wrench,
} from "lucide-react";

export interface SkillCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    icon: Code2,
    items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "React Router", "Redux"],
  },
  {
    id: "backend",
    label: "Backend",
    icon: Layers,
    items: ["Node.js", "Express", "REST APIs", "Authentication & JWT", "Cron Jobs"],
  },
  {
    id: "databases",
    label: "Databases",
    icon: Database,
    items: ["MongoDB", "PostgreSQL", "MySQL", "Redis"],
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: Cloud,
    items: ["Cloudinary", "Vercel", "Render", "CI/CD pipelines"],
  },
  {
    id: "networking",
    label: "Networking",
    icon: Network,
    items: ["TCP/IP", "DNS", "Subnetting", "Network troubleshooting"],
  },
  {
    id: "devops",
    label: "DevOps",
    icon: Wrench,
    items: ["Docker", "Git & GitHub Actions"],
  },
  {
    id: "languages",
    label: "Languages",
    icon: TerminalIcon,
    items: ["JavaScript", "TypeScript", "Python", "PHP", "SQL"],
  },
  {
    id: "tools",
    label: "Tools",
    icon: Boxes,
    items: ["VS Code", "Postman", "Figma", "Linux CLI"],
  },
];
