import { Container } from "@/components/ui/Container";
import styles from "./AboutIntro.module.css";

export function AboutIntro() {
  return (
    <section className={styles.section} aria-labelledby="about-intro-heading">
      <Container size="narrow" className={styles.inner}>
        <span className={styles.label} aria-hidden="true">About</span>

        <h2 id="about-intro-heading" className={styles.heading}>
          Who I Am
        </h2>
        <div className={styles.rule} aria-hidden="true" />

        <div className={styles.body}>
          <p className={styles.paragraph}>
            I&apos;m a Computer Science student building practical software —
            full-stack web applications, AI-integrated tools, and digital
            products that solve real problems.
          </p>
          <p className={styles.paragraph}>
            I combine engineering with visual thinking. Code and design are two
            sides of the same craft, and I pursue both deliberately.
          </p>
        </div>
      </Container>
    </section>
  );
}
