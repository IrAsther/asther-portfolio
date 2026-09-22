import { Container } from "@/components/ui/Container";
import { resumeProjects } from "@/data/resume";
import styles from "./ResumeProjects.module.css";

export function ResumeProjects() {
  return (
    <section className={styles.section} aria-labelledby="resume-projects-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>04</span>
            <span className={styles.sectionTagline}>Applied Practice</span>
          </div>
          <h2 id="resume-projects-heading" className={styles.heading}>
            Selected Project Experience
          </h2>
          <p className={styles.subheading}>
            Hands-on software application builds and educational platforms developed
            to address specific practical and computational needs.
          </p>
        </div>

        <div className={styles.grid}>
          {resumeProjects.map((project) => (
            <article key={project.id} className={styles.projectCard}>
              <div className={styles.cardHeader}>
                <div className={styles.titleArea}>
                  <span className={styles.category}>{project.category}</span>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                </div>
                <span className={styles.statusBadge}>{project.status}</span>
              </div>

              <p className={styles.summary}>{project.summary}</p>

              <div className={styles.focusBlock}>
                <span className={styles.focusLabel}>Key Engineering Focus</span>
                <ul className={styles.focusList}>
                  {project.focusAreas.map((area) => (
                    <li key={area} className={styles.focusItem}>
                      <span className={styles.bullet} aria-hidden="true" />
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.techTags} aria-label="Technologies used">
                  {project.technologies.map((tech) => (
                    <span key={tech} className={styles.techTag}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
