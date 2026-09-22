import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { designWorks } from "@/data/design";
import styles from "./DesignGallery.module.css";

export function DesignGallery() {
  // Group works by category
  const categories = [
    {
      title: "UI & Interface Design",
      key: "ui",
      description: "Mobile applications and digital system workflows designed for clarity, rapid entry, and data visibility.",
      items: designWorks.filter((w) => w.categoryKey === "ui" && !w.featured),
    },
    {
      title: "Editorial & Document Layout",
      key: "editorial",
      description: "Structured typographic business reports, tables, and printable digital documentation.",
      items: designWorks.filter((w) => w.categoryKey === "editorial"),
    },
    {
      title: "Branding & Visual Patterns",
      key: "branding",
      description: "Application icon marks, organic fluid compositions, and geometric pattern systems.",
      items: designWorks.filter((w) => w.categoryKey === "branding"),
    },
  ];

  return (
    <section className={styles.section} aria-labelledby="design-gallery-heading">
      <Container>
        <div className={styles.header}>
          <div className={styles.headerTag}>
            <span className={styles.sectionIndex}>02</span>
            <span className={styles.sectionTagline}>Curated Works</span>
          </div>
          <h2 id="design-gallery-heading" className={styles.heading}>
            Selected Design Portfolio
          </h2>
          <p className={styles.subheading}>
            Authentic interfaces, editorial publications, and visual brand assets crafted
            across mobile and desktop media.
          </p>
        </div>

        {/* Category Sections */}
        <div className={styles.categoriesStack}>
          {categories.map((cat) => (
            <div key={cat.key} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <h3 className={styles.categoryTitle}>{cat.title}</h3>
                <p className={styles.categoryDescription}>{cat.description}</p>
              </div>

              <div className={styles.cardsGrid}>
                {cat.items.map((item) => (
                  <article key={item.id} className={styles.card}>
                    {/* Visual Media Frame */}
                    <div className={styles.imageFrame}>
                      <Image
                        src={item.image}
                        alt={item.alt}
                        width={item.width}
                        height={item.height}
                        className={styles.cardImage}
                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 360px"
                      />
                    </div>

                    {/* Card Content */}
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardCategory}>{item.category}</span>
                        <div className={styles.tools}>
                          {item.tools.map((t) => (
                            <span key={t} className={styles.toolTag}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h4 className={styles.cardTitle}>{item.title}</h4>
                      <p className={styles.cardDescription}>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
