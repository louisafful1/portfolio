import { useEffect, useRef, useState } from "react";
import { LogoMark } from "~/components/logo-mark";
import { TERMINAL_DEMO_SCRIPT } from "./terminal-demo-script";

type Phase = "question" | "thinking" | "answer" | "hold" | "clear";

const QUESTION_SPEED_MS = 45;
const ANSWER_SPEED_MS = 16;
const THINKING_HOLD_MS = 700;
const ANSWER_HOLD_MS = 2400;
const CLEAR_HOLD_MS = 400;

// This decorative hero demo intentionally always animates, regardless of
// prefers-reduced-motion - a deliberate choice for this one feature (unlike
// the rest of the site, which does respect it).
export function TerminalDemoPanel({ onCycleComplete }: { onCycleComplete?: () => void }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [questionChars, setQuestionChars] = useState(0);
  const [answerChars, setAnswerChars] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const onCycleCompleteRef = useRef(onCycleComplete);

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  const step = TERMINAL_DEMO_SCRIPT[stepIndex];

  useEffect(() => {
    const clear = () => clearTimeout(timeoutRef.current);

    if (phase === "question") {
      if (questionChars < step.question.length) {
        timeoutRef.current = setTimeout(() => setQuestionChars((c) => c + 1), QUESTION_SPEED_MS);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("thinking"), 300);
      }
    } else if (phase === "thinking") {
      timeoutRef.current = setTimeout(() => setPhase("answer"), THINKING_HOLD_MS);
    } else if (phase === "answer") {
      if (answerChars < step.answer.length) {
        timeoutRef.current = setTimeout(() => setAnswerChars((c) => c + 1), ANSWER_SPEED_MS);
      } else {
        timeoutRef.current = setTimeout(() => setPhase("hold"), ANSWER_HOLD_MS);
      }
    } else if (phase === "hold") {
      timeoutRef.current = setTimeout(() => {
        onCycleCompleteRef.current?.();
        setPhase("clear");
      }, 0);
    } else if (phase === "clear") {
      timeoutRef.current = setTimeout(() => {
        setQuestionChars(0);
        setAnswerChars(0);
        setStepIndex((index) => (index + 1) % TERMINAL_DEMO_SCRIPT.length);
        setPhase("question");
      }, CLEAR_HOLD_MS);
    }

    return clear;
  }, [phase, questionChars, answerChars, step]);

  const showQuestion = step.question.slice(0, questionChars);
  const isTypingQuestion = phase === "question" && questionChars < step.question.length;
  const showThinking = phase === "thinking";
  const showAnswer =
    phase === "answer" || phase === "hold" || phase === "clear" ? step.answer.slice(0, answerChars) : "";
  const isTypingAnswer = phase === "answer" && answerChars < step.answer.length;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-[#0a0a0c] font-mono text-[#e4e4e7]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-xs text-[#71717a]">louis@portfolio - zsh</span>
        <LogoMark className="ml-auto h-4 w-auto opacity-80" />
      </div>

      <div className="flex min-h-96 flex-col justify-center px-5 py-5 text-sm leading-relaxed">
        <p className="mb-3 text-xs text-[#71717a]">Ask about my work, projects, experience or skills.</p>

        <div className="flex gap-2">
          <span className="shrink-0 text-primary">➜</span>
          <span>
            {showQuestion}
            {isTypingQuestion && <span className="animate-pulse text-primary">▍</span>}
          </span>
        </div>

        {showThinking && <p className="mt-2 text-[#71717a]">Searching Louis's portfolio...</p>}

        {showAnswer && (
          <p className="mt-2 whitespace-pre-wrap text-[#a1a1aa]">
            {showAnswer}
            {isTypingAnswer && <span className="animate-pulse text-primary">▍</span>}
          </p>
        )}
      </div>
    </div>
  );
}
