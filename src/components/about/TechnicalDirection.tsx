import { Container } from "@/components/ui/Container";
import { technologies } from "@/data/about";
import styles from "./TechnicalDirection.module.css";

export function TechnicalDirection() {
  return (
    <section
      className={styles.section}
      aria-labelledby="technical-direction-heading"
    >
      <Container className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.sectionLabel} aria-hidden="true">
            04 — Technical Direction
          </span>
          <h2 id="technical-direction-heading" className={styles.heading}>
            What I&apos;m Building With
          </h2>
          <p className={styles.subheading}>
            Technologies I use and explore across software development, web
            engineering, and applied AI. This reflects my current technical
            ecosystem — not a ranked claim of mastery.
          </p>
        </div>

        {/* Technology groups */}
        <div className={styles.groups} role="list" aria-label="Technology groups">
          {technologies.map((group) => (
            <div key={group.category} className={styles.group} role="listitem">
              <h3 className={styles.groupTitle}>{group.category}</h3>
              <ul className={styles.techList} aria-label={group.category}>
                {group.items.map((tech) => (
                  <li key={tech} className={styles.techItem}>
                    <span className={styles.techDot} aria-hidden="true" />
                    <span className={styles.techName}>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Honest disclaimer */}
        <p className={styles.disclaimer}>
          My current technical focus includes both front-end and back-end
          software development, with ongoing exploration of AI/ML methods and
          how they integrate into practical digital products.
        </p>
      </Container>
    </section>
  );
}
