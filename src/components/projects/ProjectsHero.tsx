import { Container } from "@/components/ui/Container";
import styles from "./ProjectsHero.module.css";

export function ProjectsHero() {
  return (
    <section className={styles.hero} aria-labelledby="projects-hero-heading">
      <Container>
        <div className={styles.layout}>
          {/* Left Column: Heading and Core Premise */}
          <div className={styles.leftCol}>
            <h1 id="projects-hero-heading" className={styles.title}>
              Projects
            </h1>
            <p className={styles.lead}>
              A collection of things I&apos;ve built, designed, or am still working on.
            </p>
          </div>

          {/* Right Column: Grounded Human Context */}
          <div className={styles.rightCol}>
            <p className={styles.contextNote}>
              Most projects here start from practical, everyday needs — whether that&apos;s
              tracking daily shop sales on a phone in Burundi or testing data ingestion
              pipelines in Python.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
