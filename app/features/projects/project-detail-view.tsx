import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { GithubIcon } from "~/components/icons";
import type { Project } from "./projects-data";
import { SystemDiagram } from "./system-diagram";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}

export function ProjectDetailView({ project }: { project: Project }) {
  return (
    <article className="mx-auto max-w-3xl px-6 py-28">
      <Link
        to="/#projects"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Back to projects
      </Link>

      <header className="mb-12 space-y-4">
        <p className="font-mono text-xs text-muted-foreground">
          {project.role} · {project.timeframe}
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">{project.summary}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tech.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-xs font-normal">
              {tech}
            </Badge>
          ))}
        </div>

        {(project.links?.repo || project.links?.demo) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.links.repo && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.repo} target="_blank" rel="noreferrer">
                  <GithubIcon className="size-4" /> View code
                </a>
              </Button>
            )}
            {project.links.demo && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.links.demo} target="_blank" rel="noreferrer">
                  Live demo <ArrowUpRight className="size-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="space-y-14">
        <Section title="Problem">
          <p className="text-sm leading-relaxed text-muted-foreground">{project.problem}</p>
        </Section>

        <Section title="Architecture">
          <SystemDiagram architecture={project.architecture} />
        </Section>

        <Section title="Features">
          <ul className="space-y-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Challenges">
          <div className="space-y-5">
            {project.challenges.map((challenge) => (
              <div key={challenge.title} className="rounded-xl border border-border bg-card p-5">
                <p className="mb-1.5 font-heading text-sm font-semibold text-foreground">
                  {challenge.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">{challenge.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Lessons Learned">
          <ul className="space-y-2">
            {project.lessons.map((lesson) => (
              <li key={lesson} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {lesson}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Future Improvements">
          <ul className="space-y-2">
            {project.futureImprovements.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </article>
  );
}
