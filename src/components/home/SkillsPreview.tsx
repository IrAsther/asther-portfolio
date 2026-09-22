import Link from "next/link";
import { ArrowRight, Code2, Layers, Cpu, Database } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import styles from "./SkillsPreview.module.css";

const SKILL_CLUSTERS = [
  {
    title: "Core Languages",
    icon: Code2,
    skills: ["Python", "C", "TypeScript", "JavaScript", "HTML", "CSS"],
  },
  {
    title: "Web Frameworks",
    icon: Layers,
    skills: ["Next.js", "React", "Vue"],
  },
  {
    title: "Backend & Data",
    icon: Database,
    skills: ["Django", "Supabase"],
  },
  {
    title: "Applied Systems",
    icon: Cpu,
    skills: ["AI / ML", "Arduino"],
  },
];

export function SkillsPreview() {
  return (
    <section className={styles.section} aria-labelledby="skills-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.badge}>Technical Stack</span>
            <h2 id="skills-heading" className={styles.heading}>
              Technologies &amp; Tools
            </h2>
            <p className={styles.subheading}>
              Languages, frameworks, and environments utilized across active development and applied projects.
            </p>
          </div>
          <div className={styles.headerRight}>
            <Button href="/about" variant="outline" size="md">
              Learn More About My Background
            </Button>
          </div>
        </div>

        <div className={styles.grid}>
          {SKILL_CLUSTERS.map((cluster) => {
            const Icon = cluster.icon;
            return (
              <div key={cluster.title} className={styles.clusterCard}>
                <div className={styles.clusterHeader}>
                  <div className={styles.clusterIconWrapper} aria-hidden="true">
                    <Icon size={18} />
                  </div>
                  <h3 className={styles.clusterTitle}>{cluster.title}</h3>
                </div>
                <ul className={styles.skillList}>
                  {cluster.skills.map((skill) => (
                    <li key={skill} className={styles.skillItem}>
                      <span className={styles.skillDot} aria-hidden="true" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={styles.footerNote}>
          <p className={styles.noteText}>
            Continuous learning and grounded application over buzzwords.
          </p>
          <Link href="/projects" className={styles.contextLink}>
            <span>See how these are applied in projects</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
