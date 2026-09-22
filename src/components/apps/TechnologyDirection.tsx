import { Container } from "@/components/ui/Container";
import { applicationTechGroups } from "@/data/apps";
import styles from "./TechnologyDirection.module.css";

export function TechnologyDirection() {
  return (
    <section className={styles.section} aria-labelledby="tech-direction-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>04</span>
            <span className={styles.sectionTagline}>Technical Ecosystem</span>
          </div>
          <h2 id="tech-direction-heading" className={styles.heading}>
            Application Stack & Technical Direction
          </h2>
          <p className={styles.subheading}>
            Technologies and tooling applied across frontend architectures, database design,
            and intelligent assistants.
          </p>
        </div>

        <div className={styles.grid}>
          {applicationTechGroups.map((group) => (
            <div key={group.name} className={styles.groupCard}>
              <div className={styles.groupHeader}>
                <h3 className={styles.groupName}>{group.name}</h3>
                <p className={styles.groupDescription}>{group.description}</p>
              </div>
              <div className={styles.techPills} aria-label={`${group.name} technologies`}>
                {group.technologies.map((tech) => (
                  <span key={tech} className={styles.techPill}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
