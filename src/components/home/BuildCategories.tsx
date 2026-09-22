import { Globe, Cpu, BookOpen, Terminal, Palette } from "lucide-react";
import { Container } from "@/components/ui/Container";
import styles from "./BuildCategories.module.css";

const CATEGORIES = [
  {
    id: "web-apps",
    icon: Globe,
    title: "Web Applications",
    description:
      "Modern, responsive web platforms built with robust frontend architecture, clean component hierarchy, and strong focus on performance and usability.",
  },
  {
    id: "ai-apps",
    icon: Cpu,
    title: "AI-Powered Applications",
    description:
      "Applied machine learning integrations, intelligent workflow automation, and data-driven systems addressing specific real-world tasks.",
  },
  {
    id: "edtech",
    icon: BookOpen,
    title: "Educational Technology",
    description:
      "Interactive learning interfaces, structured educational portals, and accessible digital tooling created to make knowledge transfer clear and engaging.",
  },
  {
    id: "tools",
    icon: Terminal,
    title: "Digital Tools & Utilities",
    description:
      "Purpose-built software utilities, administrative dashboards, and developer workflows engineered to remove friction and automate manual steps.",
  },
  {
    id: "creative",
    icon: Palette,
    title: "Creative Digital Experiences",
    description:
      "Intersection of graphic design, typographic identity, and responsive interaction, delivering digital presentations with high visual craft.",
  },
];

export function BuildCategories() {
  return (
    <section className={styles.section} aria-labelledby="build-heading">
      <Container>
        <div className={styles.header}>
          <span className={styles.badge}>Capabilities</span>
          <h2 id="build-heading" className={styles.heading}>
            What I Build
          </h2>
          <p className={styles.subheading}>
            Core technical domains and software categories where I focus my development and design work.
          </p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon;
            return (
              <article key={category.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <div className={styles.iconWrapper} aria-hidden="true">
                    <Icon size={22} className={styles.icon} />
                  </div>
                  <span className={styles.indexNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <p className={styles.cardDescription}>{category.description}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
