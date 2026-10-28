"use client";

import React, { useState, useActionState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { loginAction, type AuthActionState } from "@/lib/auth/actions";
import styles from "./login.module.css";

interface LoginFormProps {
  initialNext?: string;
  initialError?: string | null;
  initialStatus?: string | null;
}

export function LoginForm({
  initialNext = "/admin",
  initialError,
  initialStatus,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const initialState: AuthActionState = {
    error: initialError ?? null,
    message: initialStatus === "logged-out" ? "You have been successfully signed out." : null,
  };

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className={styles.loginViewport}>
      <div className={styles.loginCard}>
        <div className={styles.cardHeaderAccent} aria-hidden="true" />

        <div className={styles.brandHeader}>
          <div className={styles.logoWrap}>
            <Image
              src="/Asther_logo.png"
              alt="Asther Monogram"
              width={38}
              height={38}
              priority
            />
          </div>
          <div className={styles.brandBadge}>
            <ShieldCheck size={13} aria-hidden="true" />
            <span>Control Panel</span>
          </div>
          <h1 className={styles.title}>Administrator Access</h1>
          <p className={styles.subtitle}>
            Enter your authorized credentials to manage portfolio content.
          </p>
        </div>

        {/* Status / Error Notifications */}
        {state.error && (
          <div className={`${styles.alertBanner} ${styles.alertError}`} role="alert">
            <AlertCircle size={18} className={styles.alertIcon} aria-hidden="true" />
            <div>{state.error}</div>
          </div>
        )}

        {!state.error && state.message && (
          <div className={`${styles.alertBanner} ${styles.alertSuccess}`} role="status">
            <CheckCircle2 size={18} className={styles.alertIcon} aria-hidden="true" />
            <div>{state.message}</div>
          </div>
        )}

        <form action={formAction} className={styles.form} noValidate>
          {/* Safe Return Path Target */}
          <input type="hidden" name="next" value={initialNext} />

          {/* Email Address */}
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Administrator Email
            </label>
            <div className={styles.inputWrap}>
              <Mail size={16} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                placeholder="admin@example.com"
                className={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrap}>
              <Lock size={16} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isPending}
                placeholder="••••••••••••"
                className={styles.input}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
                className={styles.togglePasswordBtn}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={styles.submitBtn}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={16} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <div className={styles.footerArea}>
          <p className={styles.securityNotice}>
            Protected area &bull; Personal portfolio administration only
          </p>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
