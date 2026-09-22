import { Container } from "@/components/ui/Container";
import styles from "./Introduction.module.css";

const FOCUS_AREAS = [
  {
    title: "Software Development",
    desc: "Robust full-stack architecture, clean codebases, and maintainable systems.",
  },
  {
    title: "AI / Machine Learning",
    desc: "Practical exploration and integration of intelligent algorithms to solve concrete problems.",
  },
  {
    title: "Digital Products",
    desc: "User-centered web and mobile tools built for performance, clarity, and everyday utility.",
  },
  {
    title: "Graphic Design",
    desc: "Visual identity, structured typography, and thoughtful creative direction.",
  },
];

export function Introduction() {
  return (
    <section className={styles.section} aria-labelledby="intro-heading">
      <Container className={styles.container}>
        <div className={styles.header}>
          <span className={styles.badge} id="intro-badge">
            Positioning &amp; Philosophy
          </span>
          <h2 id="intro-heading" className={styles.heading}>
            Technology should solve real problems and create practical impact.
          </h2>
          <p className={styles.statement}>
            Bridging technical engineering and visual craft, my work centers on developing reliable
            software, exploring applied artificial intelligence, and designing intuitive digital
            experiences that serve real human needs.
          </p>
        </div>

        <div className={styles.grid}>
          {FOCUS_AREAS.map((area) => (
            <div key={area.title} className={styles.card}>
              <div className={styles.cardIndicator} aria-hidden="true" />
              <h3 className={styles.cardTitle}>{area.title}</h3>
              <p className={styles.cardDesc}>{area.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
