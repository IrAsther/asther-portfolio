import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      <Container className={styles.inner}>
        {/* Text column */}
        <div className={styles.textCol}>
          <div className={styles.wordmarkRow}>
            <BrandWordmark size="hero" as="div" />
          </div>

          <h1 className={styles.name}>Asther Irakaza</h1>

          <div className={styles.roleGroup}>
            <p className={styles.tagline}>Software Developer</p>
            <p className={styles.roles}>AI/ML Enthusiast • Graphic Designer</p>
          </div>

          <p className={styles.bio}>
            Building practical digital products, intelligent systems, and software solutions
            focused on solving real-world challenges through clean engineering and thoughtful design.
          </p>

          <div className={styles.ctas}>
            <Button
              href="/projects"
              variant="primary"
              size="lg"
              id="hero-cta-projects"
            >
              View Projects
            </Button>
            <Button
              href="/contact"
              variant="outline"
              size="lg"
              id="hero-cta-contact"
              className={styles.ctaOutline}
            >
              Contact Me
            </Button>
          </div>
        </div>

        {/* Portrait column — transparent cut-out standing naturally in composition */}
        <div className={styles.portraitCol}>
          <div className={styles.portraitStage}>
            {/* Subtle architectural vertical line accent — controlled brand marker */}
            <div className={styles.accentLine} aria-hidden="true" />

            <Image
              src="/hero-portrait-transparent.webp"
              alt="Asther Irakaza — Software Developer"
              width={516}
              height={484}
              priority
              className={styles.portraitFigure}
              sizes="(max-width: 479px) 240px, (max-width: 767px) 290px, (max-width: 1023px) 340px, 440px"
            />
          </div>
        </div>
      </Container>

      {/* Decorative bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
