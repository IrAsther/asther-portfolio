import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./DesignCTA.module.css";

export function DesignCTA() {
  return (
    <section className={styles.section} aria-labelledby="design-cta-heading">
      <Container>
        <div className={styles.ctaBox}>
          <div className={styles.accentCorner} aria-hidden="true" />

          <div className={styles.content}>
            <span className={styles.eyebrow}>NEXT STEP</span>
            <h2 id="design-cta-heading" className={styles.heading}>
              Have a project in mind?
            </h2>
            <p className={styles.subheading}>
              View my work or get in touch.
            </p>

            <div className={styles.actions}>
              <Link href="/contact" className={styles.primaryBtn} id="design-cta-contact">
                Get in touch
              </Link>
              <Link href="/projects" className={styles.secondaryBtn} id="design-cta-projects">
                View engineering work
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
