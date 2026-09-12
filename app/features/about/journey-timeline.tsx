import { motion } from "motion/react";
import { journeySteps } from "~/features/experience/experience-data";

const captions: Record<string, string> = {
  "Problem First": "Understanding how the work actually happens, before writing a line of code.",
  "Full-Stack Development": "Building complete, working applications end to end.",
  "Business & Operational Software": "Solving real workflow problems - attendance, inventory, logistics, inspections.",
  "Real-World Systems": "Hands-on IT and software experience inside a live mining operation.",
  "AI-Powered Applications": "Adding intelligence to real workflows, not novelty demos.",
  "Software Engineer": "Building software that holds up under real operational use.",
};

export function JourneyTimeline() {
  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-1/2" />
      <ol className="space-y-10">
        {journeySteps.map((step, index) => (
          <motion.li
            key={step}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.4, delay: index * 0.04 }}
            className="relative flex items-start gap-4 sm:justify-center sm:gap-0"
          >
            <span className="relative z-10 mt-1.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background sm:absolute sm:left-1/2 sm:-translate-x-1/2">
              <span className="size-1.5 rounded-full bg-primary" />
            </span>
            <div className="hidden sm:grid sm:w-full sm:grid-cols-2 sm:gap-10">
              <div className="sm:col-start-1 sm:pr-10 sm:text-right">
                {index % 2 === 0 && (
                  <>
                    <p className="font-heading text-base font-medium text-foreground">{step}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{captions[step]}</p>
                  </>
                )}
              </div>
              <div className="sm:col-start-2 sm:pl-10">
                {index % 2 === 1 && (
                  <>
                    <p className="font-heading text-base font-medium text-foreground">{step}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{captions[step]}</p>
                  </>
                )}
              </div>
            </div>
            <div className="sm:hidden">
              <p className="font-heading text-base font-medium text-foreground">{step}</p>
              <p className="mt-1 text-sm text-muted-foreground">{captions[step]}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
