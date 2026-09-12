import { Link } from "react-router";
import type { Route } from "./+types/project-detail";
import { getProjectBySlug } from "~/features/projects/projects-data";
import { ProjectDetailView } from "~/features/projects/project-detail-view";

export function meta({ params }: Route.MetaArgs) {
  const project = getProjectBySlug(params.slug);
  return [{ title: project ? `${project.title} — Louis Afful` : "Project not found" }];
}

export default function ProjectDetail({ params }: Route.ComponentProps) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="font-heading text-2xl font-semibold text-foreground">Project not found</p>
        <p className="mt-2 text-sm text-muted-foreground">
          That case study doesn't exist yet.
        </p>
        <Link to="/#projects" className="mt-6 inline-block text-sm text-primary hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  return <ProjectDetailView project={project} />;
}
