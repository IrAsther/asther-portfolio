import { Container } from "@/components/ui/Container";
import { currentFocus } from "@/data/about";
import styles from "./CurrentFocus.module.css";

export function CurrentFocus() {
  return (
    <section className={styles.section} aria-labelledby="current-focus-heading">
      <Container className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel} aria-hidden="true">
            07 — Current Focus
          </span>
          <h2 id="current-focus-heading" className={styles.heading}>
            What I&apos;m Focused On Now
          </h2>
        </div>

        {/* Focus list */}
        <ul className={styles.focusList} aria-label="Current focus areas">
          {currentFocus.map((item, index) => (
            <li key={index} className={styles.focusItem}>
              <span className={styles.focusIndex} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.focusLabel}>{item.label}</span>
            </li>
          ))}
        </ul>

        <p className={styles.note}>
          This reflects where my energy is directed now — not a list of
          completed achievements.
        </p>
      </Container>
    </section>
  );
}
