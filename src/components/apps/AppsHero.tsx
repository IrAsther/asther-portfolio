import { Container } from "@/components/ui/Container";
import styles from "./AppsHero.module.css";

export function AppsHero() {
  return (
    <section className={styles.hero} aria-labelledby="apps-hero-heading">
      <Container>
        <div className={styles.inner}>
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Applications & Digital Products</span>
            <span className={styles.badgeMeta}>EdTech • AI Utilities • Practical Tools</span>
          </div>

          <h1 id="apps-hero-heading" className={styles.title}>
            Apps I Build
          </h1>

          <p className={styles.lead}>
            A dedicated collection of functional software applications, interactive platforms,
            and digital tools. Each build addresses genuine operational or learning challenges
            by combining solid engineering, thoughtful user experience, and modern technology.
          </p>

          <div className={styles.metricGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>01</span>
              <span className={styles.metricLabel}>Live Utility Showcase</span>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>02</span>
              <span className={styles.metricLabel}>EdTech Platforms in Build</span>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>Authentic & Factual</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
