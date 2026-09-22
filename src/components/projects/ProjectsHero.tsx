import { Container } from "@/components/ui/Container";
import styles from "./ProjectsHero.module.css";

export function ProjectsHero() {
  return (
    <section className={styles.hero} aria-labelledby="projects-hero-heading">
      <Container>
        <div className={styles.inner}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Selected Work</span>
            <span className={styles.badgeMeta}>Software • Systems • Design</span>
          </div>

          <h1 id="projects-hero-heading" className={styles.title}>
            Projects
          </h1>

          <p className={styles.lead}>
            A curated index of software applications, intelligent system architectures,
            and digital tools. Each entry transparently represents verified builds, active
            technical explorations, or structured engineering specifications.
          </p>

          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>01</span>
              <span className={styles.metaLabel}>Verified Showcase</span>
            </div>
            <div className={styles.metaDivider} aria-hidden="true" />
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>02</span>
              <span className={styles.metaLabel}>System Architectures</span>
            </div>
            <div className={styles.metaDivider} aria-hidden="true" />
            <div className={styles.metaItem}>
              <span className={styles.metaNumber}>100%</span>
              <span className={styles.metaLabel}>Authentic & Uninflated</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
