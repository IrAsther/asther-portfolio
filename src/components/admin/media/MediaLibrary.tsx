"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useTransition,
  useCallback,
} from "react";
import Image from "next/image";
import {
  Search,
  Upload,
  Trash2,
  Copy,
  CheckCircle,
  Image as ImageIcon,
  File,
  Grid3x3,
  List,
  X,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { uploadMediaAction } from "@/lib/actions/upload";
import { deleteMediaAssetAction, updateMediaAltTextAction } from "@/lib/actions/media";
import { AdminMediaAsset } from "@/types/admin";
import styles from "./MediaLibrary.module.css";

// ── Helpers ────────────────────────────────────────────────────────────────────

const UPLOAD_FOLDERS = [
  { value: "general", label: "General" },
  { value: "projects", label: "Projects" },
  { value: "applications", label: "Applications" },
  { value: "designs/covers", label: "Design Covers" },
  { value: "designs/gallery", label: "Design Gallery" },
] as const;

type UploadFolder = (typeof UPLOAD_FOLDERS)[number]["value"];

const CATEGORY_OPTIONS = [
  "all",
  "general",
  "projects",
  "applications",
  "design",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function isImage(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

// ── Upload Modal ────────────────────────────────────────────────────────────────

interface UploadModalProps {
  onClose: () => void;
  onUploaded: (asset: AdminMediaAsset) => void;
}

function UploadModal({ onClose, onUploaded }: UploadModalProps) {
  const [folder, setFolder] = useState<UploadFolder>("general");
  const [dragging, setDragging] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      setUploadError(null);
      setUploadSuccess(null);

      // Client-side validation
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type.toLowerCase())) {
        setUploadError(
          `Invalid file type: ${file.type || "unknown"}. Allowed: JPG, PNG, WEBP.`
        );
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(
          `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 5 MB.`
        );
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      startTransition(async () => {
        try {
          const res = await uploadMediaAction(formData, folder);
          if (res.success && res.data) {
            // Derive storagePath from URL
            const url = res.data.url;
            const marker = "/object/public/portfolio-media/";
            const idx = url.indexOf(marker);
            const storagePath = idx !== -1 ? url.slice(idx + marker.length) : url;

            // Derive category from folder
            let category = folder as string;
            if (folder.startsWith("designs")) category = "design";
            else if (folder === "applications") category = "applications";

            const newAsset: AdminMediaAsset = {
              id: res.data.assetId ?? `temp-${Date.now()}`,
              filename: res.data.filename,
              url: url,
              storagePath,
              sizeBytes: res.data.sizeBytes,
              mimeType: file.type,
              category,
              altText: null,
              createdAt: new Date().toISOString(),
            };

            setUploadSuccess(`"${res.data.filename}" uploaded successfully.`);
            onUploaded(newAsset);
          } else {
            setUploadError(res.error || "Upload failed. Please try again.");
          }
        } catch (err: unknown) {
          console.error("[MediaLibrary] Upload error:", err);
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Upload failed due to a connection error. Please try again.";
          setUploadError(errorMsg);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
      });
    },
    [folder, onUploaded]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <AdminModal
      isOpen
      onClose={onClose}
      title="Upload Asset"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isPending}>
            Close
          </Button>
        </>
      }
    >
      <div className={styles.uploadModalBody}>
        {/* Folder selector */}
        <div className={styles.uploadField}>
          <label htmlFor="upload-folder" className={styles.uploadLabel}>
            Storage Folder
          </label>
          <select
            id="upload-folder"
            className={styles.filterSelect}
            value={folder}
            onChange={(e) => setFolder(e.target.value as UploadFolder)}
            disabled={isPending}
          >
            {UPLOAD_FOLDERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Drop zone */}
        <div
          className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""} ${isPending ? styles.dropZoneDisabled : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isPending && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Click or drag file to upload"
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !isPending)
              fileInputRef.current?.click();
          }}
        >
          {isPending ? (
            <div className={styles.dropZoneContent}>
              <Loader2 size={28} className={styles.spinner} />
              <span>Uploading…</span>
            </div>
          ) : (
            <div className={styles.dropZoneContent}>
              <Upload size={28} />
              <span>
                <strong>Click to browse</strong> or drag &amp; drop
              </span>
              <span className={styles.dropZoneHint}>
                JPG, PNG, WEBP — max 5 MB
              </span>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className={styles.hiddenInput}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isPending}
          aria-hidden="true"
        />

        {uploadError && (
          <div className={styles.uploadError} role="alert">
            <AlertCircle size={14} />
            <span>{uploadError}</span>
          </div>
        )}
        {uploadSuccess && (
          <div className={styles.uploadSuccess} role="status">
            <CheckCircle size={14} />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>
    </AdminModal>
  );
}

// ── Main MediaLibrary component ─────────────────────────────────────────────────

interface MediaLibraryProps {
  initialAssets: AdminMediaAsset[];
}

export function MediaLibrary({ initialAssets }: MediaLibraryProps) {
  const [assets, setAssets] = useState<AdminMediaAsset[]>(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<AdminMediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<AdminMediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [editingAltId, setEditingAltId] = useState<string | null>(null);
  const [altTextDraft, setAltTextDraft] = useState("");
  const [isSavingAlt, startAltTransition] = useTransition();

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        a.filename.toLowerCase().includes(q) ||
        (a.altText ?? "").toLowerCase().includes(q);
      const matchesCategory =
        categoryFilter === "all" || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [assets, searchQuery, categoryFilter]);

  // ── Copy URL ──────────────────────────────────────────────────────────────────
  const handleCopyUrl = (asset: AdminMediaAsset) => {
    navigator.clipboard
      .writeText(asset.url)
      .then(() => {
        setCopiedId(asset.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        setFeedback({ type: "error", msg: `URL: ${asset.url}` });
      });
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const confirmDelete = () => {
    if (!assetToDelete) return;
    const target = assetToDelete;
    setAssetToDelete(null);

    startDeleteTransition(async () => {
      const res = await deleteMediaAssetAction(target.id, target.storagePath);
      if (res.success) {
        setAssets((prev) => prev.filter((a) => a.id !== target.id));
        if (selectedAsset?.id === target.id) setSelectedAsset(null);
        setFeedback({ type: "success", msg: `"${target.filename}" deleted.` });
      } else {
        setFeedback({ type: "error", msg: res.error ?? "Delete failed." });
      }
    });
  };

  // ── Upload completed callback ──────────────────────────────────────────────────
  const handleUploaded = (asset: AdminMediaAsset) => {
    setAssets((prev) => [asset, ...prev]);
    setFeedback({ type: "success", msg: `"${asset.filename}" uploaded successfully.` });
  };

  // ── Alt text editing ──────────────────────────────────────────────────────────
  const startEditingAlt = (asset: AdminMediaAsset) => {
    setEditingAltId(asset.id);
    setAltTextDraft(asset.altText ?? "");
  };

  const saveAltText = (assetId: string) => {
    startAltTransition(async () => {
      const res = await updateMediaAltTextAction(assetId, altTextDraft);
      if (res.success) {
        setAssets((prev) =>
          prev.map((a) => (a.id === assetId ? { ...a, altText: altTextDraft.trim() || null } : a))
        );
        if (selectedAsset?.id === assetId) {
          setSelectedAsset((prev) =>
            prev ? { ...prev, altText: altTextDraft.trim() || null } : prev
          );
        }
        setFeedback({ type: "success", msg: "Alt text updated." });
      } else {
        setFeedback({ type: "error", msg: res.error ?? "Failed to update alt text." });
      }
      setEditingAltId(null);
    });
  };

  // ── Download ──────────────────────────────────────────────────────────────────
  const handleDownload = (asset: AdminMediaAsset) => {
    const a = document.createElement("a");
    a.href = asset.url;
    a.download = asset.filename;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.mediaLayout}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Media Library</h1>
          <p className={styles.pageSubtitle}>
            Browse and manage uploaded images used across the portfolio. {assets.length} asset
            {assets.length !== 1 ? "s" : ""} stored.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload size={15} />
          <span>Upload Asset</span>
        </Button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div
          className={
            feedback.type === "success" ? styles.toastSuccess : styles.toastError
          }
          role="status"
        >
          <span>{feedback.msg}</span>
          <button
            type="button"
            className={styles.toastDismiss}
            onClick={() => setFeedback(null)}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by filename or alt text…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search media assets"
          />
        </div>

        <div className={styles.toolbarRight}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
            aria-label="Filter by category"
          >
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "all"
                  ? "All Categories"
                  : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div className={styles.viewToggle}>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === "grid" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid3x3 size={15} />
            </button>
            <button
              type="button"
              className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List size={15} />
            </button>
          </div>

          <span className={styles.assetCount}>
            {filteredAssets.length} asset{filteredAssets.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Assets */}
      {filteredAssets.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={40} />
          <h3 className={styles.emptyTitle}>
            {assets.length === 0 ? "No assets yet" : "No assets found"}
          </h3>
          <p>
            {assets.length === 0
              ? "Upload your first asset using the button above."
              : "Try adjusting your search or category filter."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className={styles.grid}>
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className={`${styles.gridItem} ${selectedAsset?.id === asset.id ? styles.gridItemSelected : ""}`}
              onClick={() =>
                setSelectedAsset(selectedAsset?.id === asset.id ? null : asset)
              }
              aria-label={`Select ${asset.filename}`}
              aria-pressed={selectedAsset?.id === asset.id}
            >
              <div className={styles.gridThumb}>
                {isImage(asset.mimeType) ? (
                  <Image
                    src={asset.url}
                    alt={asset.altText ?? asset.filename}
                    fill
                    sizes="180px"
                    className={styles.thumbImg}
                  />
                ) : (
                  <File size={28} style={{ color: "var(--color-text-subtle)" }} />
                )}
              </div>
              <div className={styles.gridMeta}>
                <span className={styles.gridFilename}>{asset.filename}</span>
                <span className={styles.gridSize}>{formatBytes(asset.sizeBytes)}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.listCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Asset</th>
                <th className={styles.th}>Category</th>
                <th className={styles.th}>Size</th>
                <th className={styles.th}>Date</th>
                <th className={styles.th} style={{ textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.listCell}>
                      <div className={styles.listThumb}>
                        {isImage(asset.mimeType) ? (
                          <Image
                            src={asset.url}
                            alt={asset.altText ?? asset.filename}
                            fill
                            sizes="40px"
                            className={styles.thumbImg}
                          />
                        ) : (
                          <File
                            size={16}
                            style={{ color: "var(--color-text-subtle)" }}
                          />
                        )}
                      </div>
                      <div>
                        <span className={styles.listFilename}>{asset.filename}</span>
                        <span className={styles.listAlt}>
                          {asset.altText ?? (
                            <em style={{ color: "var(--color-text-subtle)" }}>
                              no alt text
                            </em>
                          )}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.categoryPill}>{asset.category}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.sizeText}>{formatBytes(asset.sizeBytes)}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.dateText}>{formatDate(asset.createdAt)}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.actionsCell}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleCopyUrl(asset)}
                        title="Copy URL"
                        aria-label={`Copy URL for ${asset.filename}`}
                      >
                        {copiedId === asset.id ? (
                          <CheckCircle size={14} style={{ color: "#01605A" }} />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleDownload(asset)}
                        title="Download"
                        aria-label={`Download ${asset.filename}`}
                      >
                        <Download size={14} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => setAssetToDelete(asset)}
                        title="Delete asset"
                        aria-label={`Delete ${asset.filename}`}
                        disabled={isDeleting}
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

      {/* Detail panel (grid mode only) */}
      {selectedAsset && viewMode === "grid" && (
        <div className={styles.detailPanel}>
          <div className={styles.detailPanelHeader}>
            <span className={styles.detailPanelTitle}>Asset Details</span>
            <button
              type="button"
              className={styles.closeDetailBtn}
              onClick={() => setSelectedAsset(null)}
              aria-label="Close details"
            >
              ×
            </button>
          </div>
          <div className={styles.detailThumb}>
            {isImage(selectedAsset.mimeType) ? (
              <Image
                src={selectedAsset.url}
                alt={selectedAsset.altText ?? selectedAsset.filename}
                fill
                sizes="400px"
                className={styles.thumbImg}
              />
            ) : (
              <File size={36} />
            )}
          </div>
          <div className={styles.detailMeta}>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Filename</span>
              <span className={styles.detailValue}>{selectedAsset.filename}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>URL</span>
              <code className={styles.detailCode}>{selectedAsset.url}</code>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Type</span>
              <span className={styles.detailValue}>{selectedAsset.mimeType}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Size</span>
              <span className={styles.detailValue}>{formatBytes(selectedAsset.sizeBytes)}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Category</span>
              <span className={styles.detailValue}>{selectedAsset.category}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Alt Text</span>
              {editingAltId === selectedAsset.id ? (
                <div className={styles.altEditRow}>
                  <input
                    type="text"
                    value={altTextDraft}
                    onChange={(e) => setAltTextDraft(e.target.value)}
                    className={styles.altInput}
                    placeholder="Describe this image…"
                    disabled={isSavingAlt}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveAltText(selectedAsset.id);
                      if (e.key === "Escape") setEditingAltId(null);
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => saveAltText(selectedAsset.id)}
                    disabled={isSavingAlt}
                  >
                    {isSavingAlt ? <Loader2 size={13} className={styles.spinner} /> : "Save"}
                  </Button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setEditingAltId(null)}
                    aria-label="Cancel"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className={styles.altDisplayRow}>
                  <span className={styles.detailValue}>
                    {selectedAsset.altText ?? (
                      <em style={{ color: "var(--color-text-subtle)" }}>none</em>
                    )}
                  </span>
                  <button
                    type="button"
                    className={styles.editAltBtn}
                    onClick={() => startEditingAlt(selectedAsset)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Uploaded</span>
              <span className={styles.detailValue}>{formatDate(selectedAsset.createdAt)}</span>
            </div>
          </div>
          <div className={styles.detailActions}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyUrl(selectedAsset)}
            >
              {copiedId === selectedAsset.id ? (
                <>
                  <CheckCircle size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy URL</span>
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(selectedAsset)}
            >
              <Download size={14} />
              <span>Download</span>
            </Button>
            <button
              type="button"
              className={styles.deleteLinkBtn}
              onClick={() => setAssetToDelete(selectedAsset)}
              disabled={isDeleting}
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploaded={handleUploaded}
        />
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        title="Delete Asset"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssetToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{ backgroundColor: "#E53E3E", borderColor: "#E53E3E", color: "#FFFFFF" }}
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={13} className={styles.spinner} />
                  Deleting…
                </>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to permanently delete{" "}
          <strong>{assetToDelete?.filename}</strong>?
        </p>
        <p
          style={{ marginTop: "8px", fontSize: "0.8125rem", color: "var(--color-text-subtle)" }}
        >
          This will remove the file from Supabase Storage and the media catalog.
          Any designs or projects referencing this URL will show a broken image.
        </p>
      </AdminModal>
    </div>
  );
}
