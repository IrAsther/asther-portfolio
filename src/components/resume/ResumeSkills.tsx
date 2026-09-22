import { Container } from "@/components/ui/Container";
import { resumeSkillGroups } from "@/data/resume";
import styles from "./ResumeSkills.module.css";

export function ResumeSkills() {
  return (
    <section className={styles.section} aria-labelledby="resume-skills-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>02</span>
            <span className={styles.sectionTagline}>Competencies</span>
          </div>
          <h2 id="resume-skills-heading" className={styles.heading}>
            Technical Skills & Creative Tools
          </h2>
          <p className={styles.subheading}>
            Practical technologies, frameworks, and creative software applied across
            software development, academic study, and interface design.
          </p>
        </div>

        <div className={styles.grid}>
          {resumeSkillGroups.map((group) => (
            <div key={group.category} className={styles.groupCard}>
              <h3 className={styles.groupTitle}>{group.category}</h3>
              <div className={styles.skillsList} aria-label={`${group.category} skills`}>
                {group.skills.map((skill) => (
                  <span key={skill} className={styles.skillPill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Graphic Design Integration Note */}
        <div className={styles.designNoteCard}>
          <div className={styles.noteIndicator} aria-hidden="true" />
          <div className={styles.noteContent}>
            <h4 className={styles.noteTitle}>Design & Engineering Intersection</h4>
            <p className={styles.noteText}>
              Graphic design tools (Photoshop, Canva) are applied alongside frontend code to
              craft clean visual hierarchy, coherent typographic systems, and intuitive user
              interfaces—ensuring applications communicate effectively as complete products.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
