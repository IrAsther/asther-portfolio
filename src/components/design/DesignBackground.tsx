"use client";

import Image from "next/image";
import styles from "./DesignBackground.module.css";

/**
 * DesignBackground — Architectural background system using the authentic Asther logo.
 *
 * Layers:
 * 1. Base page background (var(--color-bg))
 * 2. Large subtle PNG logo (/Asther_logo.png) positioned on the right and partially cropped
 * 3. Subtle architectural datum and grid guidelines
 * 4. Content above everything
 */
export function DesignBackground() {
  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      {/* Subtle Architectural Longitudinal Grid */}
      <div className={styles.gridOverlay} />

      {/* Horizontal Architectural Datum Line */}
      <div className={styles.datumLine} />

      {/* The Authentic Brand Logo Graphic */}
      <div className={styles.logoStage}>
        <div className={styles.logoWrapper}>
          <Image
            src="/Asther_logo.png"
            alt=""
            width={950}
            height={950}
            priority
            className={styles.logoImage}
          />
        </div>
      </div>
    </div>
  );
}
