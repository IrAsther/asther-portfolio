import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./AppsCTA.module.css";

export function AppsCTA() {
  return (
    <section className={styles.section} aria-labelledby="apps-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Collaboration</span>
            <h2 id="apps-cta-heading" className={styles.heading}>
              Have an idea worth building?
            </h2>
            <p className={styles.description}>
              Whether you are planning an educational platform, an accessible digital utility,
              or an intelligent assistant, let&apos;s discuss the architecture, engineering,
              and product requirements together.
            </p>
            <div className={styles.actions}>
              <Button href="/contact" variant="primary" size="lg" id="apps-cta-contact">
                Start a Conversation
              </Button>
              <Button
                href="/projects"
                variant="outline"
                size="lg"
                id="apps-cta-projects"
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
