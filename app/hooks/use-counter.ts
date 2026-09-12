import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

export function useCounter(target: number, duration = 1200) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setValue(target);
      return;
    }

    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, reducedMotion]);

  return { ref, value };
}
