import { motion } from "motion/react";
import { Radio } from "lucide-react";
import { siteConfig } from "~/lib/site-config";
import { GithubIcon } from "~/components/icons";
import { Badge } from "~/components/ui/badge";
import { StatusDot } from "./status-dot";
import { useCounter } from "~/hooks/use-counter";
import { useGithubStats } from "./use-github-stats";

function Metric({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const { ref, value: animated } = useCounter(value);
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col gap-1">
      <span className="font-mono text-2xl font-semibold text-foreground">
        {animated}
        {suffix}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function DashboardPanel() {
  const github = useGithubStats(siteConfig.social.githubUsername);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <StatusDot />
          <span className="text-sm text-foreground">{siteConfig.availability}</span>
        </div>
        <Radio className="size-3.5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-2 gap-6 px-5 py-5">
        <Metric label="Projects built" value={siteConfig.stats.projectsBuilt} suffix="+" />
        <Metric label="Technologies" value={siteConfig.stats.technologies} suffix="+" />
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Currently learning
        </p>
        <ul className="space-y-1.5">
          {siteConfig.currentlyLearning.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground">
              <span className="size-1 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border px-5 py-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <GithubIcon className="size-3.5" /> GitHub activity
        </div>
        {github.loading ? (
          <p className="text-sm text-muted-foreground">Fetching stats…</p>
        ) : github.error ? (
          <p className="text-sm text-muted-foreground">Live stats unavailable right now.</p>
        ) : (
          <div className="flex gap-6 font-mono text-sm text-foreground">
            <span>{github.publicRepos} repos</span>
            <span>{github.followers} followers</span>
          </div>
        )}
      </div>

      <div className="border-t border-border px-5 py-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tech stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["React", "Node.js", "TypeScript", "Docker", "PostgreSQL", "AWS"].map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-xs font-normal">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
