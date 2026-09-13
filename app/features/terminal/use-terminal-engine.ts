import { useCallback, useRef, useState } from "react";
import { isKnownCommand, runCommand, type TerminalContext } from "./commands";
import { SOURCES_DELIMITER } from "./knowledge/ask-protocol";

export interface TerminalSource {
  title: string;
  route: string;
}

interface Line {
  id: number;
  type: "input" | "output" | "sources";
  text?: string;
  sources?: TerminalSource[];
}

let lineId = 0;
const MAX_QUESTION_LENGTH = 300;

export function useTerminalEngine(ctx: Omit<TerminalContext, "clear">) {
  const [lines, setLines] = useState<Line[]>([
    {
      id: lineId++,
      type: "output",
      text: "Louis Afful's terminal. Type 'help' for commands, or ask a question about my work, projects, experience or skills.",
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const pendingRef = useRef(false);

  const clear = useCallback(() => setLines([]), []);

  const appendLine = useCallback((line: Omit<Line, "id">) => {
    const id = lineId++;
    setLines((prev) => [...prev, { id, ...line }]);
    return id;
  }, []);

  const updateLine = useCallback((id: number, text: string) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, text } : line)));
  }, []);

  const askPortfolio = useCallback(
    async (question: string) => {
      pendingRef.current = true;
      const answerId = appendLine({ type: "output", text: "Searching Louis's portfolio..." });

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question.slice(0, MAX_QUESTION_LENGTH) }),
        });

        if (!response.ok || !response.body) {
          const message =
            response.status === 429
              ? "Too many questions at once - try again in a moment."
              : "Something went wrong reaching the assistant. Try again in a moment.";
          updateLine(answerId, message);
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let raw = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;
          raw += chunk;
          const visible = raw.split(SOURCES_DELIMITER)[0];
          updateLine(answerId, visible);
        }

        const [answerText, sourcesJson] = raw.split(SOURCES_DELIMITER);

        if (!answerText.trim()) {
          updateLine(answerId, "I don't have that information in Louis's portfolio.");
        }

        if (sourcesJson) {
          try {
            const sources: TerminalSource[] = JSON.parse(sourcesJson);
            if (sources.length > 0) {
              appendLine({ type: "sources", sources });
            }
          } catch {
            // Ignore malformed trailer.
          }
        }
      } catch {
        updateLine(answerId, "Something went wrong reaching the assistant. Try again in a moment.");
      } finally {
        pendingRef.current = false;
      }
    },
    [appendLine, updateLine],
  );

  const submit = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      appendLine({ type: "input", text: input });
      setHistory((prev) => [...prev, input]);
      historyIndex.current = -1;

      const firstWord = trimmed.toLowerCase().split(" ")[0];

      if (firstWord !== "ask" && isKnownCommand(firstWord)) {
        const output = runCommand(trimmed, { ...ctx, clear });
        output.forEach((text) => appendLine({ type: "output", text }));
        return;
      }

      if (pendingRef.current) {
        appendLine({ type: "output", text: "Still working on the previous question - one moment." });
        return;
      }

      if (firstWord === "ask") {
        const question = trimmed.slice(trimmed.indexOf(" ") + 1).trim();
        if (question === trimmed || !question) {
          appendLine({ type: "output", text: "Ask a question, e.g. 'ask what did Louis build at Adamus?'" });
          return;
        }
        void askPortfolio(question);
        return;
      }

      void askPortfolio(trimmed);
    },
    [ctx, clear, appendLine, askPortfolio],
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
