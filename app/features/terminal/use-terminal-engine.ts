import { useCallback, useRef, useState } from "react";
import { runCommand, type TerminalContext } from "./commands";

interface Line {
  id: number;
  type: "input" | "output";
  text: string;
}

let lineId = 0;

export function useTerminalEngine(ctx: Omit<TerminalContext, "clear">) {
  const [lines, setLines] = useState<Line[]>([
    { id: lineId++, type: "output", text: "Louis Afful's terminal - type 'help' to get started." },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const historyIndex = useRef<number>(-1);

  const clear = useCallback(() => setLines([]), []);

  const submit = useCallback(
    (input: string) => {
      setLines((prev) => [...prev, { id: lineId++, type: "input", text: input }]);
      setHistory((prev) => [...prev, input]);
      historyIndex.current = -1;

      const output = runCommand(input, { ...ctx, clear });
      if (output.length > 0) {
        setLines((prev) => [
          ...prev,
          ...output.map((text) => ({ id: lineId++, type: "output" as const, text })),
        ]);
      }
    },
    [ctx, clear],
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down"): string | undefined => {
      if (history.length === 0) return undefined;

      if (direction === "up") {
        historyIndex.current = Math.min(historyIndex.current + 1, history.length - 1);
      } else {
        historyIndex.current = Math.max(historyIndex.current - 1, -1);
      }

      return historyIndex.current === -1
        ? ""
        : history[history.length - 1 - historyIndex.current];
    },
    [history],
  );

  return { lines, submit, navigateHistory };
}
