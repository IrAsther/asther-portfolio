import { Container } from "@/components/ui/Container";
import { education as staticEducation } from "@/data/about";
import type { ResumeEducationItem } from "@/data/resume";
import styles from "./Education.module.css";

// Map static EducationEntry → ResumeEducationItem shape for the fallback
const defaultEducation: ResumeEducationItem[] = staticEducation.map((e) => ({
  institution: e.institution,
  field: e.field,
  status: e.current ? "Currently Enrolled" : "Completed",
  note: e.note,
  current: e.current,
}));

export function Education({
  education = defaultEducation,
}: {
  education?: ResumeEducationItem[];
} = {}) {
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
          {education.map((entry, idx) => (
            <article
              key={`${entry.institution}-${entry.field}-${idx}`}
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
