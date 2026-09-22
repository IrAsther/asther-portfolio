/**
 * BrandWordmark — "ASTHER"
 *
 * Pure text-based brand mark. No SVG, no images.
 * Uses Space Grotesk loaded via next/font/google for geometric precision.
 * Renders correctly in both Header (sm) and Hero (lg) contexts.
 */
import { spaceGrotesk } from "@/lib/fonts";
import styles from "./BrandWordmark.module.css";

export type WordmarkSize = "header" | "hero";

interface BrandWordmarkProps {
  size?: WordmarkSize;
  /** Override the root element — defaults to <span> */
  as?: React.ElementType;
  className?: string;
}

export function BrandWordmark({
  size = "header",
  as: Component = "span",
  className = "",
}: BrandWordmarkProps) {
  const rootClass = [
    styles.wordmark,
    styles[size],
    spaceGrotesk.className,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    /*
     * Screen readers see "ASTHER" as one word.
     * aria-label on the parent Link/button already provides context,
     * so we use aria-hidden on internal spans to avoid redundant announcements.
     */
    <Component className={rootClass} aria-hidden="true">
      {/* Letters A S T H E are in the primary color */}
      <span className={styles.letters}>ASTHE</span>
      {/* Final "R" carries the accent — creates a subtle focal point */}
      <span className={styles.accentLetter}>R</span>
      {/* Thin accent mark — purely decorative */}
      <span className={styles.accentMark} />
    </Component>
  );
}
