import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroPortrait } from "./HeroPortrait";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-label="Introduction">
      {/* Drifting pattern — decorative, aria-hidden */}
      <div className={styles.heroPattern} aria-hidden="true" />

      <Container className={styles.inner}>
        {/* Text column */}
        <div className={styles.textCol}>
          <div className={styles.wordmarkRow}>
            <Image
              src="/Asther_logo.png"
              alt={`${siteConfig.name} Logo`}
              width={160}
              height={160}
              priority
              className={styles.heroLogo}
            />
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

          <div className={styles.scrollHint} aria-hidden="true">
            <span className={styles.scrollLine} />
            <span className={styles.scrollLabel}>Scroll to explore</span>
          </div>
        </div>

        {/* Portrait column — premium framed portrait with parallax & depth */}
        <div className={styles.portraitCol}>
          <HeroPortrait />
        </div>
      </Container>

      {/* Decorative bottom fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
