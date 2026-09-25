import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import styles from "./DesignHero.module.css";

export function DesignHero() {
  return (
    <section className={styles.hero} aria-labelledby="design-hero-heading">
      <Container>
        <div className={styles.heroGrid}>
          {/* LEFT: Eyebrow, Main Heading, Short Lead, Quick Jump */}
          <div className={styles.heroLeft}>
            <div className={styles.eyebrowRow}>
              <span className={styles.accentBar} aria-hidden="true" />
              <span className={styles.eyebrow}>DESIGN</span>
            </div>

            <h1 id="design-hero-heading" className={styles.title}>
              Design that gives ideas a clear form.
            </h1>

            <p className={styles.lead}>
              I design visual systems, interfaces, and digital experiences with clarity and purpose.
            </p>

            <div className={styles.actionRow}>
              <a href="#selected-design" className={styles.jumpLink}>
                <span>Selected work</span>
                <svg
                  className={styles.jumpIcon}
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M8 3.333v9.334M12.667 8L8 12.667 3.333 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </a>

              <Link href="/contact" className={styles.contactLink}>
                Get in touch
              </Link>
            </div>
          </div>

          {/* RIGHT: Authentic Architectural Visual Composition */}
          <div className={styles.heroRight}>
            <div className={styles.compositionFrame}>
              {/* Technical Header Strip */}
              <div className={styles.frameHeader}>
                <div className={styles.frameTag}>
                  <span className={styles.statusDot} aria-hidden="true" />
                  <span className={styles.frameTagText}>INTERFACE // SCHOLARLY ASA</span>
                </div>
                <span className={styles.coordText}>FIG. 01 — DESKTOP</span>
              </div>

              {/* Main Visual Display */}
              <div className={styles.mainVisual}>
                <Image
                  src="/design/scholarly-asa-ui.jpg"
                  alt="Scholarly ASA desktop web application interface showing curated study prompts and conversation layout"
                  width={1600}
                  height={1426}
                  priority
                  className={styles.visualImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                />
              </div>

              {/* Architectural Technical Detail Foot */}
              <div className={styles.frameFoot}>
                <span className={styles.footMeta}>PROD // AI STUDY ASSISTANT</span>
                <span className={styles.footType}>EDITORIAL UI</span>
              </div>

              {/* Overlapping Secondary Asset: Dandaza Mobile Preview */}
              <div className={styles.floatingPreview} aria-hidden="true">
                <div className={styles.mobileFrame}>
                  <div className={styles.mobileHeader}>
                    <span className={styles.mobileDot} />
                    <span className={styles.mobileTitle}>DANDAZA+</span>
                  </div>
                  <div className={styles.mobileImageWrap}>
                    <Image
                      src="/design/dandaza-dashboard-ui.png"
                      alt=""
                      width={720}
                      height={1600}
                      className={styles.mobileImage}
                      sizes="180px"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
