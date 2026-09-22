import Link from "next/link";
import { ArrowUpRight, Mail, Globe, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { resumeProfile } from "@/data/resume";
import styles from "./ResumeHero.module.css";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export function ResumeHero() {
  return (
    <section className={styles.hero} aria-labelledby="resume-hero-heading">
      <Container>
        <div className={styles.inner}>
          {/* Eyebrow & Badge */}
          <div className={styles.eyebrowRow}>
            <span className={styles.badge}>Resume / Profile</span>
            <span className={styles.badgeMeta}>Curriculum Vitae</span>
          </div>

          {/* Main Title & Role */}
          <div className={styles.titleGroup}>
            <h1 id="resume-hero-heading" className={styles.name}>
              {resumeProfile.name}
            </h1>
            <div className={styles.roleLine}>
              <span className={styles.primaryRole}>{resumeProfile.role}</span>
              <span className={styles.subtitles}>
                {resumeProfile.subtitles.join(" · ")}
              </span>
            </div>
          </div>

          {/* Professional Positioning Statement */}
          <div className={styles.positioningCard}>
            <span className={styles.positioningLabel}>Professional Positioning</span>
            <p className={styles.positioningText}>{resumeProfile.positioning}</p>
          </div>

          {/* Quick Contact & Verification Pills */}
          <div className={styles.contactBar} aria-label="Professional contact and presence">
            <Link
              href={resumeProfile.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactPill}
              aria-label="GitHub Profile (opens in new tab)"
            >
              <GithubIcon size={16} />
              <span>GitHub / IrAsther</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>

            <Link
              href={resumeProfile.contact.contactRoute}
              className={styles.contactPill}
              aria-label="Contact Asther Irakaza"
            >
              <Mail size={16} aria-hidden="true" />
              <span>Get in Touch / Contact</span>
            </Link>

            <Link
              href={resumeProfile.contact.portfolioRoute}
              className={styles.contactPill}
              aria-label="Portfolio Home"
            >
              <Globe size={16} aria-hidden="true" />
              <span>Digital Portfolio</span>
            </Link>

            <div className={styles.affiliationPill}>
              <GraduationCap size={16} aria-hidden="true" />
              <span>{resumeProfile.contact.educationAffiliation}</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
