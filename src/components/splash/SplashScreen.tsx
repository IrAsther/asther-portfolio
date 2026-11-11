"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import styles from "./SplashScreen.module.css";

/* ── Constants ────────────────────────────────────────────────────────────── */
const SPLASH_SESSION_KEY = "asther_splash_seen";
/** Total display time in ms before auto-transition */
const SPLASH_DURATION_MS = 3000;

/* ── Component ────────────────────────────────────────────────────────────── */
export function SplashScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return sessionStorage.getItem(SPLASH_SESSION_KEY) !== "1";
    } catch {
      return false;
    }
  });

  const [exiting, setExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setExiting(true);
    // Mark session as seen
    try {
      sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      /* sessionStorage unavailable (e.g. private browsing restrictions) */
    }
    // Unmount after exit transition (800ms)
    exitTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 800);
  }, []);

  // Auto-dismiss timer on mount when visible
  useEffect(() => {
    if (!visible) return;

    let prefersReduced = false;
    if (typeof window !== "undefined") {
      prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const duration = prefersReduced ? 1600 : SPLASH_DURATION_MS;

    timerRef.current = setTimeout(() => {
      dismiss();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [visible, dismiss]);

  // Keyboard: Escape key to skip
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.stage}${exiting ? ` ${styles.exiting}` : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${siteConfig.name} Intro`}
    >
      {/* Centered Official Website Logo Only */}
      <div className={styles.logoWrapper}>
        <Image
          src="/Asther_logo.png"
          alt={`${siteConfig.name} Logo`}
          width={320}
          height={320}
          priority
          className={styles.logoImage}
        />
      </div>

      {/* Accessible Skip Button */}
      <button
        className={styles.skipBtn}
        onClick={dismiss}
        aria-label="Skip intro animation"
        type="button"
      >
        Skip
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 6h8M7 3l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
