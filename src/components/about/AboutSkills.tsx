import { Container } from "@/components/ui/Container";
import type { ResumeSkillGroup } from "@/data/resume";
import styles from "./AboutSkills.module.css";

const fallbackSkills = [
  "Python", "C", "JavaScript", "TypeScript",
  "React", "Next.js", "Vue", "Django",
  "HTML", "CSS", "Supabase", "PostgreSQL",
  "AI / ML", "Arduino",
];

interface AboutSkillsProps {
  skillGroups?: ResumeSkillGroup[];
}

export function AboutSkills({ skillGroups }: AboutSkillsProps) {
  const displaySkills =
    skillGroups && skillGroups.length > 0
      ? Array.from(new Set(skillGroups.flatMap((g) => g.skills)))
      : fallbackSkills;

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
          {displaySkills.map((skill) => (
            <li key={skill} className={styles.card}>
              {skill}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
