import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./DesignCTA.module.css";

export function DesignCTA() {
  return (
    <section className={styles.section} aria-labelledby="design-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Collaboration</span>
            <h2 id="design-cta-heading" className={styles.heading}>
              Let&apos;s Build Something Visual
            </h2>
            <p className={styles.description}>
              Whether you are planning a digital application interface, a brand identity system,
              structured publication layouts, or a complete software product that requires
              intentional visual communication, let&apos;s talk.
            </p>
            <div className={styles.actions}>
              <Button href="/contact" variant="primary" size="lg" id="design-cta-contact">
                Start a Conversation
              </Button>
              <Button
                href="/projects"
                variant="outline"
                size="lg"
                id="design-cta-projects"
                className={styles.projectsBtn}
              >
                View System Projects
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
