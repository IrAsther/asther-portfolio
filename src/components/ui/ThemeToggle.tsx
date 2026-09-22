"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/useTheme";
import styles from "./ThemeToggle.module.css";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${styles.toggleButton} ${className}`.trim()}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <Sun className={styles.icon} aria-hidden="true" />
      ) : (
        <Moon className={styles.icon} aria-hidden="true" />
      )}
      <span className="sr-only">{label}</span>
    </button>
  );
}
