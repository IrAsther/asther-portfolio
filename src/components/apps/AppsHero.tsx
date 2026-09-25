import { Container } from "@/components/ui/Container";
import styles from "./AppsHero.module.css";

export function AppsHero() {
  return (
    <section className={styles.hero} aria-labelledby="apps-hero-heading">
      <Container>
        <div className={styles.inner}>
          {/* Eyebrow */}
          <div className={styles.eyebrowRow}>
            <span className={styles.accentBar} aria-hidden="true" />
            <span className={styles.eyebrow}>Applications</span>
          </div>

          {/* Heading */}
          <h1 id="apps-hero-heading" className={styles.title}>
            Apps I Build
          </h1>

          {/* Short description */}
          <p className={styles.lead}>
            Functional software built to solve real problems — from mobile daily utilities
            to intelligent study platforms.
          </p>

          {/* Thin architectural rule */}
          <div className={styles.baseRule} aria-hidden="true" />

          {/* Status bar */}
          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>1 Live Showcase</span>
            </div>
            <div className={styles.statusSep} aria-hidden="true" />
            <div className={styles.statusItem}>
              <span className={styles.statusDotDev} aria-hidden="true" />
              <span className={styles.statusText}>2 In Development</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
