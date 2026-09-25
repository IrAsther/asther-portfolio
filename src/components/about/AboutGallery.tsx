import Image from "next/image";
import { Container } from "@/components/ui/Container";
import styles from "./AboutGallery.module.css";

const images = [
  {
    src: "/design/ui-preview-1.png",
    alt: "UI design exploration",
  },
  {
    src: "/design/ui-preview-2.png",
    alt: "Visual design and branding",
  },
  {
    src: "/design/dandaza-dashboard-ui.png",
    alt: "Dandaza dashboard interface",
  },
  {
    src: "/design/dandaza-settings-ui.png",
    alt: "Application settings design",
  },
];

export function AboutGallery() {
  return (
    <section className={styles.section} aria-labelledby="gallery-heading">
      <Container className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.label} aria-hidden="true">Design Work</span>
          <h2 id="gallery-heading" className={styles.heading}>
            Visual Output
          </h2>
        </div>

        <div className={styles.grid} role="list" aria-label="Design work samples">
          {images.map((img) => (
            <div key={img.src} className={styles.cell} role="listitem">
              <div className={styles.imageWrapper}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className={styles.image}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
