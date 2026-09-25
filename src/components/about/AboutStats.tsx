import { Container } from "@/components/ui/Container";
import styles from "./AboutStats.module.css";

const stats = [
  { value: "3+", label: "Projects Built" },
  { value: "14", label: "Technologies" },
  { value: "4+", label: "Years Learning" },
  { value: "3",  label: "Areas of Focus" },
];

export function AboutStats() {
  return (
    <section className={styles.section} aria-label="Key metrics">
      <Container>
        <dl className={styles.grid}>
          {stats.map((stat) => (
            <div key={stat.label} className={styles.item}>
              <dt className={styles.label}>{stat.label}</dt>
              <dd className={styles.value}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
