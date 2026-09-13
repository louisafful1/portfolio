import { motion } from "motion/react";
import { ArrowDown, Download } from "lucide-react";
import { siteConfig } from "~/lib/site-config";
import { Button } from "~/components/ui/button";
import { HeroPanelCarousel } from "./hero-panel-carousel";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative mx-auto flex min-h-svh max-w-6xl scroll-mt-24 flex-col justify-center gap-12 px-6 py-28 sm:gap-16 sm:py-32 lg:flex-row lg:items-center lg:gap-12"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-7"
      >
        <motion.p
          variants={item}
          className="font-mono text-xs font-medium tracking-[0.2em] text-primary"
        >
          {siteConfig.eyebrow}
        </motion.p>

        <motion.h1
          variants={item}
          className="font-heading text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {siteConfig.headline}
        </motion.h1>

        <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-muted-foreground">
          {siteConfig.intro}
        </motion.p>

        <motion.div variants={item} className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current focus
          </p>
          <div className="flex flex-wrap gap-2">
            {siteConfig.focus.map((focus) => (
              <span
                key={focus}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground"
              >
                {focus}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            size="lg"
            onClick={() =>
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore work <ArrowDown className="size-4" />
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
              Download resume <Download className="size-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-1 justify-center lg:justify-end"
      >
        <HeroPanelCarousel />
      </motion.div>
    </section>
  );
}
