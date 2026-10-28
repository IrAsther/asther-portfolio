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
  FolderGit2,
} from "lucide-react";
import { AdminBadge } from "@/components/admin/ui/AdminBadge";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { AdminProject } from "@/types/admin";
import {
  deleteProjectAction,
  toggleProjectPublishedAction,
  toggleProjectFeaturedAction,
} from "@/lib/actions/projects";
import styles from "./ProjectList.module.css";

interface ProjectListProps {
  initialProjects: AdminProject[];
}

export function ProjectList({ initialProjects }: ProjectListProps) {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<AdminProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return Array.from(set);
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some((t) =>
          t.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        categoryFilter === "all" || project.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && project.published) ||
        (statusFilter === "draft" && !project.published) ||
        (statusFilter === "featured" && project.featured);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [projects, searchQuery, categoryFilter, statusFilter]);

  const togglePublish = async (id: string, currentStatus: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextStatus = !currentStatus;

    // Optimistically update local state
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: nextStatus } : p))
    );

    const result = await toggleProjectPublishedAction(id, nextStatus);
    setMutatingId(null);

    if (!result.success) {
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, published: currentStatus } : p))
      );
      setFeedback({
        type: "error",
        message: result.error || "Failed to update publication status in database.",
      });
    } else {
      setFeedback({
        type: "success",
        message: `Project visibility set to ${nextStatus ? "Published" : "Draft"}.`,
      });
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    if (mutatingId) return;
    setMutatingId(id);
    const nextFeatured = !currentFeatured;

    // Optimistically update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: nextFeatured } : p))
    );

    const result = await toggleProjectFeaturedAction(id, nextFeatured);
    setMutatingId(null);

    if (!result.success) {
      // Revert
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: currentFeatured } : p))
      );
      setFeedback({
        type: "error",
        message: result.error || "Failed to update featured flag in database.",
      });
    } else {
      setFeedback({
        type: "success",
        message: `Project featured highlight ${nextFeatured ? "enabled" : "disabled"}.`,
      });
    }
  };

  const confirmDelete = async () => {
    if (!projectToDelete || isDeleting) return;

    setIsDeleting(true);
    const idToDelete = projectToDelete.id;
    const projectTitle = projectToDelete.title;

    try {
      const result = await deleteProjectAction(idToDelete);

      if (!result.success) {
        setFeedback({
          type: "error",
          message: result.error || "Failed to delete project from database.",
        });
        setIsDeleting(false);
        setProjectToDelete(null);
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== idToDelete));
      setFeedback({
        type: "success",
        message: `Project "${projectTitle}" successfully deleted from Supabase.`,
      });
    } catch (err) {
      console.error("[ProjectList] Delete error:", err);
      setFeedback({
        type: "error",
        message: "An unexpected error occurred while deleting the project.",
      });
    } finally {
      setIsDeleting(false);
      setProjectToDelete(null);
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
              placeholder="Search projects by title, summary, or stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search projects"
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

        <Button href="/admin/projects/new" variant="primary" size="sm">
          <Plus size={15} />
          <span>New Project</span>
        </Button>
      </div>

      {/* Projects Table */}
      <div className={styles.tableCard}>
        {filteredProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderGit2 size={36} />
            <h3 className={styles.emptyTitle}>
              {projects.length === 0 ? "No projects in the database" : "No matching projects found"}
            </h3>
            <p>
              {projects.length === 0
                ? "Start building your digital portfolio by creating your first project."
                : "Try adjusting your search query or active filters."}
            </p>
            {projects.length === 0 ? (
              <Button href="/admin/projects/new" variant="primary" size="sm">
                <Plus size={15} />
                <span>Create First Project</span>
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
                  <th className={styles.th}>Project</th>
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
                {filteredProjects.map((project) => (
                  <tr key={project.id} className={styles.tr}>
                    {/* Project & Thumbnail */}
                    <td className={styles.td}>
                      <div className={styles.projectCell}>
                        <div className={styles.thumbnailWrap}>
                          {project.image ? (
                            <Image
                              src={project.image}
                              alt=""
                              fill
                              sizes="44px"
                              className={styles.thumbnailImg}
                            />
                          ) : (
                            <FolderGit2 size={20} className={styles.thumbnailFallback} />
                          )}
                        </div>
                        <div className={styles.projectMeta}>
                          <span className={styles.projectTitle}>{project.title}</span>
                          <span className={styles.projectCategory}>
                            {project.category} · <code style={{ fontSize: "0.7rem", opacity: 0.8 }}>{project.slug}</code>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className={styles.td}>
                      <AdminBadge
                        label={project.status}
                        variant={project.statusType === "active" ? "active" : "draft"}
                      />
                    </td>

                    {/* Tech stack */}
                    <td className={styles.td}>
                      <div className={styles.techPills}>
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span key={tech} className={styles.techTag}>
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className={styles.techTag}>
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Featured toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => toggleFeatured(project.id, project.featured)}
                        disabled={mutatingId === project.id}
                        className={styles.iconBtn}
                        style={{
                          color: project.featured ? "#FF862D" : "var(--color-text-subtle)",
                          cursor: mutatingId === project.id ? "wait" : "pointer",
                        }}
                        title={project.featured ? "Remove from featured" : "Set as featured"}
                        aria-label={`Toggle featured status for ${project.title}`}
                      >
                        <Star size={16} fill={project.featured ? "currentColor" : "none"} />
                      </button>
                    </td>

                    {/* Published toggle */}
                    <td className={styles.td}>
                      <button
                        type="button"
                        onClick={() => togglePublish(project.id, project.published)}
                        disabled={mutatingId === project.id}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: mutatingId === project.id ? "wait" : "pointer",
                        }}
                        title="Click to toggle publish status"
                      >
                        <AdminBadge
                          label={project.published ? "Published" : "Draft"}
                          variant={project.published ? "published" : "draft"}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/admin/projects/${project.id}/edit`}
                          className={styles.iconBtn}
                          title="Edit project"
                          aria-label={`Edit ${project.title}`}
                        >
                          <Edit size={14} />
                        </Link>
                        <Link
                          href="/projects"
                          target="_blank"
                          className={styles.iconBtn}
                          title="View on public site"
                          aria-label={`View ${project.title} publicly`}
                        >
                          <ExternalLink size={14} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setProjectToDelete(project)}
                          className={`${styles.iconBtn} ${styles.deleteBtn}`}
                          title="Delete project"
                          aria-label={`Delete ${project.title}`}
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
        isOpen={Boolean(projectToDelete)}
        onClose={() => {
          if (!isDeleting) setProjectToDelete(null);
        }}
        title="Confirm Project Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={isDeleting}
              onClick={() => setProjectToDelete(null)}
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
              {isDeleting ? "Deleting..." : "Permanently Delete Project"}
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete <strong>{projectToDelete?.title}</strong>?
        </p>
        <p style={{ marginTop: "8px", fontSize: "0.8125rem", color: "var(--color-text-subtle)" }}>
          Warning: This action will permanently remove the record from your Supabase database. This action cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
