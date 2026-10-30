"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import {
  Upload,
  Link as LinkIcon,
  X,
  RefreshCw,
  AlertCircle,
  Loader2,
  FileImage,
} from "lucide-react";
import { uploadMediaAction } from "@/lib/actions/upload";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: "projects" | "applications" | "designs/covers" | "designs/gallery" | "general";
  label?: string;
  hint?: string;
  id?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = "general",
  label = "Image",
  hint = "Upload a JPG, PNG, or WEBP up to 5 MB, or enter a direct URL.",
  id = "image-uploader",
}: ImageUploaderProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value || "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUrl = value || "";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Client-side quick validation
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError("Invalid file type. Please upload a JPG, PNG, or WEBP.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5 MB limit. Please choose a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    startTransition(async () => {
      try {
        const res = await uploadMediaAction(formData, folder);
        if (res.success && res.data) {
          onChange(res.data.url);
          setUrlInput(res.data.url);
          setError(null);
        } else {
          setError(res.error || "Upload failed. You can paste a direct image URL instead.");
        }
      } catch (err: unknown) {
        console.error("Upload action error:", err);
        setError("Upload failed due to a server connection issue. Please verify the file is under 5 MB or try again.");
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    });
  };

  const handleUrlApply = () => {
    setError(null);
    const trimmed = urlInput.trim();
    if (!trimmed) {
      onChange("");
      return;
    }

    // Basic URL check
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      setError("Please enter a valid URL (starting with http://, https://, or a root-relative path).");
      return;
    }

    onChange(trimmed);
  };

  const handleRemove = () => {
    onChange("");
    setUrlInput("");
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
        <div className={styles.modeToggle} role="tablist" aria-label="Input method">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "upload"}
            className={`${styles.modeBtn} ${mode === "upload" ? styles.modeBtnActive : ""}`}
            onClick={() => {
              setMode("upload");
              setError(null);
            }}
          >
            <Upload size={13} />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "url"}
            className={`${styles.modeBtn} ${mode === "url" ? styles.modeBtnActive : ""}`}
            onClick={() => {
              setMode("url");
              setError(null);
            }}
          >
            <LinkIcon size={13} />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {/* Preview Area if an image is set */}
      {currentUrl ? (
        <div className={styles.previewCard}>
          <div className={styles.previewImageWrap}>
            <Image
              src={currentUrl}
              alt="Uploaded preview"
              fill
              sizes="320px"
              className={styles.previewImage}
              unoptimized={currentUrl.startsWith("http")}
            />
          </div>
          <div className={styles.previewMeta}>
            <div className={styles.urlDisplay}>
              <FileImage size={15} className={styles.fileIcon} />
              <span className={styles.urlText} title={currentUrl}>
                {currentUrl}
              </span>
            </div>
            <div className={styles.previewActions}>
              {mode === "upload" && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  title="Replace image"
                >
                  <RefreshCw size={13} className={isPending ? "animate-spin" : ""} />
                  <span>Replace</span>
                </button>
              )}
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.removeBtn}`}
                onClick={handleRemove}
                disabled={isPending}
                title="Remove image"
              >
                <X size={13} />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className={styles.inputArea}>
          {mode === "upload" ? (
            <div
              className={`${styles.dropzone} ${isPending ? styles.dropzonePending : ""}`}
              onClick={() => !isPending && fileInputRef.current?.click()}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isPending) {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Upload ${label}`}
            >
              {isPending ? (
                <div className={styles.pendingState}>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Uploading to Supabase Storage...</span>
                </div>
              ) : (
                <div className={styles.idleState}>
                  <div className={styles.uploadIconWrap}>
                    <Upload size={20} />
                  </div>
                  <span className={styles.dropzoneTitle}>Click to upload image</span>
                  <span className={styles.dropzoneHint}>{hint}</span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.urlInputRow}>
              <input
                id={id}
                type="text"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlApply();
                  }
                }}
                className={styles.urlField}
              />
              <button
                type="button"
                onClick={handleUrlApply}
                className={styles.applyBtn}
              >
                Set URL
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Error message */}
      {error && (
        <div className={styles.errorBox} role="alert">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
