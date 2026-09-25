import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./ProjectsCTA.module.css";

export function ProjectsCTA() {
  return (
    <section className={styles.section} aria-labelledby="projects-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.content}>
            <h2 id="projects-cta-heading" className={styles.heading}>
              Let&apos;s talk about building something.
            </h2>
            <p className={styles.description}>
              Whether you have a practical problem that needs software, or you just want to talk
              about data pipelines and frontend architecture, I&apos;m always open to a
              conversation.
            </p>
            <div className={styles.actions}>
              <Button
                href="/contact"
                variant="primary"
                size="lg"
                id="projects-cta-contact"
                className={styles.ctaBtn}
              >
                Get in touch
              </Button>
              <Button
                href="/about"
                variant="outline"
                size="lg"
                id="projects-cta-about"
                className={styles.aboutBtn}
              >
                More about me
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
