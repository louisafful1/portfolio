import { Radio } from "lucide-react";
import { siteConfig } from "~/lib/site-config";
import { Badge } from "~/components/ui/badge";
import { StatusDot } from "./status-dot";
import { useCounter } from "~/hooks/use-counter";

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
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <StatusDot />
          <span className="text-sm text-foreground">{siteConfig.availability}</span>
        </div>
        <Radio className="size-3.5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-3 gap-4 px-5 py-5">
        <Metric label="Years building" value={siteConfig.stats.yearsBuilding} suffix="+" />
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
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Tech stack
        </p>
        <div className="flex flex-wrap gap-1.5">
          {["React", "Node.js", "TypeScript", "Docker", "PostgreSQL", "MongoDB", "React Native", "Cron Jobs", "Networking"].map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-xs font-normal">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
