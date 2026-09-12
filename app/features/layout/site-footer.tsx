import { Mail } from "lucide-react";
import { siteConfig } from "~/lib/site-config";
import { GithubIcon, LinkedinIcon } from "~/components/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {siteConfig.name}. Built from scratch.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="transition-colors hover:text-foreground"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Email"
            className="transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
