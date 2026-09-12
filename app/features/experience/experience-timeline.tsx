import { motion } from "motion/react";
import { experienceEntries } from "./experience-data";

export function ExperienceTimeline() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {experienceEntries.map((entry, index) => (
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {entry.current && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> Current
              </span>
            )}
            <span className="font-mono text-xs text-muted-foreground">{entry.period}</span>
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{entry.role}</h3>
          <p className="mb-3 text-sm text-muted-foreground">{entry.org}</p>
          <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{entry.summary}</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {entry.responsibilities.map((responsibility) => (
              <li key={responsibility} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                {responsibility}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}
