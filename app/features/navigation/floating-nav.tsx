import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Menu, TerminalSquare } from "lucide-react";
import { siteConfig } from "~/lib/site-config";
import { cn } from "~/lib/utils";
import { LogoMark } from "~/components/logo-mark";
import { ThemeToggle } from "~/features/theme/theme-toggle";
import { useActiveSection } from "./use-active-section";
import { useScrollProgress } from "./use-scroll-progress";
import { Button } from "~/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "~/components/ui/sheet";

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace("#", ""));

export function FloatingNav({ onOpenTerminal }: { onOpenTerminal: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const active = useActiveSection(isHome ? SECTION_IDS : []);
  const progress = useScrollProgress();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => (event: React.MouseEvent) => {
    const id = href.replace("#", "");
    if (isHome) {
      event.preventDefault();
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    } else {
      event.preventDefault();
      setMobileOpen(false);
      navigate(`/#${id}`);
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-border">
        <div
          className="h-full bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mx-auto mt-3 flex max-w-6xl items-center justify-between rounded-full border border-border/80 bg-background/70 px-4 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/50 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight text-foreground"
        >
          <LogoMark className="h-5 w-auto" />
          <span className="hidden sm:inline">
            Louis<span className="text-primary">.</span>Afful
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = isHome && active === id;
            return (
              <a
                key={item.href}
                href={`/${item.href}`}
                onClick={handleNavClick(item.href)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open terminal"
            onClick={onOpenTerminal}
            className="hidden text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            <TerminalSquare className="size-4" />
          </Button>
          <ThemeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-heading">Navigate</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {siteConfig.nav.map((item) => (
                  <a
                    key={item.href}
                    href={`/${item.href}`}
                    onClick={handleNavClick(item.href)}
                    className="rounded-md px-3 py-2 text-base text-muted-foreground hover:bg-accent hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    onOpenTerminal();
                  }}
                  className="mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-left text-base text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <TerminalSquare className="size-4" /> Terminal
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
