"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { DesignDTO } from "@/lib/data/designs";
import styles from "./DesignWorks.module.css";

interface VisualWork {
  id: string;
  slug?: string;
  name: string;
  category: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  tools?: string[];
  externalUrl?: string | null;
  large?: boolean;
}

const staticWorks: VisualWork[] = [
  {
    id: "scholarly-asa",
    slug: "scholarly-asa",
    name: "Scholarly ASA",
    category: "UI Design",
    image: "/design/scholarly-asa-ui.jpg",
    width: 1600,
    height: 1100,
    alt: "Scholarly ASA research platform editorial interface",
    large: true,
  },
  {
    id: "dandaza-dashboard",
    slug: "dandaza-dashboard",
    name: "Dandaza+ Dashboard",
    category: "UI Design",
    image: "/design/dandaza-dashboard-ui.png",
    width: 1600,
    height: 1200,
    alt: "Dandaza+ business intelligence financial metrics dashboard",
  },
  {
    id: "dandaza-report",
    slug: "dandaza-report",
    name: "Dandaza+ Business Report",
    category: "Editorial Layout",
    image: "/design/ui-preview-2.png",
    width: 1200,
    height: 1600,
    alt: "Dandaza+ business performance summary report cover layout",
  },
  {
    id: "geometric-pattern",
    slug: "geometric-pattern",
    name: "Geometric Arc Study",
    category: "Visual Systems",
    image: "/design/pattern-2.jpg",
    width: 1600,
    height: 1200,
    alt: "Geometric arc study modular pattern system",
  },
  {
    id: "dandaza-brand",
    slug: "dandaza-brand",
    name: "Dandaza+ Mark",
    category: "Brand Identity",
    image: "/design/dandaza-logo.png",
    width: 1600,
    height: 1600,
    alt: "Dandaza+ brand identity mark and mobile app icon",
  },
];

interface DesignWorksProps {
  designs?: DesignDTO[];
}

export function DesignWorks({ designs }: DesignWorksProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Map database designs if available.
  // When designs is passed, use it. If designs is empty array, it represents 0 published designs in Supabase.
  // Only fall back to staticWorks if designs prop is undefined (e.g. standalone preview mode).
  const allWorks: VisualWork[] = useMemo(() => {
    if (designs !== undefined) {
      return designs.map((d) => ({
        id: d.id,
        slug: d.slug,
        name: d.title,
        category: d.category,
        image: d.coverImage || "/design/scholarly-asa-ui.jpg",
        width: 1600,
        height: 1200,
        alt: `${d.title} design showcase`,
        tools: d.tools,
        externalUrl: d.externalUrl,
        large: d.featured,
      }));
    }
    return staticWorks;
  }, [designs]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allWorks.map((w) => w.category).filter(Boolean)));
    return ["All", ...cats];
  }, [allWorks]);

  // Filter works by category and search query
  const filteredWorks = useMemo(() => {
    return allWorks.filter((work) => {
      const matchesCategory =
        selectedCategory === "All" || work.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        work.name.toLowerCase().includes(q) ||
        work.category.toLowerCase().includes(q) ||
        (work.tools && work.tools.some((t) => t.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [allWorks, selectedCategory, searchQuery]);

  // Prioritize featured/large item for primary anchor, else first item
  const primaryWork = filteredWorks.find((w) => w.large) || filteredWorks[0];
  const supportingWorks = filteredWorks.filter((w) => w.id !== primaryWork?.id);

  return (
    <section
      id="selected-design"
      className={styles.section}
      aria-labelledby="selected-design-heading"
    >
      <Container>
        {/* Section Header Strip */}
        <div className={styles.sectionHeader}>
          <div className={styles.labelGroup}>
            <span className={styles.indexNumber}>01</span>
            <div className={styles.verticalDivider} aria-hidden="true" />
            <h2 id="selected-design-heading" className={styles.sectionLabel}>
              Selected design
            </h2>
          </div>
          <span className={styles.metaCount}>
            {filteredWorks.length} WORK{filteredWorks.length !== 1 ? "S" : ""}
          </span>
        </div>

        {/* Filter & Search Bar */}
        {allWorks.length > 0 && (
          <div className={styles.controlsRow}>
            <div className={styles.categoryFilters} role="tablist" aria-label="Design categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`${styles.categoryBtn} ${
                    selectedCategory === cat ? styles.categoryBtnActive : ""
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className={styles.searchWrap}>
              <Search size={14} style={{ color: "var(--color-text-subtle)", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
                aria-label="Search published designs"
              />
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredWorks.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>
              {allWorks.length === 0 ? "Design Showcase Coming Soon" : "No matching designs"}
            </h3>
            <p className={styles.emptyDesc}>
              {allWorks.length === 0
                ? "New graphic design, brand identity, and UI/UX projects are currently being curated. Please check back shortly."
                : `No design projects found matching "${searchQuery}" in ${selectedCategory}. Try resetting your search or filter.`}
            </p>
            {allWorks.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className={styles.categoryBtn}
                style={{ marginTop: "0.5rem" }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Editorial Asymmetric Grid */
          <div className={styles.grid}>
            {/* Primary Featured Visual — Full Width Anchor */}
            {primaryWork && (
              <article className={styles.primaryItem}>
                <Link
                  href={primaryWork.slug ? `/design/${primaryWork.slug}` : "/design"}
                  className={styles.workLink}
                >
                  <div className={styles.imageContainerPrimary}>
                    <Image
                      src={primaryWork.image}
                      alt={primaryWork.alt}
                      width={primaryWork.width}
                      height={primaryWork.height}
                      className={styles.workImage}
                      sizes="(max-width: 1200px) 100vw, 1140px"
                      unoptimized={primaryWork.image.startsWith("http")}
                    />
                  </div>
                  <div className={styles.captionRow}>
                    <h3 className={styles.workName}>{primaryWork.name}</h3>
                    <span className={styles.workCategory}>{primaryWork.category}</span>
                  </div>
                </Link>
              </article>
            )}

            {/* Thin Architectural Separator */}
            {supportingWorks.length > 0 && (
              <div className={styles.gridSeparator} aria-hidden="true" />
            )}

            {/* Supporting Visuals — 4-Column Editorial Rhythm */}
            {supportingWorks.length > 0 && (
              <div className={styles.supportingGrid}>
                {supportingWorks.map((work) => (
                  <article key={work.id} className={styles.supportingItem}>
                    <Link
                      href={work.slug ? `/design/${work.slug}` : "/design"}
                      className={styles.workLink}
                    >
                      <div className={styles.imageContainerSupporting}>
                        <Image
                          src={work.image}
                          alt={work.alt}
                          width={work.width}
                          height={work.height}
                          className={styles.workImage}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
                          unoptimized={work.image.startsWith("http")}
                        />
                      </div>
                      <div className={styles.captionRow}>
                        <h3 className={styles.workNameSmall}>{work.name}</h3>
                        <span className={styles.workCategory}>{work.category}</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}