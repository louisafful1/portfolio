import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyTheme = useCallback((next: Theme) => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(next);
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("theme", next);
    setThemeState(next);
  }, []);

  useEffect(() => {
    setThemeState(getInitialTheme());
  }, []);

  const setTheme = useCallback((next: Theme) => applyTheme(next), [applyTheme]);
  const toggleTheme = useCallback(
    () => applyTheme(theme === "dark" ? "light" : "dark"),
    [applyTheme, theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
