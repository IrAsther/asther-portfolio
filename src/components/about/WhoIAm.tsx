import { Container } from "@/components/ui/Container";
import styles from "./WhoIAm.module.css";

export function WhoIAm() {
  return (
    <section className={styles.section} aria-labelledby="who-i-am-heading">
      <Container size="narrow" className={styles.inner}>
        {/* Section label */}
        <span className={styles.sectionLabel} aria-hidden="true">
          01 — Who I Am
        </span>

        <h2 id="who-i-am-heading" className={styles.heading}>
          Who I Am
        </h2>

        {/* Thin accent rule under heading */}
        <div className={styles.accentRule} aria-hidden="true" />

        <div className={styles.body}>
          <p className={styles.paragraph}>
            I&apos;m a Computer Science student with a strong interest in
            software development, artificial intelligence, and the practical
            digital products that technology makes possible. My work spans
            full-stack web development, applied AI/ML exploration, and graphic
            design — disciplines I see as deeply connected rather than separate
            tracks.
          </p>
          <p className={styles.paragraph}>
            My approach to building software is shaped by a single question:
            what does this actually enable? Good engineering, in my view, starts
            with understanding the problem clearly before writing a single line
            of code. That same thinking carries into design — clarity and
            purpose first, aesthetics in service of communication.
          </p>
          <p className={styles.paragraph}>
            I work with technologies including Python, JavaScript, TypeScript,
            React, Next.js, and Django — and I am actively building experience
            with AI/ML methods and their integration into practical applications.
            My current technical focus includes both the engineering side of
            software and the product thinking that makes software worth building.
          </p>
          <p className={styles.paragraph}>
            Alongside software development, graphic design is a genuine part of
            how I create. Visual systems, typography, and interface thinking are
            not secondary to engineering — they are part of building digital
            products that communicate well and earn trust.
          </p>
        </div>
      </Container>
    </section>
  );
}
