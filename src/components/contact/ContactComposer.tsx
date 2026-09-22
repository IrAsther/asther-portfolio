"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { contactConfig } from "@/data/contact";
import styles from "./ContactComposer.module.css";

export function ContactComposer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    const subject = encodeURIComponent(`Portfolio Inquiry — ${name.trim()}`);
    const body = encodeURIComponent(
      `Hi Asther,\n\n${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`
    );
    window.location.href = `mailto:${contactConfig.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="contact-name" className={styles.label}>Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-email" className={styles.label}>Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="contact-message" className={styles.label}>Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          placeholder="Tell me about your project or idea..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
        />
      </div>

      <button type="submit" className={styles.submitBtn}>
        <Send size={15} aria-hidden="true" />
        <span>Send Message</span>
      </button>

      <p className={styles.hint}>
        Opens your default email app with this message pre-filled.
      </p>
    </form>
  );
}
