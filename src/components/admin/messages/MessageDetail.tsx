"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Reply,
  CheckCircle2,
  Archive,
  RotateCcw,
  Trash2,
  Clock,
  User,
  AtSign,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { AdminCard } from "@/components/admin/ui/AdminCard";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { AdminContactMessage } from "@/types/admin";
import {
  markMessageReadAction,
  markMessageRepliedAction,
  archiveMessageAction,
  restoreMessageAction,
  deleteMessageAction,
} from "@/lib/actions/contact";
import styles from "./MessageDetail.module.css";

interface MessageDetailProps {
  message: AdminContactMessage;
}

export function MessageDetail({ message: initialMessage }: MessageDetailProps) {
  const router = useRouter();
  const [message, setMessage] = useState<AdminContactMessage>(initialMessage);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals state
  const [showReplyConfirm, setShowReplyConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Automatically mark as read on mount if unread
  useEffect(() => {
    if (!message.isRead && message.status === "new") {
      startTransition(async () => {
        try {
          const res = await markMessageReadAction(message.id);
          if (res.success) {
            setMessage((prev) => ({ ...prev, isRead: true, status: "read" }));
          }
        } catch (err: unknown) {
          // Non-fatal: catch transient network or navigation aborts cleanly
          console.warn("[MessageDetail] Could not auto-mark read:", err);
        }
      });
    }
  }, [message.id, message.isRead, message.status]);

  // Construct mailto link
  const constructMailtoUrl = () => {
    const rawSubject = message.subject.trim();
    const replySubject = rawSubject.toLowerCase().startsWith("re:")
      ? rawSubject
      : `Re: ${rawSubject}`;

    const greeting = `Hi ${message.senderName.trim()},`;
    const signature = `\n\n\n\nBest regards,\nAsther Irakaza\nSoftware Developer & Digital Designer\nhttps://asther.dev`;
    const replyBody = `${greeting}\n\nThank you for reaching out.${signature}`;

    const mailto = `mailto:${encodeURIComponent(message.senderEmail)}?subject=${encodeURIComponent(
      replySubject
    )}&body=${encodeURIComponent(replyBody)}`;

    return mailto;
  };

  const handleOpenMailto = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    const mailto = constructMailtoUrl();

    // Use a temporary detached anchor tag to trigger the OS mailto handler.
    // Crucially, this avoids modifying window.location.href, which triggers
    // top-level browser navigation and causes Chromium to abort in-flight Server Actions.
    const tempAnchor = document.createElement("a");
    tempAnchor.href = mailto;
    tempAnchor.rel = "noopener noreferrer";
    tempAnchor.style.display = "none";
    document.body.appendChild(tempAnchor);
    tempAnchor.click();
    document.body.removeChild(tempAnchor);

    setFeedback({
      type: "success",
      message:
        "Opened draft in your default email client. After sending your email, click 'Mark as Replied' below.",
    });
  };

  const handleConfirmReplied = () => {
    startTransition(async () => {
      try {
        const res = await markMessageRepliedAction(message.id);
        if (res.success) {
          setMessage((prev) => ({
            ...prev,
            status: "replied",
            repliedAt: new Date().toISOString(),
          }));
          setFeedback({
            type: "success",
            message: "Message status updated to Replied.",
          });
        } else {
          setFeedback({
            type: "error",
            message: res.error || "Failed to update status.",
          });
        }
      } catch (err: unknown) {
        console.error("[MessageDetail] Error marking replied:", err);
        setFeedback({
          type: "error",
          message: "Failed to update status due to a connection error. Please try again.",
        });
      } finally {
        setShowReplyConfirm(false);
      }
    });
  };

  const handleArchiveToggle = () => {
    startTransition(async () => {
      try {
        if (message.status === "archived") {
          const res = await restoreMessageAction(message.id);
          if (res.success) {
            setMessage((prev) => ({ ...prev, status: "read", archivedAt: null }));
            setFeedback({ type: "success", message: "Message restored from archive." });
          } else {
            setFeedback({ type: "error", message: res.error || "Failed to restore." });
          }
        } else {
          const res = await archiveMessageAction(message.id);
          if (res.success) {
            setMessage((prev) => ({
              ...prev,
              status: "archived",
              archivedAt: new Date().toISOString(),
            }));
            setFeedback({ type: "success", message: "Message moved to archive." });
          } else {
            setFeedback({ type: "error", message: res.error || "Failed to archive." });
          }
        }
      } catch (err: unknown) {
        console.error("[MessageDetail] Error toggling archive:", err);
        setFeedback({
          type: "error",
          message: "Failed to update archive status. Please try again.",
        });
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const res = await deleteMessageAction(message.id);
        if (res.success) {
          router.push("/admin/messages");
          router.refresh();
        } else {
          setFeedback({
            type: "error",
            message: res.error || "Failed to delete message.",
          });
          setShowDeleteConfirm(false);
        }
      } catch (err: unknown) {
        console.error("[MessageDetail] Error deleting message:", err);
        setFeedback({
          type: "error",
          message: "Failed to delete message. Please try again.",
        });
        setShowDeleteConfirm(false);
      }
    });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/admin/messages" className={styles.backLink}>
          <ArrowLeft size={16} />
          <span>Back to Messages</span>
        </Link>

        <div className={styles.topActions}>
          {message.status !== "replied" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyConfirm(true)}
              disabled={isPending}
            >
              <CheckCircle2 size={14} />
              <span>Mark as Replied</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleArchiveToggle}
            disabled={isPending}
          >
            {message.status === "archived" ? (
              <>
                <RotateCcw size={14} />
                <span>Restore</span>
              </>
            ) : (
              <>
                <Archive size={14} />
                <span>Archive</span>
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            style={{ color: "#E53E3E", borderColor: "rgba(229, 62, 62, 0.3)" }}
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isPending}
          >
            <Trash2 size={14} />
            <span>Delete</span>
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
            ×
          </button>
        </div>
      )}

      {/* Main message card */}
      <div className={styles.messageLayout}>
        <div className={styles.mainCol}>
          <AdminCard>
            {/* Header / Meta */}
            <div className={styles.messageHeader}>
              <div className={styles.headerTopRow}>
                <h1 className={styles.subjectTitle}>{message.subject}</h1>
                <span
                  className={`${styles.statusBadge} ${
                    message.status === "new"
                      ? styles.statusNew
                      : message.status === "replied"
                      ? styles.statusReplied
                      : message.status === "archived"
                      ? styles.statusArchived
                      : styles.statusRead
                  }`}
                >
                  {message.status.toUpperCase()}
                </span>
              </div>

              <div className={styles.senderGrid}>
                <div className={styles.senderItem}>
                  <User size={15} className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Sender</span>
                    <span className={styles.metaValue}>{message.senderName}</span>
                  </div>
                </div>

                <div className={styles.senderItem}>
                  <AtSign size={15} className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Email Address</span>
                    <a
                      href={`mailto:${message.senderEmail}`}
                      className={styles.emailLink}
                    >
                      {message.senderEmail}
                    </a>
                  </div>
                </div>

                <div className={styles.senderItem}>
                  <Clock size={15} className={styles.metaIcon} />
                  <div>
                    <span className={styles.metaLabel}>Received</span>
                    <span className={styles.metaValue}>
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className={styles.messageBodySection}>
              <h2 className={styles.bodyHeading}>Message Content</h2>
              <div className={styles.messageTextCard}>
                <p className={styles.messageParagraph}>{message.message}</p>
              </div>
            </div>

            {/* Email Reply Action Area */}
            <div className={styles.replyWorkflowSection}>
              <div className={styles.replyCard}>
                <div className={styles.replyCardHeader}>
                  <Reply size={18} className={styles.replyIcon} />
                  <div>
                    <h3 className={styles.replyCardTitle}>Reply via Email</h3>
                    <p className={styles.replyCardSubtitle}>
                      Launches your default email application (Outlook, Thunderbird, Mail,
                      Gmail) with pre-filled sender, subject, and professional template.
                    </p>
                  </div>
                </div>

                <div className={styles.replyActionsRow}>
                  <Button
                    variant="primary"
                    size="md"
                    type="button"
                    onClick={handleOpenMailto}
                  >
                    <Mail size={15} />
                    <span>Open Email Client to Reply</span>
                    <ExternalLink size={13} />
                  </Button>

                  {message.status !== "replied" && (
                    <Button
                      variant="outline"
                      size="md"
                      type="button"
                      onClick={() => setShowReplyConfirm(true)}
                    >
                      <CheckCircle2 size={15} />
                      <span>Mark as Replied</span>
                    </Button>
                  )}
                </div>

                <div className={styles.replyNotice}>
                  <AlertCircle size={14} className={styles.noticeIcon} />
                  <span>
                    Opening the email client does not automatically mark this message as
                    replied. Click <strong>Mark as Replied</strong> once you have actually
                    sent your email to keep your records accurate.
                  </span>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Right Info Sidebar */}
        <div className={styles.sideCol}>
          <AdminCard title="Message Status">
            <div className={styles.sideGroup}>
              <div className={styles.sideRow}>
                <span className={styles.sideKey}>Status</span>
                <span className={styles.sideVal}>{message.status}</span>
              </div>
              <div className={styles.sideRow}>
                <span className={styles.sideKey}>Read State</span>
                <span className={styles.sideVal}>{message.isRead ? "Read" : "Unread"}</span>
              </div>
              <div className={styles.sideRow}>
                <span className={styles.sideKey}>Received At</span>
                <span className={styles.sideVal}>{formatDate(message.createdAt)}</span>
              </div>
              {message.repliedAt && (
                <div className={styles.sideRow}>
                  <span className={styles.sideKey}>Replied At</span>
                  <span className={styles.sideVal}>{formatDate(message.repliedAt)}</span>
                </div>
              )}
              {message.archivedAt && (
                <div className={styles.sideRow}>
                  <span className={styles.sideKey}>Archived At</span>
                  <span className={styles.sideVal}>{formatDate(message.archivedAt)}</span>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      {/* Confirmation Modal: Mark as Replied */}
      <AdminModal
        isOpen={showReplyConfirm}
        onClose={() => setShowReplyConfirm(false)}
        title="Confirm Reply Sent"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowReplyConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              onClick={handleConfirmReplied}
              disabled={isPending}
            >
              Yes, I Sent the Reply
            </Button>
          </>
        }
      >
        <p>
          Have you completed and sent the reply email to{" "}
          <strong>{message.senderEmail}</strong> using your mail application?
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8125rem",
            color: "var(--color-text-subtle)",
          }}
        >
          Confirming records the current timestamp and marks the status as Replied.
        </p>
      </AdminModal>

      {/* Confirmation Modal: Delete */}
      <AdminModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete Message Permanently"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="button"
              style={{
                backgroundColor: "#E53E3E",
                borderColor: "#E53E3E",
              }}
              onClick={handleDelete}
              disabled={isPending}
            >
              Delete Permanently
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to delete the message from{" "}
          <strong>{message.senderName}</strong>?
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8125rem",
            color: "#E53E3E",
          }}
        >
          This action cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
