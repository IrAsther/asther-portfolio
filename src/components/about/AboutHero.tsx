import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./AboutHero.module.css";

export function AboutHero() {
  return (
    <section className={styles.hero} aria-labelledby="about-h1">
      <Container className={styles.inner}>
        {/* Text column */}
        <div className={styles.textCol}>
          <span className={styles.eyebrow} aria-hidden="true">
            About Asther
          </span>

          <h1 id="about-h1" className={styles.name}>
            Asther Irakaza
          </h1>

          <div className={styles.roleGroup} role="list" aria-label="Roles">
            <span className={styles.rolePrimary} role="listitem">
              Software Developer
            </span>
            <span className={styles.roleSeparator} aria-hidden="true">
              /
            </span>
            <span className={styles.roleSecondary} role="listitem">
              AI/ML Enthusiast
            </span>
            <span className={styles.roleSeparator} aria-hidden="true">
              /
            </span>
            <span className={styles.roleSecondary} role="listitem">
              Graphic Designer
            </span>
          </div>

          <p className={styles.intro}>
            I&apos;m a Computer Science student and aspiring software developer
            building practical digital solutions through software, artificial
            intelligence, and thoughtful design. My work lives at the
            intersection of engineering and visual communication.
          </p>

          <div className={styles.ctas}>
            <Button
              href="/projects"
              variant="primary"
              size="lg"
              id="about-hero-cta-projects"
            >
              Explore Projects
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              id="about-hero-cta-contact"
              className={styles.ctaOutline}
            >
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Portrait column */}
        <div className={styles.portraitCol}>
          <div className={styles.portraitStage}>
            <div className={styles.accentLine} aria-hidden="true" />
            <Image
              src="/hero-portrait-transparent.webp"
              alt="Asther Irakaza — Software Developer and Graphic Designer"
              width={516}
              height={484}
              priority
              className={styles.portraitFigure}
              sizes="(max-width: 479px) 200px, (max-width: 767px) 260px, (max-width: 1023px) 300px, 400px"
            />
          </div>
        </div>
      </Container>

      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
