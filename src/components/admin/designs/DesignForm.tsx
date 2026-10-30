"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/media/ImageUploader";
import { AdminDesign, DesignGalleryItem } from "@/types/admin";
import {
  createDesignAction,
  updateDesignAction,
  type DesignInput,
} from "@/lib/actions/designs";
import styles from "./DesignForm.module.css";

interface DesignFormProps {
  initialData?: AdminDesign;
  mode?: "create" | "edit";
  isEditing?: boolean;
}

const CATEGORY_OPTIONS = [
  "UI/UX Design",
  "Graphic Design",
  "Branding",
  "Logo Design",
  "Poster Design",
  "Social Media Design",
  "Web Design",
  "Illustration",
  "Other",
];

const SUGGESTED_TOOLS = [
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe XD",
  "Canva",
  "Procreate",
  "Sketch",
  "Blender",
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function DesignForm({
  initialData,
  mode = "create",
  isEditing = mode === "edit" || Boolean(initialData),
}: DesignFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<Partial<AdminDesign>>(
    initialData || {
      title: "",
      slug: "",
      category: "UI/UX Design",
      description: "",
      tools: ["Figma"],
      coverImage: null,
      gallery: [],
      externalUrl: "",
      projectDate: "",
      published: false,
      featured: false,
      sortOrder: 0,
    }
  );

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [toolInput, setToolInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSaved) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSaved]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, title: value };
      if (!slugManuallyEdited && !isEditing) {
        updated.slug = slugify(value);
      }
      return updated;
    });
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: "" }));
    }
  };

  const handleRegenerateSlug = () => {
    if (formData.title) {
      const generated = slugify(formData.title);
      setFormData((prev) => ({ ...prev, slug: generated }));
      setIsDirty(true);
      if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
    }
  };

  const handleAddTool = (tool: string) => {
    const trimmed = tool.trim();
    if (!trimmed) return;
    const current = formData.tools || [];
    if (!current.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tools: [...current, trimmed],
      }));
    }
    setToolInput("");
  };

  const handleRemoveTool = (toolToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tools: (prev.tools || []).filter((t) => t !== toolToRemove),
    }));
  };

  const handleAddGalleryItem = (url: string) => {
    if (!url) return;
    const newItem: DesignGalleryItem = {
      url,
      alt: formData.title ? `${formData.title} preview` : "Design gallery image",
    };
    setFormData((prev) => ({
      ...prev,
      gallery: [...(prev.gallery || []), newItem],
    }));
  };

  const handleRemoveGalleryItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErrors({});

    // Client-side required checks
    const newErrors: Record<string, string> = {};
    if (!formData.title?.trim()) {
      newErrors.title = "Design title is required.";
    }
    if (!formData.slug?.trim()) {
      newErrors.slug = "URL slug is required.";
    }
    if (!formData.category?.trim()) {
      newErrors.category = "Category is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setFeedback({
        type: "error",
        message: "Please fill in all required fields.",
      });
      return;
    }

    const payload: DesignInput = {
      title: formData.title!.trim(),
      slug: formData.slug!.trim().toLowerCase(),
      category: formData.category!.trim(),
      description: formData.description?.trim() || undefined,
      tools: formData.tools || [],
      coverImage: formData.coverImage?.trim() || undefined,
      gallery: formData.gallery || [],
      externalUrl: formData.externalUrl?.trim() || undefined,
      projectDate: formData.projectDate?.trim() || undefined,
      published: Boolean(formData.published),
      featured: Boolean(formData.featured),
      sortOrder: Number(formData.sortOrder) || 0,
    };

    startTransition(async () => {
      try {
        let res;
        if (isEditing && initialData?.id) {
          res = await updateDesignAction(initialData.id, payload);
        } else {
          res = await createDesignAction(payload);
        }

        if (res.success) {
          setIsSaved(true);
          setIsDirty(false);
          setFeedback({
            type: "success",
            message: isEditing
              ? "Design updated successfully!"
              : "Design created successfully! Redirecting to list...",
          });
          if (!isEditing) {
            setTimeout(() => {
              router.push("/admin/designs");
              router.refresh();
            }, 1000);
          } else {
            router.refresh();
          }
        } else {
          setFeedback({
            type: "error",
            message: res.error || "Failed to save design.",
          });
          if (res.fieldErrors) {
            setErrors(res.fieldErrors);
          }
        }
      } catch (err: unknown) {
        console.error("[DesignForm] Save error:", err);
        setFeedback({
          type: "error",
          message: "Failed to save design due to a server connection error. Please try again.",
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      {/* Top action header */}
      <div className={styles.topBar}>
        <Link href="/admin/designs" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Designs</span>
        </Link>
        <div className={styles.topActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/designs")}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isPending}
          >
            <Save size={15} />
            <span>{isPending ? "Saving..." : isEditing ? "Save Changes" : "Create Design"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`${styles.feedbackBanner} ${
            feedback.type === "success" ? styles.feedbackSuccess : styles.feedbackError
          }`}
          role="status"
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className={styles.feedbackDismiss}
            aria-label="Dismiss feedback"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main form */}
      <form onSubmit={handleSubmit} className={styles.formGrid}>
        {/* Left Column: Core Content */}
        <div className={styles.leftCol}>
          <AdminCard title="Design Details" subtitle="Primary identification and descriptive content">
            <div className={styles.fieldGroup}>
              {/* Title */}
              <div className={styles.field}>
                <label htmlFor="design-title" className={styles.label}>
                  Title <span className={styles.required}>*</span>
                </label>
                <input
                  id="design-title"
                  type="text"
                  value={formData.title || ""}
                  onChange={handleTitleChange}
                  placeholder="e.g. Scholarly ASA UI System"
                  className={`${styles.input} ${errors.title ? styles.inputError : ""}`}
                  disabled={isPending}
                />
                {errors.title && <span className={styles.errorText}>{errors.title}</span>}
              </div>

              {/* Slug */}
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="design-slug" className={styles.label}>
                    URL Slug <span className={styles.required}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    {!slugManuallyEdited && !isEditing ? (
                      <span className={styles.autoTag}>Auto-generated</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-accent)",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                      >
                        Regenerate from title
                      </button>
                    )}
                  </div>
                </div>
                <div className={styles.slugInputWrap}>
                  <span className={styles.slugPrefix}>/design/</span>
                  <input
                    id="design-slug"
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => {
                      setSlugManuallyEdited(true);
                      setIsDirty(true);
                      setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }));
                      if (errors.slug) setErrors((prev) => ({ ...prev, slug: "" }));
                    }}
                    placeholder="scholarly-asa-ui"
                    className={`${styles.slugInput} ${errors.slug ? styles.inputError : ""}`}
                    disabled={isPending}
                  />
                </div>
                {errors.slug && <span className={styles.errorText}>{errors.slug}</span>}
              </div>

              {/* Category */}
              <div className={styles.field}>
                <label htmlFor="design-category" className={styles.label}>
                  Category <span className={styles.required}>*</span>
                </label>
                <select
                  id="design-category"
                  value={formData.category || "UI/UX Design"}
                  onChange={(e) => {
                    setIsDirty(true);
                    setFormData((prev) => ({ ...prev, category: e.target.value }));
                  }}
                  className={styles.select}
                  disabled={isPending}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className={styles.field}>
                <label htmlFor="design-desc" className={styles.label}>
                  Description
                </label>
                <textarea
                  id="design-desc"
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Design approach, context, typographic decisions..."
                  className={styles.textarea}
                  disabled={isPending}
                />
              </div>

              {/* Tools Tag Input */}
              <div className={styles.field}>
                <label className={styles.label}>Tools Used</label>
                <div className={styles.tagInputWrap}>
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTool(toolInput);
                      }
                    }}
                    placeholder="Type tool name and press Enter..."
                    className={styles.input}
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTool(toolInput)}
                    className={styles.addTagBtn}
                    disabled={isPending || !toolInput.trim()}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Suggestions */}
                <div className={styles.suggestionsRow}>
                  <span className={styles.suggestionsLabel}>Suggestions:</span>
                  {SUGGESTED_TOOLS.filter((st) => !(formData.tools || []).includes(st)).map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleAddTool(st)}
                        className={styles.suggestionPill}
                      >
                        + {st}
                      </button>
                    )
                  )}
                </div>

                {/* Selected Tools */}
                {(formData.tools || []).length > 0 && (
                  <div className={styles.tagsList}>
                    {formData.tools!.map((tool) => (
                      <span key={tool} className={styles.tagPill}>
                        <span>{tool}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTool(tool)}
                          className={styles.removeTagBtn}
                          aria-label={`Remove ${tool}`}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AdminCard>

          {/* Media & Gallery Card */}
          <AdminCard
            title="Visual Assets"
            subtitle="Cover image and optional gallery presentations"
          >
            <div className={styles.fieldGroup}>
              {/* Cover Image Uploader */}
              <ImageUploader
                value={formData.coverImage}
                onChange={(url) => setFormData((prev) => ({ ...prev, coverImage: url }))}
                folder="designs/covers"
                label="Cover Image"
                hint="Main visual anchor displayed on portfolio showcase cards."
                id="design-cover-uploader"
              />

              {/* Gallery Section */}
              <div className={styles.gallerySection}>
                <div className={styles.galleryHeader}>
                  <label className={styles.label}>Additional Gallery Images</label>
                  <span className={styles.galleryCount}>
                    {(formData.gallery || []).length} image(s)
                  </span>
                </div>

                {/* Add to Gallery Uploader */}
                <ImageUploader
                  value=""
                  onChange={(url) => handleAddGalleryItem(url)}
                  folder="designs/gallery"
                  label="Add Image to Gallery"
                  hint="Upload an image to append to this design's gallery."
                  id="design-gallery-uploader"
                />

                {/* Gallery List */}
                {(formData.gallery || []).length > 0 && (
                  <div className={styles.galleryGrid}>
                    {formData.gallery!.map((item, idx) => (
                      <div key={idx} className={styles.galleryItemCard}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.url}
                          alt={item.alt || "Gallery item"}
                          className={styles.galleryThumb}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(idx)}
                          className={styles.removeGalleryBtn}
                          title="Remove image from gallery"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Right Column: Settings & Meta */}
        <div className={styles.rightCol}>
          {/* Publication & Status */}
          <AdminCard title="Publishing" subtitle="Control visibility on the public portfolio">
            <div className={styles.fieldGroup}>
              {/* Published Toggle */}
              <label className={styles.checkCard}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.published)}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                  className={styles.checkbox}
                />
                <div className={styles.checkText}>
                  <span className={styles.checkTitle}>Published</span>
                  <span className={styles.checkDesc}>
                    Make visible on public /design page.
                  </span>
                </div>
              </label>

              {/* Featured Toggle */}
              <label className={styles.checkCard}>
                <input
                  type="checkbox"
                  checked={Boolean(formData.featured)}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                  className={styles.checkbox}
                />
                <div className={styles.checkText}>
                  <span className={styles.checkTitle}>Featured Highlight</span>
                  <span className={styles.checkDesc}>
                    Highlight prominently in showcase grid.
                  </span>
                </div>
              </label>

              {/* Sort Order */}
              <div className={styles.field}>
                <label htmlFor="design-sort" className={styles.label}>
                  Sort Priority (Ascending)
                </label>
                <input
                  id="design-sort"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.sortOrder ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      sortOrder: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  className={styles.input}
                  disabled={isPending}
                />
              </div>
            </div>
          </AdminCard>

          {/* External & Date Links */}
          <AdminCard title="Metadata" subtitle="External reference and timeline">
            <div className={styles.fieldGroup}>
              {/* External URL */}
              <div className={styles.field}>
                <label htmlFor="design-external" className={styles.label}>
                  External Link (Behance, Figma, Live)
                </label>
                <input
                  id="design-external"
                  type="url"
                  placeholder="https://figma.com/..."
                  value={formData.externalUrl || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, externalUrl: e.target.value }))
                  }
                  className={styles.input}
                  disabled={isPending}
                />
              </div>

              {/* Project Date */}
              <div className={styles.field}>
                <label htmlFor="design-date" className={styles.label}>
                  Project Date
                </label>
                <input
                  id="design-date"
                  type="date"
                  value={formData.projectDate || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, projectDate: e.target.value }))
                  }
                  className={styles.input}
                  disabled={isPending}
                />
              </div>
            </div>
          </AdminCard>

          {/* Quick Info Box */}
          <div className={styles.infoBox}>
            <Sparkles size={16} className={styles.infoIcon} />
            <div className={styles.infoText}>
              <span>
                Designs are stored in the dedicated Supabase <code>designs</code> table with
                Row Level Security protecting unpublished drafts.
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
