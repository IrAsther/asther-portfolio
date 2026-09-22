import { Container } from "@/components/ui/Container";
import styles from "./DesignHero.module.css";

export function DesignHero() {
  return (
    <section className={styles.hero} aria-labelledby="design-hero-heading">
      <Container>
        <div className={styles.inner}>
          {/* Eyebrow */}
          <div className={styles.badgeRow}>
            <span className={styles.badge}>Graphic Design & Visual Communication</span>
            <span className={styles.badgeMeta}>UI • Editorial • Brand Patterns</span>
          </div>

          {/* Heading */}
          <h1 id="design-hero-heading" className={styles.title}>
            Design That Communicates
          </h1>

          {/* Lead */}
          <p className={styles.lead}>
            Visual communication, digital product interface design, and brand compositions.
            I combine graphic design craft with software engineering to transform complex ideas
            into clean, legible, and engaging digital experiences.
          </p>

          {/* Metrics */}
          <div className={styles.metricGrid}>
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>08</span>
              <span className={styles.metricLabel}>Authentic Works</span>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>03</span>
              <span className={styles.metricLabel}>Design Categories</span>
            </div>
            <div className={styles.divider} aria-hidden="true" />
            <div className={styles.metricItem}>
              <span className={styles.metricValue}>100%</span>
              <span className={styles.metricLabel}>Real User Assets</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
