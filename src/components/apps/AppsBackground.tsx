"use client";

import Image from "next/image";
import styles from "./AppsBackground.module.css";

/**
 * AppsBackground — Architectural brand background using the authentic Asther logo.
 * Same visual language as DesignBackground but anchored to the left side.
 */
export function AppsBackground() {
  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      {/* Subtle horizontal datum line */}
      <div className={styles.datumLine} />

      {/* Subtle grid coordinates */}
      <div className={styles.gridOverlay} />

      {/* Authentic Brand Logo — large, low opacity, partially cropped */}
      <div className={styles.logoStage}>
        <div className={styles.logoWrapper}>
          <Image
            src="/Asther_logo.png"
            alt=""
            width={900}
            height={900}
            priority
            className={styles.logoImage}
          />
        </div>
      </div>
    </div>
  );
}
