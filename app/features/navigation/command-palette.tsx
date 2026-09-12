import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  FileText,
  Layers,
  Mail,
  Moon,
  Sun,
  TerminalSquare,
  User,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "~/components/icons";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { siteConfig } from "~/lib/site-config";
import { useTheme } from "~/features/theme/theme-provider";

export function CommandPalette({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  const goToSection = (id: string) => {
    setOpen(false);
    if (location.pathname === "/") {
      requestAnimationFrame(() =>
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
      );
    } else {
      navigate(`/#${id}`);
    }
  };

  const run = (fn: () => void) => {
    fn();
    setOpen(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="Command Palette"
      description="Jump anywhere on the site"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {siteConfig.nav.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => goToSection(item.href.replace("#", ""))}
            >
              <Layers /> {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(onOpenTerminal)}>
            <TerminalSquare /> Open terminal
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(toggleTheme)}>
            {theme === "dark" ? <Sun /> : <Moon />}
            Switch to {theme === "dark" ? "light" : "dark"} theme
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => window.open(siteConfig.resumeUrl, "_blank"))
            }
          >
            <FileText /> Download resume
          </CommandItem>
          <CommandItem
            onSelect={() =>
              run(() => navigator.clipboard.writeText(siteConfig.email))
            }
          >
            <Mail /> Copy email address
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Elsewhere">
          <CommandItem onSelect={() => run(() => window.open(siteConfig.social.github, "_blank"))}>
            <GithubIcon className="size-4" /> GitHub
          </CommandItem>
          <CommandItem onSelect={() => run(() => window.open(siteConfig.social.linkedin, "_blank"))}>
            <LinkedinIcon className="size-4" /> LinkedIn
          </CommandItem>
          <CommandItem onSelect={() => run(() => goToSection("home"))}>
            <User /> About Louis
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
