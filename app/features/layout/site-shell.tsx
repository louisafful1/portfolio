import { useState } from "react";
import { Outlet } from "react-router";
import { ThemeProvider } from "~/features/theme/theme-provider";
import { TooltipProvider } from "~/components/ui/tooltip";
import { EngineeringGrid } from "~/features/background/engineering-grid";
import { FloatingNav } from "~/features/navigation/floating-nav";
import { CommandPalette } from "~/features/navigation/command-palette";
import { Terminal } from "~/features/terminal/terminal";
import { SiteFooter } from "./site-footer";

export function SiteShell() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <EngineeringGrid />
        <FloatingNav onOpenTerminal={() => setTerminalOpen(true)} />
        <CommandPalette onOpenTerminal={() => setTerminalOpen(true)} />
        <Terminal open={terminalOpen} onOpenChange={setTerminalOpen} />
        <div className="relative flex min-h-svh flex-col">
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
