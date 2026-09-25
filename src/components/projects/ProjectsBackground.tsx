"use client";

import styles from "./ProjectsBackground.module.css";

/**
 * ProjectsBackground — Architectural background system derived directly from the Asther logo.
 *
 * Visual Motifs Derived from Logo:
 * 1. Giant concentric sweeping crescent arcs (matching the spherical ribbons of the logo emblem).
 * 2. Horizontal datum axis (derived from the horizontal crossbar intersecting the logo sphere).
 * 3. Radial tangent alignment lines (echoing the diagonal ribbon trajectory).
 * 4. Sweeping bottom orbital arc (reflecting the logo's outer curved baseline).
 * 5. Low-opacity brand orange accents (#FD5E02) and deep teal (#023341) hairlines.
 */
export function ProjectsBackground() {
  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      {/* ────────────────────────────────────────────────────────────
          LAYER 1: Primary Macro Structure (Top-Right Viewport Sweep)
          Derived from the logo's spherical emblem ribbons
          ──────────────────────────────────────────────────────────── */}
      <div className={styles.topRightSystem}>
        <svg
          viewBox="0 0 1000 1000"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgGraphic}
        >
          <defs>
            {/* Subtle radial falloff to blend edges seamlessly into page background */}
            <radialGradient id="topEmblemGlow" cx="500" cy="500" r="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.06" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.02" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Very soft warm tonal field */}
          <circle cx="500" cy="500" r="460" fill="url(#topEmblemGlow)" />

          {/* Primary Concentric Arcs (Hairlines) */}
          <circle
            cx="500"
            cy="500"
            r="440"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.hairline}
          />
          <circle
            cx="500"
            cy="500"
            r="360"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="4 8"
            className={styles.hairlineDashed}
          />
          <circle
            cx="500"
            cy="500"
            r="280"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.hairline}
          />
          <circle
            cx="500"
            cy="500"
            r="190"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.hairline}
          />

          {/* Sweeping Crescent Ribbon 1 (Outer perimeter sweep of the logo) */}
          <path
            d="M 280 820 A 440 440 0 0 0 920 620 A 440 440 0 0 1 400 860 Z"
            fill="var(--color-accent)"
            className={styles.ribbonFillAccent}
          />

          {/* Sweeping Crescent Ribbon 2 (Main central diagonal band) */}
          <path
            d="M 190 680 A 380 380 0 0 0 680 180 A 380 380 0 0 1 260 740 Z"
            fill="var(--color-text)"
            className={styles.ribbonFillTeal}
          />

          {/* Sweeping Crescent Ribbon 3 (Secondary inner arc) */}
          <path
            d="M 270 540 A 280 280 0 0 0 620 270 A 280 280 0 0 1 320 600 Z"
            fill="var(--color-accent)"
            className={styles.ribbonFillAccentLight}
          />

          {/* Sweeping Crescent Ribbon 4 (Core inner crest) */}
          <path
            d="M 360 440 A 190 190 0 0 0 540 340 A 190 190 0 0 1 400 480 Z"
            fill="var(--color-text)"
            className={styles.ribbonFillTeal}
          />

          {/* Horizontal Datum Guideline (Extends across the arc center) */}
          <line
            x1="0"
            y1="500"
            x2="1000"
            y2="500"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.datumLine}
          />

          {/* Radial Angle Trajectory Lines (Matching the 45° and 60° ribbon trajectories) */}
          <line
            x1="180"
            y1="820"
            x2="820"
            y2="180"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="2 6"
            className={styles.angleLine}
          />
          <line
            x1="260"
            y1="900"
            x2="740"
            y2="100"
            stroke="var(--color-accent)"
            strokeWidth="1"
            className={styles.accentGuideLine}
          />

          {/* Architectural Alignment Crosshairs */}
          <line x1="490" y1="500" x2="510" y2="500" stroke="var(--color-accent)" strokeWidth="1.5" />
          <line x1="500" y1="490" x2="500" y2="510" stroke="var(--color-accent)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────────
          LAYER 2: Counter-Balance Arc System (Mid-Left Viewport)
          Derived from the outer sweeping curve of the logo emblem
          ──────────────────────────────────────────────────────────── */}
      <div className={styles.midLeftSystem}>
        <svg
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svgGraphic}
        >
          {/* Sweeping Counter-Arc */}
          <circle
            cx="200"
            cy="400"
            r="380"
            stroke="var(--color-border)"
            strokeWidth="1"
            strokeDasharray="6 12"
            className={styles.hairlineDashed}
          />
          <circle
            cx="200"
            cy="400"
            r="280"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.hairline}
          />

          {/* Soft Orange Sweeping Lower Crescent */}
          <path
            d="M 60 620 A 380 380 0 0 0 540 280 A 380 380 0 0 1 100 660 Z"
            fill="var(--color-accent)"
            className={styles.ribbonFillAccent}
          />

          {/* Horizontal Datum Line */}
          <line
            x1="0"
            y1="400"
            x2="800"
            y2="400"
            stroke="var(--color-border)"
            strokeWidth="1"
            className={styles.datumLine}
          />
        </svg>
      </div>

      {/* ────────────────────────────────────────────────────────────
          LAYER 3: Subtle Longitudinal Architectural Grid Lines
          Grounding the negative space between content sections
          ──────────────────────────────────────────────────────────── */}
      <div className={styles.gridOverlay} />
    </div>
  );
}
