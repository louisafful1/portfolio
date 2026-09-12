import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { LogoMark } from "~/components/logo-mark";
import { siteConfig } from "~/lib/site-config";
import { useTerminalEngine } from "./use-terminal-engine";

export function Terminal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");

  const { lines, submit, navigateHistory } = useTerminalEngine({
    navigateToSection: (id) => {
      onOpenChange(false);
      if (location.pathname === "/") {
        requestAnimationFrame(() =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        );
      } else {
        navigate(`/#${id}`);
      }
    },
    openResume: () => window.open(siteConfig.resumeUrl, "_blank"),
  });

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const command = value;
      setValue("");
      submit(command);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const previous = navigateHistory("up");
      if (previous !== undefined) setValue(previous);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = navigateHistory("down");
      if (next !== undefined) setValue(next);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-1/2 max-w-2xl gap-0 overflow-hidden rounded-xl border-border bg-[#0a0a0c] p-0 font-mono text-[#e4e4e7] sm:max-w-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        <DialogTitle className="sr-only">Terminal</DialogTitle>
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-xs text-[#71717a]">louis@portfolio - zsh</span>
          <LogoMark className="ml-auto h-4 w-auto opacity-80" />
        </div>

        <div ref={scrollRef} className="max-h-96 overflow-y-auto px-4 py-3 text-sm leading-relaxed">
          {lines.map((line) => (
            <div key={line.id} className={line.type === "input" ? "flex gap-2" : "whitespace-pre-wrap text-[#a1a1aa]"}>
              {line.type === "input" && <span className="shrink-0 text-primary">➜</span>}
              <span>{line.text}</span>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <span className="shrink-0 text-primary">➜</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
              className="w-full bg-transparent outline-none placeholder:text-[#52525b]"
              placeholder="type a command..."
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
