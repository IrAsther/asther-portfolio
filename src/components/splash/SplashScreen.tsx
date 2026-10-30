"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./SplashScreen.module.css";

/* ── Constants ────────────────────────────────────────────────────────────── */
const SPLASH_SESSION_KEY = "asther_splash_seen";
/** Total display time in ms before auto-transition */
const SPLASH_DURATION_MS = 4200;

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
    // Unmount after CSS exit transition (900ms)
    exitTimerRef.current = setTimeout(() => {
      setVisible(false);
    }, 950);
  }, []);

  // Auto-dismiss timer on mount when visible
  useEffect(() => {
    if (!visible) return;

    let prefersReduced = false;
    if (typeof window !== "undefined") {
      prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    const duration = prefersReduced ? 2200 : SPLASH_DURATION_MS;

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
      aria-label="Intro animation — Asther Irakaza Portfolio"
      aria-live="polite"
    >
      {/* Ambient background layers */}
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.ambientLight} aria-hidden="true" />
      <div className={styles.warmLight} aria-hidden="true" />

      {/* Progress bar */}
      <div
        className={styles.progressBar}
        style={{ "--splash-duration": `${SPLASH_DURATION_MS}ms` } as React.CSSProperties}
        aria-hidden="true"
      />

      {/* Main 3D scene */}
      <div className={styles.scene}>

        {/* Brand monogram */}
        <div className={styles.monogramWrap} aria-hidden="true">
          <svg
            className={styles.monogramSvg}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Metallic teal gradient for the outer ring */}
              <radialGradient id="tealMetal" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#0A7A73" />
                <stop offset="40%" stopColor="#023341" />
                <stop offset="100%" stopColor="#010F12" />
              </radialGradient>

              {/* Orange accent gradient */}
              <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FD5E02" />
                <stop offset="50%" stopColor="#FF8C3A" />
                <stop offset="100%" stopColor="#E84C00" />
              </linearGradient>

              {/* Cream/warm highlight for letter strokes */}
              <linearGradient id="creamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCF5E3" stopOpacity="0.95" />
                <stop offset="60%" stopColor="#FFD0A8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FD5E02" stopOpacity="0.6" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Subtle bevel shadow */}
              <filter id="bevel" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
                <feDropShadow dx="-1" dy="-1" stdDeviation="2" floodColor="#0A7A73" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* ── Outer decorative ring ── */}
            <circle
              cx="100" cy="100" r="94"
              stroke="url(#tealMetal)"
              strokeWidth="2"
              fill="url(#tealMetal)"
              opacity="0.9"
            />

            {/* ── Thin accent ring ── */}
            <circle
              cx="100" cy="100" r="88"
              stroke="rgba(253,94,2,0.35)"
              strokeWidth="0.8"
              fill="none"
            />

            {/* ── Tick marks at 12, 3, 6, 9 o'clock ── */}
            {[0, 90, 180, 270].map((deg) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const x1 = 100 + 88 * Math.cos(rad);
              const y1 = 100 + 88 * Math.sin(rad);
              const x2 = 100 + 78 * Math.cos(rad);
              const y2 = 100 + 78 * Math.sin(rad);
              return (
                <line
                  key={deg}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="rgba(253,94,2,0.55)"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* ── Letter "A" (monogram) ── */}
            <path
              d="M 72 148 L 100 52 L 128 148 M 82 118 L 118 118"
              stroke="url(#creamGrad)"
              strokeWidth="9"
              strokeLinecap="square"
              strokeLinejoin="miter"
              fill="none"
              filter="url(#bevel)"
            />

            {/* ── Orange accent: small square node at apex ── */}
            <rect
              x="95.5" y="47.5" width="9" height="9"
              fill="url(#orangeGrad)"
              filter="url(#glow)"
              rx="1"
            />

            {/* ── Inner corner accent dots ── */}
            <circle cx="100" cy="100" r="3.5" fill="rgba(253,94,2,0.25)" />
            <circle cx="100" cy="100" r="1.5" fill="#FD5E02" opacity="0.6" />

            {/* ── Thin horizontal scan line ── */}
            <line
              x1="18" y1="152" x2="182" y2="152"
              stroke="rgba(253,94,2,0.2)"
              strokeWidth="0.5"
              strokeDasharray="2 4"
            />
          </svg>

          {/* Orbiting accent ring */}
          <div className={styles.orbit} aria-hidden="true" />

          {/* Corner brackets */}
          <div className={styles.cornerTR} aria-hidden="true" />
          <div className={styles.cornerBL} aria-hidden="true" />
        </div>

        {/* Typography block */}
        <div className={styles.textBlock}>
          <h1 className={styles.name}>Asther Irakaza</h1>

          <div className={styles.divider} aria-hidden="true" />

          <p className={styles.tagline}>
            Creative Developer
            <span className={styles.accentDot} aria-hidden="true" />
            AI &amp; Technology
          </p>
        </div>
      </div>

      {/* Skip button */}
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
