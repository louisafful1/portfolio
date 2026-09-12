import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { Project } from "./projects-data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40"
    >
      <div>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-heading text-lg font-semibold text-foreground">{project.title}</h3>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{project.summary}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="secondary" className="font-mono text-xs font-normal">
            {tech}
          </Badge>
        ))}
      </div>
    </Link>
  );
}
