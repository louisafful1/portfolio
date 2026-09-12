import { siteConfig } from "~/lib/site-config";

export interface TerminalContext {
  navigateToSection: (id: string) => void;
  openResume: () => void;
  clear: () => void;
}

export type CommandOutput = string[];

const help: CommandOutput = [
  "Available commands:",
  "",
  "  help        show this list",
  "  about       who is Louis Afful",
  "  experience  current role & responsibilities",
  "  skills      technical skill categories",
  "  projects    jump to featured work",
  "  resume      download the resume",
  "  contact     get in touch",
  "  whoami      guess who",
  "  sudo        try it",
  "  clear       clear the screen",
];

export function runCommand(rawInput: string, ctx: TerminalContext): CommandOutput {
  const input = rawInput.trim().toLowerCase();
  if (!input) return [];

  const [command] = input.split(" ");

  switch (command) {
    case "help":
      return help;

    case "about":
      return [
        `${siteConfig.name} — ${siteConfig.role}`,
        siteConfig.intro,
        "",
        `Focus: ${siteConfig.focus.join(", ")}`,
      ];

    case "experience":
      ctx.navigateToSection("experience");
      return ["Scrolling to experience timeline..."];

    case "skills":
      ctx.navigateToSection("skills");
      return ["Scrolling to skills..."];

    case "projects":
      ctx.navigateToSection("projects");
      return ["Scrolling to projects..."];

    case "contact":
      ctx.navigateToSection("contact");
      return ["Scrolling to contact..."];

    case "resume":
      ctx.openResume();
      return ["Opening resume..."];

    case "whoami":
      return ["A software engineer who reads the docs before the error message."];

    case "sudo":
      return ["Permission denied: nice try. This terminal only has read access to my career."];

    case "clear":
      ctx.clear();
      return [];

    default:
      return [`command not found: ${command}`, `Type 'help' to see available commands.`];
  }
}
