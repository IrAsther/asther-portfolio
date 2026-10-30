"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import {
  Search,
  MailOpen,
  Reply,
  Archive,
  Trash2,
  Inbox,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { AdminModal } from "@/components/admin/ui/AdminModal";
import { Button } from "@/components/ui/Button";
import { AdminContactMessage } from "@/types/admin";
import {
  archiveMessageAction,
  restoreMessageAction,
  deleteMessageAction,
} from "@/lib/actions/contact";
import styles from "./MessageList.module.css";

interface MessageListProps {
  initialMessages: AdminContactMessage[];
}

export function MessageList({ initialMessages }: MessageListProps) {
  const [messages, setMessages] = useState<AdminContactMessage[]>(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read" | "replied" | "archived">("all");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [messageToDelete, setMessageToDelete] = useState<AdminContactMessage | null>(null);
  const [isPending, startTransition] = useTransition();

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.isRead && m.status !== "archived").length;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        m.senderName.toLowerCase().includes(q) ||
        m.senderEmail.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);

      if (statusFilter === "all") return matchesSearch;
      return matchesSearch && m.status === statusFilter;
    });
  }, [messages, searchQuery, statusFilter]);

  const handleArchive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await archiveMessageAction(id);
        if (res.success) {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "archived" } : m))
          );
          setFeedback({ type: "success", message: "Message archived." });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to archive." });
        }
      } catch (err: unknown) {
        console.error("[MessageList] Archive error:", err);
        setFeedback({ type: "error", message: "Failed to archive message. Please try again." });
      }
    });
  };

  const handleRestore = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await restoreMessageAction(id);
        if (res.success) {
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
          );
          setFeedback({ type: "success", message: "Message restored to inbox." });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to restore." });
        }
      } catch (err: unknown) {
        console.error("[MessageList] Restore error:", err);
        setFeedback({ type: "error", message: "Failed to restore message. Please try again." });
      }
    });
  };

  const confirmDelete = () => {
    if (!messageToDelete) return;
    startTransition(async () => {
      try {
        const res = await deleteMessageAction(messageToDelete.id);
        if (res.success) {
          setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
          setFeedback({ type: "success", message: "Message deleted permanently." });
        } else {
          setFeedback({ type: "error", message: res.error || "Failed to delete message." });
        }
      } catch (err: unknown) {
        console.error("[MessageList] Delete error:", err);
        setFeedback({ type: "error", message: "Failed to delete message. Please try again." });
      } finally {
        setMessageToDelete(null);
      }
    });
  };

  const formatReceivedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.container}>
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

      {/* Action / Filter bar */}
      <div className={styles.actionBar}>
        <div className={styles.searchFilterRow}>
          <div className={styles.searchWrap}>
            <Search size={15} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search sender, email, subject, text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search messages"
            />
          </div>

          <div className={styles.statusFilters} role="tablist" aria-label="Status filters">
            {(
              [
                { id: "all", label: "All" },
                { id: "new", label: `Unread (${unreadCount})` },
                { id: "read", label: "Read" },
                { id: "replied", label: "Replied" },
                { id: "archived", label: "Archived" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={statusFilter === tab.id}
                className={`${styles.filterTab} ${
                  statusFilter === tab.id ? styles.filterTabActive : ""
                }`}
                onClick={() => setStatusFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <span className={styles.countText}>
          {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Message List Table / Cards */}
      {filteredMessages.length === 0 ? (
        <div className={styles.emptyState}>
          <Inbox size={40} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No messages found</h3>
          <p className={styles.emptyText}>
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or filter selection."
              : "Your inbox is empty. Inquiries submitted via the public contact form will appear here."}
          </p>
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th} style={{ width: "36px" }}></th>
                  <th className={styles.th}>Sender</th>
                  <th className={styles.th}>Subject & Snippet</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th} style={{ textAlign: "right" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => {
                  const isNew = msg.status === "new" || !msg.isRead;

                  return (
                    <tr
                      key={msg.id}
                      className={`${styles.tr} ${isNew ? styles.trUnread : ""}`}
                    >
                      {/* Read indicator */}
                      <td className={styles.td}>
                        <div className={styles.iconCell} title={isNew ? "Unread" : msg.status === "replied" ? "Replied" : "Read"}>
                          {isNew ? (
                            <span className={styles.unreadDot} />
                          ) : msg.status === "replied" ? (
                            <Reply size={14} className={styles.repliedIcon} />
                          ) : (
                            <MailOpen size={14} className={styles.readIcon} />
                          )}
                        </div>
                      </td>

                      {/* Sender */}
                      <td className={styles.td}>
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          className={styles.senderLink}
                        >
                          <span className={styles.senderName}>{msg.senderName}</span>
                          <span className={styles.senderEmail}>{msg.senderEmail}</span>
                        </Link>
                      </td>

                      {/* Subject + Snippet */}
                      <td className={styles.td}>
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          className={styles.subjectLink}
                        >
                          <span className={styles.msgSubject}>{msg.subject}</span>
                          <span className={styles.msgSnippet}>
                            {msg.message.length > 90
                              ? `${msg.message.substring(0, 90)}...`
                              : msg.message}
                          </span>
                        </Link>
                      </td>

                      {/* Status */}
                      <td className={styles.td}>
                        <span
                          className={`${styles.statusBadge} ${
                            msg.status === "new"
                              ? styles.statusNew
                              : msg.status === "replied"
                              ? styles.statusReplied
                              : msg.status === "archived"
                              ? styles.statusArchived
                              : styles.statusRead
                          }`}
                        >
                          {msg.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Date */}
                      <td className={styles.td}>
                        <span className={styles.dateText}>
                          {formatReceivedDate(msg.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={styles.td} style={{ textAlign: "right" }}>
                        <div className={styles.actionsCell}>
                          <Link
                            href={`/admin/messages/${msg.id}`}
                            className={styles.viewBtn}
                            title="Open Message"
                          >
                            <span>Open</span>
                            <ArrowRight size={13} />
                          </Link>

                          {msg.status === "archived" ? (
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={(e) => handleRestore(msg.id, e)}
                              disabled={isPending}
                              title="Restore to inbox"
                              aria-label="Restore message"
                            >
                              <RotateCcw size={14} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={(e) => handleArchive(msg.id, e)}
                              disabled={isPending}
                              title="Archive message"
                              aria-label="Archive message"
                            >
                              <Archive size={14} />
                            </button>
                          )}

                          <button
                            type="button"
                            className={`${styles.iconBtn} ${styles.deleteBtn}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageToDelete(msg);
                            }}
                            disabled={isPending}
                            title="Delete permanently"
                            aria-label="Delete message"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AdminModal
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        title="Confirm Message Deletion"
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMessageToDelete(null)}
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
              Delete Permanently
            </Button>
          </>
        }
      >
        <p>
          Are you sure you want to permanently delete the message from{" "}
          <strong>{messageToDelete?.senderName}</strong> regarding &quot;
          {messageToDelete?.subject}&quot;?
        </p>
        <p
          style={{
            marginTop: "8px",
            fontSize: "0.8125rem",
            color: "var(--color-text-subtle)",
          }}
        >
          This action removes the record from Supabase immediately and cannot be undone.
        </p>
      </AdminModal>
    </div>
  );
}
