import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./FinalCTA.module.css";

export function FinalCTA() {
  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Next Steps</span>
            <h2 id="cta-heading" className={styles.heading}>
              Ready to collaborate or explore further?
            </h2>
            <p className={styles.description}>
              Whether you are interested in exploring completed software projects, reviewing technical
              architecture, or discussing an engineering opportunity, let&apos;s connect.
            </p>
            <div className={styles.actions}>
              <Button href="/projects" variant="primary" size="lg" id="final-cta-projects">
                Explore Projects
              </Button>
              <Button
                href="/contact"
                variant="outline"
                size="lg"
                id="final-cta-contact"
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
