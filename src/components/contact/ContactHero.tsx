import { Container } from "@/components/ui/Container";
import styles from "./ContactHero.module.css";

export function ContactHero() {
  return (
    <section className={styles.hero} aria-labelledby="contact-hero-heading">
      <Container>
        <div className={styles.inner}>
          <span className={styles.eyebrow}>Contact</span>
          <h1 id="contact-hero-heading" className={styles.title}>
            Let&apos;s Build Something Useful.
          </h1>
          <p className={styles.lead}>
            Have an idea, project, or opportunity? Let&apos;s talk.
          </p>
        </div>
      </Container>
    </section>
  );
}
