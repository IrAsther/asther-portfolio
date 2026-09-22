import { Container } from "@/components/ui/Container";
import { designTools } from "@/data/design";
import styles from "./DesignTools.module.css";

export function DesignTools() {
  return (
    <section className={styles.section} aria-labelledby="design-tools-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>05</span>
            <span className={styles.sectionTagline}>Creative Stack</span>
          </div>
          <h2 id="design-tools-heading" className={styles.heading}>
            Design Tools & Environment
          </h2>
          <p className={styles.subheading}>
            Creative software and web design technologies used for pixel editing, layout formulation,
            and interface tokenization.
          </p>
        </div>

        <div className={styles.grid}>
          {designTools.map((tool) => (
            <div key={tool.name} className={styles.toolCard}>
              <div className={styles.toolHeader}>
                <span className={styles.toolCategory}>{tool.category}</span>
                <h3 className={styles.toolName}>{tool.name}</h3>
              </div>

              <div className={styles.toolBody}>
                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Primary Purpose</span>
                  <p className={styles.infoText}>{tool.purpose}</p>
                </div>

                <div className={styles.infoBlock}>
                  <span className={styles.infoLabel}>Application Context</span>
                  <p className={styles.infoText}>{tool.experienceContext}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
