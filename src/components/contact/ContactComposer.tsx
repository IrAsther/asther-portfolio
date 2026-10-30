"use client";

import { useState, useTransition } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { submitContactAction } from "@/lib/actions/contact";
import styles from "./ContactComposer.module.css";

export function ContactComposer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    // Client-side quick validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim() || `Portfolio Inquiry from ${trimmedName || "Visitor"}`;
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setStatus("error");
      setErrorMessage("Please complete all required fields before sending.");
      return;
    }

    const formData = new FormData();
    formData.append("sender_name", trimmedName);
    formData.append("sender_email", trimmedEmail);
    formData.append("subject", trimmedSubject);
    formData.append("message", trimmedMessage);
    formData.append("website", honeypot); // honeypot

    startTransition(async () => {
      const res = await submitContactAction(formData);
      if (res.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMessage(res.error || "Failed to deliver message. Please try again or reach out directly.");
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      {/* Success State */}
      {status === "success" && (
        <div
          style={{
            padding: "var(--space-4)",
            backgroundColor: "rgba(1, 96, 90, 0.12)",
            border: "1px solid #01605A",
            borderRadius: "0",
            display: "flex",
            alignItems: "flex-start",
            gap: "var(--space-3)",
            color: "var(--color-text)",
          }}
          role="status"
        >
          <CheckCircle2 size={20} style={{ color: "#01605A", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <strong style={{ display: "block", marginBottom: "4px" }}>
              Message Sent Successfully!
            </strong>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              Thank you for reaching out. Your message has been delivered directly to Asther&apos;s
              inbox. You will receive a reply via your email shortly.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {status === "error" && errorMessage && (
        <div
          style={{
            padding: "var(--space-3) var(--space-4)",
            backgroundColor: "rgba(229, 62, 62, 0.1)",
            border: "1px solid #E53E3E",
            borderRadius: "0",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            color: "#E53E3E",
            fontSize: "0.875rem",
          }}
          role="alert"
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot field (hidden from real users, traps bots) */}
      <div style={{ display: "none" }} aria-hidden="true">
        <label htmlFor="contact-website">Leave this field blank</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>
          Name <span style={{ color: "var(--color-accent)" }}>*</span>
        </label>
        <input
          id="contact-name"
          name="sender_name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.sender_name) {
              setFieldErrors((prev) => ({ ...prev, sender_name: "" }));
            }
          }}
          disabled={isPending}
          className={styles.input}
        />
        {fieldErrors.sender_name && (
          <span style={{ fontSize: "0.75rem", color: "#E53E3E" }}>
            {fieldErrors.sender_name}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>
          Email <span style={{ color: "var(--color-accent)" }}>*</span>
        </label>
        <input
          id="contact-email"
          name="sender_email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.sender_email) {
              setFieldErrors((prev) => ({ ...prev, sender_email: "" }));
            }
          }}
          disabled={isPending}
          className={styles.input}
        />
        {fieldErrors.sender_email && (
          <span style={{ fontSize: "0.75rem", color: "#E53E3E" }}>
            {fieldErrors.sender_email}
          </span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-subject" className={styles.label}>
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Project collaboration, inquiry, or question"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isPending}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>
          Message <span style={{ color: "var(--color-accent)" }}>*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Tell me about your project, idea, or challenge..."
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message) {
              setFieldErrors((prev) => ({ ...prev, message: "" }));
            }
          }}
          disabled={isPending}
          className={styles.textarea}
        />
        {fieldErrors.message && (
          <span style={{ fontSize: "0.75rem", color: "#E53E3E" }}>
            {fieldErrors.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={styles.submitBtn}
        style={{ opacity: isPending ? 0.7 : 1, cursor: isPending ? "wait" : "pointer" }}
      >
        {isPending ? (
          <>
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
            <span>Sending Message...</span>
          </>
        ) : (
          <>
            <Send size={15} aria-hidden="true" />
            <span>Send Message</span>
          </>
        )}
      </button>

      <p className={styles.hint}>
        Delivers directly to Asther&apos;s verified inbox. Replies will be sent to the email
        address provided above.
      </p>
    </form>
  );
}
