import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./AboutCTA.module.css";

export function AboutCTA() {
  return (
    <section className={styles.section} aria-labelledby="about-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Let&apos;s Connect</span>
            <h2 id="about-cta-heading" className={styles.heading}>
              Let&apos;s Build Something Useful.
            </h2>
            <p className={styles.description}>
              If you are curious about my projects, looking to discuss a
              technical idea, or simply want to connect — I&apos;m open to
              conversations about software, design, and practical technology.
            </p>
            <div className={styles.actions}>
              <Button
                href="/projects"
                variant="primary"
                size="lg"
                id="about-cta-projects"
              >
                Explore Projects
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                id="about-cta-contact"
                className={styles.contactBtn}
              >
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
