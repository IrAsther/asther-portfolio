import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Download } from "lucide-react";
import styles from "./ResumeCTA.module.css";

interface ResumeCTAProps {
  resumeUrl?: string;
  isPublished?: boolean;
}

export function ResumeCTA({ resumeUrl, isPublished }: ResumeCTAProps) {
  const hasPublishedResume = Boolean(resumeUrl && isPublished);

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

            {hasPublishedResume ? (
              <div className={styles.documentNotice} style={{ borderColor: "#01605A" }}>
                <span className={styles.noticeDot} style={{ backgroundColor: "#01605A" }} aria-hidden="true" />
                <span className={styles.noticeText}>
                  Verified PDF Curriculum Vitae is available for direct download.
                </span>
              </div>
            ) : (
              <div className={styles.documentNotice}>
                <span className={styles.noticeDot} aria-hidden="true" />
                <span className={styles.noticeText}>
                  Formal PDF CV document is currently in preparation. Direct inquiries and project
                  consultations are welcomed via the contact channel.
                </span>
              </div>
            )}

            <div className={styles.actions}>
              {hasPublishedResume && (
                <Button
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="lg"
                  id="resume-cta-download"
                >
                  <Download size={18} style={{ marginRight: 6 }} aria-hidden="true" />
                  Download Resume (PDF)
                </Button>
              )}
              <Button
                href="/contact"
                variant={hasPublishedResume ? "outline" : "primary"}
                size="lg"
                id="resume-cta-contact"
                className={hasPublishedResume ? styles.secondaryBtn : undefined}
              >
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
