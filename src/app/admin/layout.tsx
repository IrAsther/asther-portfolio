import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/layout/AdminShell";
import { getAuthenticatedAdmin } from "@/lib/auth/server";
import { AdminAccessDenied } from "@/components/admin/auth/AdminAccessDenied";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Admin Dashboard | Asther Portfolio",
  description: "Central control panel for Asther Irakaza personal digital portfolio.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const currentPath = headerList.get("x-admin-pathname") || "";
  const isLoginPage = currentPath === "/admin/login";

  // Login page renders cleanly without the admin layout chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Enforce server-side authorization if Supabase is configured
  if (isSupabaseConfigured()) {
    const authStatus = await getAuthenticatedAdmin();

    // 1. Unauthenticated -> redirect to login
    if (!authStatus.isAuthenticated) {
      redirect(`/admin/login?next=${encodeURIComponent(currentPath || "/admin")}`);
    }

    // 2. Authenticated but NOT authorized administrator -> 403 Forbidden screen
    if (!authStatus.isAuthorizedAdmin) {
      return <AdminAccessDenied userEmail={authStatus.user?.email} />;
    }

    // 3. Authenticated and verified administrator
    return <AdminShell adminUser={authStatus.user}>{children}</AdminShell>;
  }

  // Development/unconfigured fallback
  return <AdminShell>{children}</AdminShell>;
}
