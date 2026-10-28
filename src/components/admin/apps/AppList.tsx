"use client";

import React, { useState, useMemo } from "react";
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
import { AdminApp } from "@/types/admin";
import {
  deleteAppAction,
  toggleAppPublishedAction,
  toggleAppFeaturedAction,
} from "@/lib/actions/apps";
import styles from "./AppList.module.css";

interface AppListProps {
  initialApps: AdminApp[];
}

export function AppList({ initialApps }: AppListProps) {
  const [apps, setApps] = useState<AdminApp[]>(initialApps);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const [appToDelete, setAppToDelete] = useState<AdminApp | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set(apps.map((a) => a.category));
    return Array.from(set);
  }, [apps]);

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      const matchesSearch =
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || app.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && app.published) ||
        (statusFilter === "draft" && !app.published) ||
        (statusFilter === "featured" && app.featured);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [apps, searchQuery, categoryFilter, statusFilter]);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextStatus = !currentStatus;

    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, published: nextStatus } : a))
    );

    const result = await toggleAppPublishedAction(id, nextStatus);
    setMutatingId(null);

    if (!result.success) {
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, published: currentStatus } : a))
      );
      setFeedback({
        type: "error",
        message: result.error || "Failed to update publication status in database.",
      });
    } else {
      setFeedback({
        type: "success",
        message: `Application visibility set to ${nextStatus ? "Published" : "Draft"}.`,
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextFeatured = !currentFeatured;

    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, featured: nextFeatured } : a))
    );

    const result = await toggleAppFeaturedAction(id, nextFeatured);
    setMutatingId(null);

    if (!result.success) {
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, featured: currentFeatured } : a))
      );
      setFeedback({
        type: "error",
        message: result.error || "Failed to update featured flag in database.",
      });
    } else {
      setFeedback({
        type: "success",
        message: `Featured highlight ${nextFeatured ? "enabled" : "disabled"}.`,
      });
    }
  };

  const confirmDelete = async () => {
    if (!appToDelete || isDeleting) return;

    setIsDeleting(true);
    const idToDelete = appToDelete.id;
    const appName = appToDelete.name;

    try {
      const result = await deleteAppAction(idToDelete);

      if (!result.success) {
        setFeedback({
          type: "error",
          message: result.error || "Failed to delete application from database.",
        });
        setIsDeleting(false);
        setAppToDelete(null);
        return;
      }

      setApps((prev) => prev.filter((a) => a.id !== idToDelete));
      setFeedback({
        type: "success",
        message: `Application "${appName}" successfully deleted from Supabase.`,
      });
    } catch (err) {
      console.error("[AppList] Delete error:", err);
      setFeedback({
        type: "error",
        message: "An unexpected error occurred while deleting the application.",
      });
    } finally {
      setIsDeleting(false);
      setAppToDelete(null);
    }
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
              placeholder="Search apps by name, description, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search applications"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by publication status"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Live</option>
            <option value="draft">Draft / Unpublished</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>

        <Button href="/admin/apps/new" variant="primary" size="sm">
          <Plus size={15} />
          <span>New Application</span>
        </Button>
      </div>

      {/* Applications Table */}
      <div className={styles.tableCard}>
        {filteredApps.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={36} />
            <h3 className={styles.emptyTitle}>
              {apps.length === 0
                ? "No applications in the database"
                : "No matching applications found"}
            </h3>
            <p>
              {apps.length === 0
                ? "Start adding your engineered applications to showcase your work."
                : "Try adjusting your search query or active filters."}
            </p>
            {apps.length === 0 ? (
              <Button href="/admin/apps/new" variant="primary" size="sm">
                <Plus size={15} />
                <span>Create First Application</span>
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
                  <th className={styles.th}>Application</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Tech Stack</th>
                  <th className={styles.th}>Featured</th>
                  <th className={styles.th}>Visibility</th>
                  <th className={styles.th} style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => (
                  <tr key={app.id} className={styles.tr}>
                    {/* App & Thumbnail */}
                    <td className={styles.td}>
                      <div className={styles.appCell}>
                        <div className={styles.thumbnailWrap}>
                          {app.image ? (
                            <Image
                              src={app.image}
                              alt=""
                              fill
                              sizes="44px"
                              className={styles.thumbnailImg}
                            />
                          ) : (
                            <Layers size={20} className={styles.thumbnailFallback} />
                          )}
                        </div>
                        <div className={styles.appMeta}>
                          <span className={styles.appTitle}>{app.name}</span>
                          <span className={styles.appCategory}>
                            {app.category} · <code style={{ fontSize: "0.7rem", opacity: 0.8 }}>{app.slug}</code>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className={styles.td}>
                      <AdminBadge
                        label={app.status}
                        variant={
                          app.statusType === "showcase" || app.statusType === "in-development"
                            ? "active"
                            : "draft"
                        }
                      />
                    </td>

                    {/* Tech stack */}
                    <td className={styles.td}>
                      <div className={styles.techPills}>
                        {app.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                        {app.technologies.length > 3 && (
                          <span className={styles.techTag}>
                            +{app.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(app.id, app.featured)}
                        disabled={mutatingId === app.id}
                        className={styles.iconBtn}
                        style={{
                          color: app.featured ? "#FF862D" : "var(--color-text-subtle)",
                          cursor: mutatingId === app.id ? "wait" : "pointer",
                        }}
                        title={app.featured ? "Remove featured" : "Set as featured"}
                        aria-label={`Toggle featured status for ${app.name}`}
                      >
                        <Star size={16} fill={app.featured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    {/* Published toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => togglePublish(app.id, app.published)}
                        disabled={mutatingId === app.id}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: mutatingId === app.id ? "wait" : "pointer",
                        }}
                        title="Click to toggle publish status"
                      >
                        <AdminBadge
                          label={app.published ? "Published" : "Draft"}
                          variant={app.published ? "published" : "draft"}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/apps/${app.id}/edit`}
                          className={styles.iconBtn}
                          title="Edit application"
                          aria-label={`Edit ${app.name}`}
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          href="/apps"
                          target="_blank"
                          className={styles.iconBtn}
                          title="View on public site"
                          aria-label={`View ${app.name} publicly`}
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Delete application"
                          aria-label={`Delete ${app.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(appToDelete)}
        onClose={() => {
          if (!isDeleting) setAppToDelete(null);
        }}
        title="Confirm Application Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setAppToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              disabled={isDeleting}
              style={{
                backgroundColor: "#E53E3E",
                borderColor: "#E53E3E",
                color: "#FFFFFF",
              }}
              onClick={confirmDelete}
            >
              {isDeleting ? "Deleting..." : "Permanently Delete Application"}
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{appToDelete?.name}</strong>?
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8125rem",
            color: "var(--color-text-subtle)",
          }}
        >
          Warning: This action will permanently remove the application from your Supabase database. This action cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
