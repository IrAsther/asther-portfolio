import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./ResumeCTA.module.css";

export function ResumeCTA() {
  return (
    <section className={styles.section} aria-labelledby="resume-cta-heading">
      <Container>
        <div className={styles.card}>
          <div className={styles.accentBorder} aria-hidden="true" />
          <div className={styles.content}>
            <span className={styles.badge}>Inquiries & Outreach</span>
            <h2 id="resume-cta-heading" className={styles.heading}>
              Interested in collaborating or discussing a role?
            </h2>
            <p className={styles.description}>
              Whether you have an inquiry regarding software development, an open opportunity,
              or an educational platform build, I am always open to discussing new technical challenges.
            </p>

            <div className={styles.documentNotice}>
              <span className={styles.noticeDot} aria-hidden="true" />
              <span className={styles.noticeText}>
                Formal PDF CV document is currently in preparation. Direct inquiries and project
                consultations are welcomed via the contact channel.
              </span>
            </div>

            <div className={styles.actions}>
              <Button href="/contact" variant="primary" size="lg" id="resume-cta-contact">
                Get in Touch / Contact
              </Button>
              <Button
                href="/apps"
                variant="outline"
                size="lg"
                id="resume-cta-apps"
                className={styles.secondaryBtn}
              >
                Explore Built Apps
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
