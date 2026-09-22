import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./ProjectsCTA.module.css";

export function ProjectsCTA() {
  return (
    <section className={styles.section} aria-labelledby="projects-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Next Steps</span>
            <h2 id="projects-cta-heading" className={styles.heading}>
              Have a problem or project to build?
            </h2>
            <p className={styles.description}>
              Whether you are interested in discussing software utility architecture, exploring
              applied AI/ML workflows, or reviewing code and interface design, let&apos;s connect.
            </p>
            <div className={styles.actions}>
              <Button href="/contact" variant="primary" size="lg" id="projects-cta-contact">
                Start a Conversation
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                id="projects-cta-about"
                className={styles.aboutBtn}
              >
                About My Background
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
