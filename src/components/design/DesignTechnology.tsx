import { Container } from "@/components/ui/Container";
import styles from "./DesignTechnology.module.css";

export function DesignTechnology() {
  const intersections = [
    {
      title: "Design Tokens & System Architecture",
      summary: "Translating color, typography, and spacing into code",
      description:
        "Graphic design decisions are codified directly into CSS custom properties, ensuring that visual intent remains consistent and maintainable across all application components.",
    },
    {
      title: "Interface Ergonomics & Usability",
      summary: "Balancing density with intuitive touch targets",
      description:
        "Applying visual weight, negative space, and typographic contrast so users can navigate complex data workflows without cognitive fatigue.",
    },
    {
      title: "Document & Information Design",
      summary: "Structuring business data for immediate clarity",
      description:
        "Designing printable receipts, analytical reports, and data tables that present critical numbers clearly to business operators and students.",
    },
    {
      title: "Creative Problem Solving",
      summary: "Bridging aesthetics and engineering constraints",
      description:
        "Understanding browser rendering, responsive viewports, and performance limitations allows design concepts to be realized smoothly in production.",
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="design-tech-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>04</span>
            <span className={styles.sectionTagline}>Symbiosis</span>
          </div>
          <h2 id="design-tech-heading" className={styles.heading}>
            Where Design Meets Technology
          </h2>
          <p className={styles.subheading}>
            Software engineering and graphic design are complementary disciplines. The combination
            produces digital tools that look intentional and perform reliably.
          </p>
        </div>

        <div className={styles.grid}>
          {intersections.map((item) => (
            <div key={item.title} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.accentBar} aria-hidden="true" />
                <h3 className={styles.cardTitle}>{item.title}</h3>
              </div>
              <span className={styles.summary}>{item.summary}</span>
              <p className={styles.description}>{item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
