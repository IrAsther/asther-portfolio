"use client";

import React, { useState, useMemo } from "react";
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
} from "lucide-react";
import { AdminNotice } from "@/components/admin/ui/AdminNotice";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { initialMediaAssets } from "@/data/adminMockData";
import { AdminMediaAsset } from "@/types/admin";
import styles from "./MediaLibrary.module.css";

const CATEGORY_OPTIONS = ["all", "projects", "design", "brand", "portraits"];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary() {
  const [assets, setAssets] =
    useState<AdminMediaAsset[]>(initialMediaAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] =
    useState<AdminMediaAsset | null>(null);
  const [assetToDelete, setAssetToDelete] =
    useState<AdminMediaAsset | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchesSearch =
        a.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.altText.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || a.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [assets, searchQuery, categoryFilter]);

  const handleCopyUrl = (asset: AdminMediaAsset) => {
    navigator.clipboard
      .writeText(asset.url)
      .then(() => {
        setCopiedId(asset.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        setFeedback(`URL: ${asset.url}`);
      });
  };

  const confirmDelete = () => {
    if (!assetToDelete) return;
    setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id));
    if (selectedAsset?.id === assetToDelete.id) setSelectedAsset(null);
    setFeedback(
      `Asset "${assetToDelete.filename}" removed from local prototype state.`
    );
    setAssetToDelete(null);
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  return (
    <div className={styles.mediaLayout}>
      <AdminNotice />

      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Media Library</h1>
          <p className={styles.pageSubtitle}>
            Browse and manage uploaded images and assets used across the portfolio.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setFeedback("Upload will be available once backend storage is connected.")}>
          <Upload size={15} />
          <span>Upload Asset</span>
        </Button>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={styles.toastBanner} role="status">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by filename or alt text..."
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
                {opt === "all" ? "All Categories" : opt.charAt(0).toUpperCase() + opt.slice(1)}
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

      {/* Main content: Grid or List */}
      {filteredAssets.length === 0 ? (
        <div className={styles.emptyState}>
          <ImageIcon size={40} />
          <h3 className={styles.emptyTitle}>No assets found</h3>
          <p>Try adjusting your search or category filter.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className={styles.grid}>
          {filteredAssets.map((asset) => (
            <button
              key={asset.id}
              type="button"
              className={`${styles.gridItem} ${selectedAsset?.id === asset.id ? styles.gridItemSelected : ""}`}
              onClick={() =>
                setSelectedAsset(
                  selectedAsset?.id === asset.id ? null : asset
                )
              }
              aria-label={`Select ${asset.filename}`}
              aria-pressed={selectedAsset?.id === asset.id}
            >
              <div className={styles.gridThumb}>
                {isImage(asset.mimeType) ? (
                  <Image
                    src={asset.url}
                    alt={asset.altText}
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
                <th className={styles.th} style={{ textAlign: "right" }}>Actions</th>
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
                            alt={asset.altText}
                            fill
                            sizes="40px"
                            className={styles.thumbImg}
                          />
                        ) : (
                          <File size={16} style={{ color: "var(--color-text-subtle)" }} />
                        )}
                      </div>
                      <div>
                        <span className={styles.listFilename}>{asset.filename}</span>
                        <span className={styles.listAlt}>{asset.altText}</span>
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
                    <span className={styles.dateText}>{asset.createdAt}</span>
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
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        onClick={() => setAssetToDelete(asset)}
                        title="Delete asset"
                        aria-label={`Delete ${asset.filename}`}
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

      {/* Selected asset detail panel */}
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
                alt={selectedAsset.altText}
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
              <span className={styles.detailValue}>{selectedAsset.altText}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Uploaded</span>
              <span className={styles.detailValue}>{selectedAsset.createdAt}</span>
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
            <button
              type="button"
              className={styles.deleteLinkBtn}
              onClick={() => setAssetToDelete(selectedAsset)}
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        title="Confirm Asset Removal"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAssetToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              style={{
                backgroundColor: "#E53E3E",
                borderColor: "#E53E3E",
                color: "#FFFFFF",
              }}
              onClick={confirmDelete}
            >
              Delete from Demo State
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{assetToDelete?.filename}</strong>?
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8125rem",
            color: "var(--color-text-subtle)",
          }}
        >
          This action removes the asset from local prototype state only.
        </p>
      </AdminModal>
    </div>
  );
}
