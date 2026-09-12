import { motion } from "motion/react";
import { projects } from "./projects-data";
import { ProjectCard } from "./project-card";

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {projects.map((project, index) => (
        <motion.div
          key={project.slug}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}
