import { Container } from "@/components/ui/Container";
import { ContactInfo } from "./ContactInfo";
import { ContactComposer } from "./ContactComposer";
import styles from "./ContactSection.module.css";

export function ContactSection() {
  return (
    <section className={styles.section} aria-label="Contact information and form">
      <Container>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <ContactInfo />
          </div>
          <div className={styles.rightCol}>
            <ContactComposer />
          </div>
        </div>
      </Container>
    </section>
  );
}
