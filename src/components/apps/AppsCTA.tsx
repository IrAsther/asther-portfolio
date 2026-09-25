import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./AppsCTA.module.css";

export function AppsCTA() {
  return (
    <section className={styles.section} aria-labelledby="apps-cta-heading">
      <Container>
        <div className={styles.ctaBox}>
          <div className={styles.accentCorner} aria-hidden="true" />

          <div className={styles.content}>
            <h2 id="apps-cta-heading" className={styles.heading}>
              Have something worth building?
            </h2>
            <p className={styles.subheading}>
              Let&apos;s talk through the architecture and requirements.
            </p>

            <div className={styles.actions}>
              <Link href="/contact" className={styles.primaryBtn} id="apps-cta-contact">
                Let&apos;s talk
              </Link>
              <Link href="/projects" className={styles.secondaryBtn} id="apps-cta-projects">
                View engineering work
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
