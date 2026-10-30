import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getDesignBySlug } from "@/lib/data/designs";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DesignDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DesignDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);

  if (!design) {
    return {
      title: "Design Not Found — Asther Irakaza",
    };
  }

  return {
    title: `${design.title} — Design Showcase by Asther Irakaza`,
    description: design.description || `Design project ${design.title} in ${design.category}.`,
  };
}

export default async function DesignDetailPage({ params }: DesignDetailPageProps) {
  const { slug } = await params;
  const design = await getDesignBySlug(slug);

  if (!design) {
    notFound();
  }

  return (
    <div className={styles.pageWrapper}>
      <Container>
        {/* Back Link */}
        <div className={styles.backRow}>
          <Link href="/design" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Selected Design</span>
          </Link>
        </div>

        {/* Hero Section */}
        <header className={styles.header}>
          <div className={styles.categoryBadge}>{design.category}</div>
          <h1 className={styles.title}>{design.title}</h1>

          {design.description && (
            <p className={styles.lead}>{design.description}</p>
          )}

          {/* Meta bar */}
          <div className={styles.metaBar}>
            {design.projectDate && (
              <div className={styles.metaItem}>
                <Calendar size={14} className={styles.metaIcon} />
                <span>{design.projectDate}</span>
              </div>
            )}

            {design.tools && design.tools.length > 0 && (
              <div className={styles.metaItem}>
                <Wrench size={14} className={styles.metaIcon} />
                <span>{design.tools.join("  ·  ")}</span>
              </div>
            )}

            {design.externalUrl && (
              <a
                href={design.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.externalLink}
              >
                <span>Live Project / Figma</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </header>

        {/* Main Cover Display */}
        {design.coverImage && (
          <div className={styles.coverFrame}>
            <Image
              src={design.coverImage}
              alt={`${design.title} cover presentation`}
              width={1600}
              height={1000}
              priority
              className={styles.coverImage}
              unoptimized={design.coverImage.startsWith("http")}
            />
          </div>
        )}

        {/* Gallery Grid */}
        {design.gallery && design.gallery.length > 0 && (
          <section className={styles.gallerySection} aria-label="Project Gallery">
            <h2 className={styles.galleryHeading}>Gallery Artifacts</h2>
            <div className={styles.galleryGrid}>
              {design.gallery.map((item, idx) => (
                <figure key={idx} className={styles.galleryItem}>
                  <Image
                    src={item.url}
                    alt={item.alt || `${design.title} artifact ${idx + 1}`}
                    width={1200}
                    height={800}
                    className={styles.galleryImage}
                    unoptimized={item.url.startsWith("http")}
                  />
                  {item.caption && (
                    <figcaption className={styles.galleryCaption}>
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation CTA */}
        <div className={styles.detailFooter}>
          <Button href="/design" variant="outline" size="md">
            View All Designs
          </Button>
          <Button href="/contact" variant="primary" size="md">
            Discuss a Design Project
          </Button>
        </div>
      </Container>
    </div>
  );
}

