"use client";

import Image from "next/image";
import styles from "./ContactBackground.module.css";

/**
 * ContactBackground — Uses the authentic project PNG logo as an architectural background element.
 *
 * Layers:
 * 1. Base page background (var(--color-bg))
 * 2. Large subtle PNG logo (/Asther_logo.png) positioned on the right and partially cropped
 * 3. Subtle architectural datum and grid guidelines
 * 4. Content above everything
 */
export function ContactBackground() {
  return (
    <div className={styles.backgroundRoot} aria-hidden="true">
      {/* Layer 3: Subtle Architectural Grid Lines */}
      <div className={styles.gridOverlay} />

      {/* Layer 3b: Horizontal Architectural Datum Line */}
      <div className={styles.datumLine} />

      {/* Layer 2: The Authentic Brand Logo Graphic */}
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
