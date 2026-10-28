"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { ShieldAlert, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/auth/actions";
import styles from "./AdminAccessDenied.module.css";

interface AdminAccessDeniedProps {
  userEmail?: string | null;
}

export function AdminAccessDenied({ userEmail }: AdminAccessDeniedProps) {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card} role="alert" aria-labelledby="denied-title">
        <div className={styles.iconWrap}>
          <ShieldAlert size={32} aria-hidden="true" />
        </div>

        <div className={styles.statusBadge}>403 — Unauthorized</div>
        <h1 id="denied-title" className={styles.title}>
          Access Denied
        </h1>

        <p className={styles.description}>
          Your credentials authenticated successfully with Supabase, but your
          account is not registered in the portfolio&apos;s authorized administrator directory.
        </p>

        {userEmail && (
          <div className={styles.userBadge}>
            <span>Signed in as:</span>
            <strong>{userEmail}</strong>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isPending}
            className={styles.signOutBtn}
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut size={16} aria-hidden="true" />
                <span>Sign Out & Switch Account</span>
              </>
            )}
          </button>

          <Link href="/" className={styles.homeLink}>
            <ArrowLeft size={16} aria-hidden="true" style={{ marginRight: "0.5rem" }} />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
