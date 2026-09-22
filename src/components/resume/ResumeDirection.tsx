import { Container } from "@/components/ui/Container";
import { resumeDirections } from "@/data/resume";
import styles from "./ResumeDirection.module.css";

export function ResumeDirection() {
  return (
    <section className={styles.section} aria-labelledby="resume-direction-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>05</span>
            <span className={styles.sectionTagline}>Trajectory</span>
          </div>
          <h2 id="resume-direction-heading" className={styles.heading}>
            Current Professional Direction
          </h2>
          <p className={styles.subheading}>
            Core technical pursuits and engineering disciplines guiding active learning,
            project formulation, and collaborative interests.
          </p>
        </div>

        <div className={styles.grid}>
          {resumeDirections.map((dir) => (
            <div key={dir.title} className={styles.directionCard}>
              <div className={styles.cardTop}>
                <span className={styles.accentBar} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{dir.title}</h3>
              </div>
              <span className={styles.summary}>{dir.summary}</span>
              <p className={styles.description}>{dir.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
