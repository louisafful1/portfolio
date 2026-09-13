import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DashboardPanel } from "./dashboard-panel";
import { TerminalDemoPanel } from "./terminal-demo-panel";

const DASHBOARD_SLIDE_MS = 5500;
const SLIDE_COUNT = 2;

// This carousel intentionally always auto-plays, regardless of
// prefers-reduced-motion - a deliberate choice for this one hero feature
// (unlike the rest of the site, which does respect it).
export function HeroPanelCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const advance = useCallback(() => {
    if (pausedRef.current) return;
    setIndex((current) => (current + 1) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    // Only the dashboard slide advances on a blind timer. The terminal demo
    // (index 1) calls advance() itself once its scripted answer has actually
    // finished typing and held on screen, so it's never cut off mid-sentence.
    if (paused || index !== 0) return;
    const timeout = setTimeout(advance, DASHBOARD_SLIDE_MS);
    return () => clearTimeout(timeout);
  }, [index, paused, advance]);

  return (
    <div
      className="flex w-full max-w-md flex-col items-center gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div layout transition={{ duration: 0.4, ease: "easeInOut" }} className="relative w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 32, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -32, scale: 0.97 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {index === 0 ? <DashboardPanel /> : <TerminalDemoPanel onCycleComplete={advance} />}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: SLIDE_COUNT }).map((_, slideIndex) => (
          <button
            key={slideIndex}
            type="button"
            aria-label={`Show panel ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={
              slideIndex === index
                ? "h-1.5 w-5 rounded-full bg-primary transition-all"
                : "h-1.5 w-1.5 rounded-full bg-border transition-all hover:bg-muted-foreground"
            }
          />
        ))}
      </div>
    </div>
  );
}
