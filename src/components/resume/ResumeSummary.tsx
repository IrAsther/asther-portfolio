import { Container } from "@/components/ui/Container";
import { resumeProfile } from "@/data/resume";
import styles from "./ResumeSummary.module.css";

export function ResumeSummary() {
  return (
    <section className={styles.section} aria-labelledby="resume-summary-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.header}>
            <span className={styles.sectionIndex}>01</span>
            <h2 id="resume-summary-heading" className={styles.heading}>
              Professional Summary
            </h2>
          </div>
          <p className={styles.body}>{resumeProfile.summary}</p>
        </div>
      </Container>
    </section>
  );
}
