"use client";

import { useState, useMemo } from "react";
import { Search, X, FolderX } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { FeaturedApp } from "./FeaturedApp";
import { AppCard } from "./AppCard";
import type { AppItem } from "@/data/apps";
import type { ApplicationDTO } from "@/lib/data/applications";
import styles from "./AppsExplorer.module.css";

export type ApplicationItem = AppItem | ApplicationDTO;

interface AppsExplorerProps {
  apps: ApplicationItem[];
}

export function AppsExplorer({ apps }: AppsExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredApps = useMemo(() => {
    if (!normalizedQuery) return apps;
    return apps.filter((app) => {
      const nameMatch = app.name.toLowerCase().includes(normalizedQuery);
      const categoryMatch = app.category.toLowerCase().includes(normalizedQuery);
      const descMatch = app.description.toLowerCase().includes(normalizedQuery);
      const probMatch = app.problem?.toLowerCase().includes(normalizedQuery) || false;
      const dirMatch = app.direction?.toLowerCase().includes(normalizedQuery) || false;
      const techMatch = app.technologies.some((tech) =>
        tech.toLowerCase().includes(normalizedQuery)
      );
      const statusMatch = app.status.toLowerCase().includes(normalizedQuery);
      return (
        nameMatch ||
        categoryMatch ||
        descMatch ||
        probMatch ||
        dirMatch ||
        techMatch ||
        statusMatch
      );
    });
  }, [apps, normalizedQuery]);

  const isSearching = normalizedQuery.length > 0;

  // When not searching, separate the primary featured app and the grid apps
  const featuredApp = useMemo(() => {
    return apps.find((a) => a.featured) || apps[0];
  }, [apps]);

  const gridApps = useMemo(() => {
    if (!featuredApp) return apps;
    return apps.filter((a) => a.id !== featuredApp.id);
  }, [apps, featuredApp]);

  return (
    <div className={styles.container}>
      <Container>
        {/* Search Toolbar */}
        <div className={styles.searchBar}>
          <div className={styles.searchFieldWrap}>
            <Search size={18} className={styles.searchIcon} aria-hidden="true" />
            <input
              type="text"
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications by name, category, or technology (e.g. EdTech, Vue 3, AI)..."
              aria-label="Search applications"
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear application search"
              >
                <X size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className={styles.searchBadge}>
            {isSearching ? (
              <span>
                Found {filteredApps.length}{" "}
                {filteredApps.length === 1 ? "application" : "applications"}
              </span>
            ) : (
              <span>{apps.length} Live &amp; Planned Applications</span>
            )}
          </div>
        </div>
      </Container>

      {/* Content Rendering: Search vs Editorial */}
      {isSearching ? (
        filteredApps.length === 0 ? (
          /* Empty Search Results State */
          <Container>
            <div className={styles.emptyState}>
              <div className={styles.emptyIconWrap}>
                <FolderX size={36} aria-hidden="true" />
              </div>
              <h3 className={styles.emptyTitle}>No matching applications found</h3>
              <p className={styles.emptyText}>
                No applications match your search for &ldquo;{searchQuery}&rdquo;.
                Try searching by technology (e.g. TypeScript, Python, Mobile) or category.
              </p>
              <button
                type="button"
                className={styles.emptyResetBtn}
                onClick={() => setSearchQuery("")}
              >
                Clear search and view all applications
              </button>
            </div>
          </Container>
        ) : (
          /* Filtered Results Grid */
          <section className={styles.filteredSection} aria-label="Search results">
            <Container>
              <div className={styles.filteredGrid}>
                {filteredApps.map((app, index) => (
                  <AppCard key={app.id} app={app} index={index} />
                ))}
              </div>
            </Container>
          </section>
        )
      ) : (
        /* Default Editorial Showcase */
        <>
          {featuredApp && <FeaturedApp app={featuredApp} />}
          {gridApps.length > 0 && (
            <section className={styles.editorialGridSection} aria-labelledby="apps-grid-heading">
              <Container>
                <div className={styles.sectionHeader}>
                  <div className={styles.labelGroup}>
                    <span className={styles.indexNumber}>02</span>
                    <div className={styles.verticalDivider} aria-hidden="true" />
                    <h2 id="apps-grid-heading" className={styles.sectionLabel}>
                      Also building &amp; maintaining
                    </h2>
                  </div>
                  <span className={styles.metaLabel}>{gridApps.length} APPLICATIONS</span>
                </div>

                <div className={styles.filteredGrid}>
                  {gridApps.map((app, index) => (
                    <AppCard key={app.id} app={app} index={index} />
                  ))}
                </div>
              </Container>
            </section>
          )}
        </>
      )}
    </div>
  );
}

