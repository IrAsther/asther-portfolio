import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./DesignStory.module.css";

export function DesignStory() {
  return (
    <section className={styles.section} aria-labelledby="design-story-heading">
      <Container className={styles.inner}>
        {/* Left: text content */}
        <div className={styles.textCol}>
          <span className={styles.sectionLabel} aria-hidden="true">
            05 — Design & Creative
          </span>
          <h2 id="design-story-heading" className={styles.heading}>
            Design Is Part of How I Build
          </h2>
          <div className={styles.accentRule} aria-hidden="true" />

          <p className={styles.paragraph}>
            Software development and graphic design are not two separate
            disciplines for me — they are two ways of solving the same problem:
            how do you communicate something clearly, reliably, and well?
          </p>
          <p className={styles.paragraph}>
            Visual systems, typography, layout, and branding influence how
            people interact with digital products before a single interaction
            happens. I bring that awareness into the software I build, and it
            shapes the decisions I make in both design and engineering.
          </p>
          <p className={styles.paragraph}>
            My design work includes visual identity systems, interface
            exploration, typographic composition, and digital branding — applied
            across personal and academic projects.
          </p>
        </div>

        {/* Right: authentic design visuals */}
        <div className={styles.visualCol} aria-hidden="true">
          {/* Primary image */}
          <div className={styles.imageMain}>
            <Image
              src="/design/ui-preview-1.png"
              alt="Interface design exploration — digital product UI"
              width={600}
              height={400}
              className={styles.imgFigure}
              sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 480px"
              loading="lazy"
            />
          </div>
          {/* Secondary image — offset */}
          <div className={styles.imageSecondary}>
            <Image
              src="/design/ui-preview-2.png"
              alt="Visual design work — branding and typography"
              width={600}
              height={400}
              className={styles.imgFigure}
              sizes="(max-width: 767px) 80vw, (max-width: 1023px) 40vw, 340px"
              loading="lazy"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
