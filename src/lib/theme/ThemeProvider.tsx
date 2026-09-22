"use client";

import React, { createContext, useContext, useEffect, useRef, useState, startTransition } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "asther-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const themeRef = useRef<Theme>("system");

  // Keep themeRef synchronized for event callbacks without re-triggering effects
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Initial sync from localStorage or active document attribute
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initialTheme: Theme =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";

    const docTheme = document.documentElement.getAttribute("data-theme") as ResolvedTheme | null;
    const initialResolved: ResolvedTheme =
      initialTheme === "system"
        ? (docTheme === "dark" || docTheme === "light" ? docTheme : getSystemTheme())
        : initialTheme;

    themeRef.current = initialTheme;
    startTransition(() => {
      setThemeState(initialTheme);
      setResolvedTheme(initialResolved);
    });
    document.documentElement.setAttribute("data-theme", initialResolved);

    // Watch system changes if system theme is selected
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (themeRef.current === "system") {
        const nextResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(nextResolved);
        document.documentElement.setAttribute("data-theme", nextResolved);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, []);

  const setTheme = (nextTheme: Theme) => {
    themeRef.current = nextTheme;
    setThemeState(nextTheme);
    const nextResolved: ResolvedTheme = nextTheme === "system" ? getSystemTheme() : nextTheme;
    setResolvedTheme(nextResolved);
    document.documentElement.setAttribute("data-theme", nextResolved);
    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // Ignore localStorage write failures in private mode
    }
  };

  const toggleTheme = () => {
    const next: ResolvedTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
