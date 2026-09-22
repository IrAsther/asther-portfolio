import { Container } from "@/components/ui/Container";
import { resumeEducation } from "@/data/resume";
import styles from "./ResumeEducation.module.css";

export function ResumeEducation() {
  return (
    <section className={styles.section} aria-labelledby="resume-education-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>03</span>
            <span className={styles.sectionTagline}>Academic Foundation</span>
          </div>
          <h2 id="resume-education-heading" className={styles.heading}>
            Education
          </h2>
          <p className={styles.subheading}>
            Formal academic coursework building foundational knowledge in computer science,
            software architecture, and digital technologies.
          </p>
        </div>

        <div className={styles.list}>
          {resumeEducation.map((item) => (
            <article key={item.institution} className={styles.itemCard}>
              <div className={styles.cardTop}>
                <div className={styles.institutionGroup}>
                  <h3 className={styles.institutionName}>{item.institution}</h3>
                  <span className={styles.field}>{item.field}</span>
                </div>
                <div className={styles.badgeWrapper}>
                  <span
                    className={`${styles.statusBadge} ${
                      item.current ? styles.statusCurrent : styles.statusCompleted
                    }`}
                  >
                    <span className={styles.dot} aria-hidden="true" />
                    <span>{item.status}</span>
                  </span>
                </div>
              </div>

              {item.note && <p className={styles.note}>{item.note}</p>}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
