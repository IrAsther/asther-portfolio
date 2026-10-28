/**
 * Authentication and Redirection Utilities — Asther Portfolio
 *
 * Enforces safe internal redirection to prevent open-redirect vulnerabilities.
 */

/**
 * Validates and sanitizes a return target path.
 *
 * Rules:
 * 1. Must be a non-empty string.
 * 2. Must start with '/admin' (or relative path starting with single '/').
 * 3. Must NOT start with '//' or '/\' (prevents protocol-relative external redirects).
 * 4. Must NOT contain colons ':' (prevents javascript:, data:, https: schemes).
 * 5. Must NOT point back to the login page itself (prevents redirect loops).
 *
 * Falls back to '/admin' if any check fails.
 */
export function sanitizeAdminRedirect(url: string | null | undefined): string {
  if (!url || typeof url !== "string") {
    return "/admin";
  }

  const trimmed = url.trim();

  // Guard against protocol-relative redirects or path traversal characters
  if (
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    trimmed.includes("\\") ||
    trimmed.includes(":")
  ) {
    return "/admin";
  }

  // Must start with /admin to stay strictly within the admin area
  if (!trimmed.startsWith("/admin")) {
    return "/admin";
  }

  // Prevent redirect loop back to login
  if (
    trimmed === "/admin/login" ||
    trimmed.startsWith("/admin/login?") ||
    trimmed.startsWith("/admin/login/")
  ) {
    return "/admin";
  }

  return trimmed;
}
