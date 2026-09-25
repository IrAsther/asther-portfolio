import { Container } from "@/components/ui/Container";
import styles from "./AboutSkills.module.css";

const skills = [
  "Python", "C", "JavaScript", "TypeScript",
  "React", "Next.js", "Vue", "Django",
  "HTML", "CSS", "Supabase", "PostgreSQL",
  "AI / ML", "Arduino",
];

export function AboutSkills() {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <Container className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label} aria-hidden="true">Stack</span>
          <h2 id="skills-heading" className={styles.heading}>
            Technologies
          </h2>
        </div>

        <ul className={styles.grid} aria-label="Technologies and skills">
          {skills.map((skill) => (
            <li key={skill} className={styles.card}>
              {skill}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
