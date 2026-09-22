import { Container } from "@/components/ui/Container";
import { education } from "@/data/about";
import styles from "./Education.module.css";

export function Education() {
  return (
    <section className={styles.section} aria-labelledby="education-heading">
      <Container className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel} aria-hidden="true">
            03 — Education
          </span>
          <h2 id="education-heading" className={styles.heading}>
            Education
          </h2>
        </div>

        {/* Education entries */}
        <div className={styles.entries} role="list">
          {education.map((entry) => (
            <article
              key={entry.institution}
              className={styles.entry}
              role="listitem"
            >
              <div className={styles.entryAccent} aria-hidden="true" />
              <div className={styles.entryBody}>
                <div className={styles.entryMeta}>
                  {entry.current && (
                    <span className={styles.currentBadge}>Currently Enrolled</span>
                  )}
                </div>
                <h3 className={styles.institution}>{entry.institution}</h3>
                <p className={styles.field}>{entry.field}</p>
                {entry.note && (
                  <p className={styles.note}>{entry.note}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
