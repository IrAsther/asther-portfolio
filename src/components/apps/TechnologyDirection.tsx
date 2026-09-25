import { Container } from "@/components/ui/Container";
import { applicationTechGroups } from "@/data/apps";
import styles from "./TechnologyDirection.module.css";

export function TechnologyDirection() {
  return (
    <section className={styles.section} aria-labelledby="tech-direction-heading">
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>04</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="tech-direction-heading" className={styles.sectionLabel}>
              Stack
            </h2>
          </div>
          <span className={styles.metaLabel}>TECHNOLOGY</span>
        </div>

        {/* Clean table-style tech groups */}
        <div className={styles.groupList}>
          {applicationTechGroups.map((group) => (
            <div key={group.name} className={styles.groupRow}>
              <div className={styles.groupNameCol}>
                <h3 className={styles.groupName}>{group.name}</h3>
              </div>
              <div className={styles.techCol}>
                <div className={styles.techList} aria-label={`${group.name} technologies`}>
                  {group.technologies.map((tech, i) => (
                    <span key={tech} className={styles.techItem}>
                      {tech}
                      {i < group.technologies.length - 1 && (
                        <span className={styles.techSep} aria-hidden="true"> · </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
