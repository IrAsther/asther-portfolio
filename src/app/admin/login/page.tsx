import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import { sanitizeAdminRedirect } from "@/lib/auth/utils";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Administrator Login | Asther Portfolio",
  description: "Secure administrator sign-in for Asther Irakaza personal digital portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    error?: string;
    status?: string;
  }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const resolvedParams = await searchParams;
  const safeNext = sanitizeAdminRedirect(resolvedParams.next);

  // If already authenticated and authorized as an admin, redirect immediately
  const authStatus = await getAuthenticatedAdmin();
  if (authStatus.isAuthorizedAdmin) {
    redirect(safeNext);
  }

  let initialError: string | null = null;
  if (resolvedParams.error === "unauthorized") {
    initialError =
      "Access denied: Your account is authenticated, but is not authorized as an administrator.";
  } else if (resolvedParams.error === "forbidden") {
    initialError = "Access denied: Administrator permissions required.";
  }

  return (
    <LoginForm
      initialNext={safeNext}
      initialError={initialError}
      initialStatus={resolvedParams.status}
    />
  );
}
