"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Layers,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { AdminDesign } from "@/types/admin";
import {
  deleteDesignAction,
  toggleDesignPublishedAction,
  toggleDesignFeaturedAction,
  updateDesignSortOrderAction,
} from "@/lib/actions/designs";
import styles from "./DesignList.module.css";

interface DesignListProps {
  initialDesigns: AdminDesign[];
}

function DesignCoverThumbnail({ src, title }: { src: string | null; title: string }) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <Layers size={20} className={styles.thumbnailFallback} />;
  }

  const isValidUrl =
    src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://");
  if (!isValidUrl) {
    return <Layers size={20} className={styles.thumbnailFallback} />;
  }

  return (
    <Image
      src={src}
      alt={`${title} cover`}
      fill
      sizes="56px"
      className={styles.thumbnailImg}
      onError={() => setHasError(true)}
    />
  );
}

export function DesignList({ initialDesigns }: DesignListProps) {
  const [designs, setDesigns] = useState<AdminDesign[]>(initialDesigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Delete modal state
  const [designToDelete, setDesignToDelete] = useState<AdminDesign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset pagination on filter or search change
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (id: string, newOrder: number) => {
    if (mutatingId) return;
    setMutatingId(id);

    startTransition(async () => {
      try {
        const result = await updateDesignSortOrderAction(id, newOrder);
        if (result.success && typeof result.data === "number") {
          const updatedOrder = result.data;
          setDesigns((prev) =>
            prev.map((d) => (d.id === id ? { ...d, sortOrder: updatedOrder } : d))
          );
          setFeedback({
            type: "success",
            message: `Sort order updated to ${updatedOrder}.`,
          });
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to update sort order.",
          });
        }
      } catch (err) {
        console.error("[DesignList] Sort order error:", err);
        setFeedback({
          type: "error",
          message: "Failed to update sort order. Please try again.",
        });
      } finally {
        setMutatingId(null);
      }
    });
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(designs.map((d) => d.category));
    return Array.from(set);
  }, [designs]);

  // Filtered designs
  const filteredDesigns = useMemo(() => {
    return designs.filter((design) => {
      const matchesSearch =
        design.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.tools.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || design.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && design.published) ||
        (statusFilter === "draft" && !design.published) ||
        (statusFilter === "featured" && design.featured);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [designs, searchQuery, categoryFilter, statusFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDesigns.length / itemsPerPage));
  const paginatedDesigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDesigns.slice(start, start + itemsPerPage);
  }, [filteredDesigns, currentPage, itemsPerPage]);

  const togglePublish = (id: string, currentStatus: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextStatus = !currentStatus;

    startTransition(async () => {
      try {
        const result = await toggleDesignPublishedAction(id, nextStatus);

        if (result.success && typeof result.data === "boolean") {
          const publishedValue: boolean = result.data;
          // Show Published only after database confirms update
          setDesigns((prev) =>
            prev.map((d) => (d.id === id ? { ...d, published: publishedValue } : d))
          );
          setFeedback({
            type: "success",
            message: `Design visibility updated to ${publishedValue ? "Published" : "Draft"}.`,
          });
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to update publication status in database.",
          });
        }
      } catch (err: unknown) {
        console.error("[DesignList] Toggle publish error:", err);
        setFeedback({
          type: "error",
          message: "Failed to update publication status due to a server error. Please try again.",
        });
      } finally {
        setMutatingId(null);
      }
    });
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextFeatured = !currentFeatured;

    startTransition(async () => {
      try {
        const result = await toggleDesignFeaturedAction(id, nextFeatured);

        if (result.success && typeof result.data === "boolean") {
          const featuredValue: boolean = result.data;
          setDesigns((prev) =>
            prev.map((d) => (d.id === id ? { ...d, featured: featuredValue } : d))
          );
          setFeedback({
            type: "success",
            message: `Design featured highlight ${featuredValue ? "enabled" : "disabled"}.`,
          });
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to update featured flag in database.",
          });
        }
      } catch (err: unknown) {
        console.error("[DesignList] Toggle featured error:", err);
        setFeedback({
          type: "error",
          message: "Failed to update featured status. Please try again.",
        });
      } finally {
        setMutatingId(null);
      }
    });
  };

  const confirmDelete = () => {
    if (!designToDelete || isDeleting) return;

    setIsDeleting(true);
    const idToDelete = designToDelete.id;
    const designTitle = designToDelete.title;

    startTransition(async () => {
      try {
        const result = await deleteDesignAction(idToDelete);

        if (result.success) {
          setDesigns((prev) => prev.filter((d) => d.id !== idToDelete));
          setFeedback({
            type: "success",
            message: `Design "${designTitle}" successfully deleted from Supabase.`,
          });
          setDesignToDelete(null);
        } else {
          setFeedback({
            type: "error",
            message: result.error || "Failed to delete design from database.",
          });
        }
      } catch (err) {
        console.error("[DesignList] Delete error:", err);
        setFeedback({
          type: "error",
          message: "An unexpected error occurred while deleting the design.",
        });
      } finally {
        setIsDeleting(false);
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Feedback banner */}
      {feedback && (
        <div
          className={styles.actionFeedback}
          role="status"
          style={{
            borderColor: feedback.type === "error" ? "#E53E3E" : "#01605A",
            backgroundColor:
              feedback.type === "error"
                ? "rgba(229, 62, 62, 0.1)"
                : "rgba(1, 96, 90, 0.12)",
            color: feedback.type === "error" ? "#E53E3E" : "#01605A",
          }}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "inherit",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action / Search Bar */}
      <div className={styles.actionBar}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search designs by title, description, or tools..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={styles.searchInput}
              aria-label="Search designs"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by publication status"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Live</option>
            <option value="draft">Draft / Unpublished</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>

        <Button href="/admin/designs/new" variant="primary" size="sm">
          <Plus size={15} />
          <span>New Design</span>
        </Button>
      </div>

      {/* Designs Table */}
      <div className={styles.tableCard}>
        {filteredDesigns.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={36} />
            <h3 className={styles.emptyTitle}>
              {designs.length === 0 ? "No designs in the database" : "No matching designs found"}
            </h3>
            <p>
              {designs.length === 0
                ? "Start showcasing your creative work by adding your first design."
                : "Try adjusting your search query or active filters."}
            </p>
            {designs.length === 0 ? (
              <Button href="/admin/designs/new" variant="primary" size="sm">
                <Plus size={15} />
                <span>Create First Design</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Cover</th>
                  <th className={styles.th}>Title</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Tools</th>
                  <th className={styles.th}>Order</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Featured</th>
                  <th className={styles.th} style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedDesigns.map((design) => (
                  <tr key={design.id} className={styles.tr}>
                    {/* Cover thumbnail */}
                    <td className={styles.td}>
                      <div className={styles.thumbnailWrap}>
                        <DesignCoverThumbnail
                          src={design.coverImage}
                          title={design.title}
                        />
                      </div>
                    </td>

                    {/* Title & slug */}
                    <td className={styles.td}>
                      <div className={styles.designMeta}>
                        <span className={styles.designTitle}>{design.title}</span>
                        <span className={styles.designSlug}>
                          <code style={{ fontSize: "0.7rem", opacity: 0.8 }}>{design.slug}</code>
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className={styles.td}>
                      <span className={styles.categoryTag}>{design.category}</span>
                    </td>

                    {/* Tools */}
                    <td className={styles.td}>
                      <div className={styles.toolPills}>
                        {design.tools.slice(0, 3).map((tool) => (
                          <span key={tool} className={styles.toolTag}>
                            {tool}
                          </span>
                        ))}
                        {design.tools.length > 3 && (
                          <span className={styles.toolTag}>
                            +{design.tools.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sort Order Input */}
                    <td className={styles.td}>
                      <input
                        type="number"
                        min="0"
                        key={`${design.id}-${design.sortOrder}`}
                        defaultValue={design.sortOrder ?? 0}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val !== design.sortOrder) {
                            handleSortOrderChange(design.id, val);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.currentTarget.blur();
                          }
                        }}
                        disabled={mutatingId === design.id || isPending}
                        className={styles.orderInput}
                        title="Display order priority (lowest first)"
                        aria-label={`Sort order for ${design.title}`}
                      />
                    </td>

                    {/* Published toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => togglePublish(design.id, design.published)}
                        disabled={mutatingId === design.id || isPending}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: mutatingId === design.id ? "wait" : "pointer",
                          opacity: mutatingId === design.id ? 0.6 : 1,
                        }}
                        title={
                          mutatingId === design.id
                            ? "Updating status in database..."
                            : "Click to toggle publish status"
                        }
                      >
                        <AdminBadge
                          label={
                            mutatingId === design.id
                              ? "Updating..."
                              : design.published
                              ? "Published"
                              : "Draft"
                          }
                          variant={design.published ? "published" : "draft"}
                        />
                      </button>
                    </td>

                    {/* Featured toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(design.id, design.featured)}
                        disabled={mutatingId === design.id || isPending}
                        className={styles.iconBtn}
                        style={{
                          color: design.featured ? "#FF862D" : "var(--color-text-subtle)",
                          cursor: mutatingId === design.id ? "wait" : "pointer",
                          opacity: mutatingId === design.id ? 0.6 : 1,
                        }}
                        title={
                          mutatingId === design.id
                            ? "Updating..."
                            : design.featured
                            ? "Remove from featured"
                            : "Set as featured"
                        }
                        aria-label={`Toggle featured status for ${design.title}`}
                      >
                        <Star size={16} fill={design.featured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/designs/${design.id}/edit`}
                          className={styles.iconBtn}
                          title="Edit design"
                          aria-label={`Edit ${design.title}`}
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          href={design.published ? `/design/${design.slug}` : "/design"}
                          target="_blank"
                          className={styles.iconBtn}
                          title={design.published ? "View design showcase live" : "Preview designs gallery"}
                          aria-label={`View ${design.title} publicly`}
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDesignToDelete(design)}
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Delete design"
                          aria-label={`Delete ${design.title}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {filteredDesigns.length > 0 && (
              <div className={styles.paginationBar}>
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDesigns.length)} to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredDesigns.length)} of {filteredDesigns.length} designs
                </span>
                <div className={styles.paginationButtons}>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={styles.pageBtn}
                    aria-label="Previous page"
                  >
                    ← Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={styles.pageBtn}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(designToDelete)}
        onClose={() => {
          if (!isDeleting) setDesignToDelete(null);
        }}
        title="Confirm Design Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setDesignToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isDeleting}
              style={{ backgroundColor: "#E53E3E", borderColor: "#E53E3E", color: "#FFFFFF" }}
              onClick={confirmDelete}
            >
              {isDeleting ? "Deleting..." : "Permanently Delete Design"}
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{designToDelete?.title}</strong>?
        </p>
        <p style={{ marginTop: "8px", fontSize: "0.8125rem", color: "var(--color-text-subtle)" }}>
          Warning: This action will permanently remove the record from your Supabase database. This action cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
