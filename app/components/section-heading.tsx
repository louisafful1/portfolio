import { motion } from "motion/react";
import { cn } from "~/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.4 }}
      className={cn("mx-auto mb-14 max-w-2xl text-center", className)}
    >
      <p className="mb-3 font-mono text-xs font-medium tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-muted-foreground">{description}</p>}
    </motion.div>
  );
}
