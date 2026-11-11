# Authentication & Session Diagnostic Report

**Project:** Asther Irakaza Portfolio  
**Incident:** `[Proxy Auth] getUser notice: Auth session missing!` & `/admin/content` → `/admin/login` Redirect Loop  
**Date:** November 11, 2026  
**Status:** Root Cause Confirmed & Resolved / Admin Provisioning Action Required  

---

## 1. Executive Summary & Root Cause Confirmation

The terminal warning:
```text
[Proxy Auth] getUser notice: Auth session missing!
GET /admin/login?next=%2Fadmin%2Fcontent 200
```
and the repeated redirection of `/admin/content` to `/admin/login` were caused by two related factors:

### Root Cause 1: Unprovisioned `admin_users` Table (Database State)
A live query against Supabase confirmed:
```json
admin_users: { "data": [], "error": null }
```
The `public.admin_users` table exists with proper schema and RLS policies, but contains **zero administrator records**. 

- By design, the application implements strict dual-stage authentication and authorization:
  1. **Authentication:** Validates email and password via Supabase Auth (`supabase.auth.signInWithPassword`).
  2. **Authorization:** Validates that `authData.user.id` exists in `public.admin_users` (or has `app_metadata.role = 'admin'`).
- If a user signs in but their UUID is absent from `admin_users`, `loginAction` immediately executes `supabase.auth.signOut()` and destroys the session cookies to prevent unauthorized access.
- Consequently, no user could ever retain an active admin session, leaving the browser perpetually unauthenticated.

### Root Cause 2: Log Pollution on Normal Unauthenticated Requests
In `src/proxy.ts` (line 140):
```typescript
const { data, error } = await supabase.auth.getUser();
if (!error && data?.user) {
  user = data.user;
} else if (error) {
  // Previously logged all errors except refresh_token_already_used
  if (error.code !== "refresh_token_already_used") {
    console.warn("[Proxy Auth] getUser notice:", error.message);
  }
}
```
When an unauthenticated visitor or browser requests any `/admin/*` route without cookies, `@supabase/auth-js` returns an `AuthSessionMissingError` (`"Auth session missing!"`). This is **completely expected** for an anonymous request.

Because `console.warn` logged this message on every request:
1. `GET /admin/content` (Unauthenticated) → Proxy logs `[Proxy Auth] getUser notice: Auth session missing!` → Issues HTTP 307 redirect to `/admin/login?next=%2Fadmin%2Fcontent`.
2. `GET /admin/login?next=...` (Unauthenticated) → Proxy runs on `/admin/login` → Logs `[Proxy Auth] getUser notice: Auth session missing!` again → Allows page render (HTTP 200).
3. Browser favicon, prefetch, or React dev re-render repeated this cycle, giving the false appearance of an active auth loop or crash.

---

## 2. Comprehensive 10-Point Technical Audit

### 1. `src/proxy.ts` and Route Matcher
- **Matcher:** `config = { matcher: ["/admin/:path*"] }`.
- Correctly targets all administrative subpaths (`/admin`, `/admin/content`, `/admin/login`, etc.) while ignoring static assets and public routes (`/`, `/about`, `/projects`, `/_next`).
- Server Action requests (`next-action` header) are exempted from raw HTTP 307 redirects to allow Server Actions to return serializable error structures rather than throwing HTML response exceptions in Next.js.

### 2. Supabase Server and Browser Client Configuration
- **Server Client (`src/lib/supabase/server.ts`):** Implements `@supabase/ssr` `createServerClient` using Next.js 16 `cookies()` API. Handles `getAll()` and `setAll()` safely.
- **Browser Client (`src/lib/supabase/client.ts`):** Implements `createBrowserClient` with public URL and anon key.
- **Service Role Client (`src/lib/supabase/admin.ts`):** Isolated to server-side background tasks, requiring `SUPABASE_SERVICE_ROLE_KEY`. Never exposed to client bundles.

### 3. Login Server Actions and Callback Handling
- `loginAction` (`src/lib/auth/actions.ts`):
  1. Validates input formatting.
  2. Calls `supabase.auth.signInWithPassword({ email, password })`.
  3. Verifies `admin_users` record for the authenticated UUID.
  4. Calls `supabase.auth.signOut()` if the user is not in `admin_users`.
  5. Uses `redirect(safeDestination)` outside of `try/catch` to respect Next.js redirect control flow.

### 4. Auth Cookie Writing & Persistence
- When `signInWithPassword` succeeds, `@supabase/ssr` writes standard auth cookies:
  - Cookie format: `sb-<project-ref>-auth-token` (and chunks if payload exceeds size limit).
  - Next.js Server Actions automatically serialize these cookies into the response headers.

### 5. Proxy Cookie Updates & Response Propagation
- In `src/proxy.ts`, `setAll(cookiesToSet)` updates:
  - `request.cookies` (including handling expirations/deletions).
  - `requestHeaders.set("cookie", ...)` so downstream Server Components receive updated tokens.
  - `response.cookies.set(cookie)` so the browser receives updated tokens.
  - Redirect responses copy all cookies: `response.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c))`.

### 6. Cookie Security Attributes
- Inherited from `@supabase/ssr` defaults:
  - `Path`: `/`
  - `SameSite`: `lax`
  - `Secure`: enforced in production (HTTPS)
  - `Max-Age`: 34,560,000 seconds (400 days) for refresh token

### 7. Competing Supabase Clients (Single-Use Token Race Elimination)
- `getAuthenticatedAdmin()` in `src/lib/auth/server.ts` uses a **Fast Path**:
  - Reads `x-admin-auth-verified`, `x-admin-user-id`, `x-admin-user-email`, and `x-admin-user-role` propagated by `proxy.ts`.
  - Does NOT initiate a second `supabase.auth.getUser()` network request during Server Component rendering.
  - This guarantees only one token refresh occurs per request lifecycle, eliminating the `refresh_token_already_used` race condition.

### 8. Protected Routes & Redirect Verification
- **Unauthenticated visitor → `/admin/content`:** Redirects cleanly to `/admin/login?next=%2Fadmin%2Fcontent`.
- **Authenticated admin → `/admin/login`:** Redirects to `/admin` (or `next` query parameter).
- **Authenticated non-admin → `/admin/content`:** Access denied (403 forbidden screen).
- **Explicit logout:** Clears cookies and redirects to `/admin/login?status=logged-out` without auto-redirect loop.

### 9. Cause of Repeated Login Requests
- The repeated entries in the terminal are caused by the combination of:
  - Initial direct visit to `/admin/content` (Redirect).
  - Subsequent visit to `/admin/login` (Render 200).
  - Dev server browser prefetching and fast refresh re-evaluating route handlers.
- With the noisy log suppressed, unauthenticated visits proceed cleanly.

### 10. Refresh Token Race Fix Integrity
- Prefetch requests (`next-router-prefetch: 1` or `purpose: prefetch`) check for cookie existence without triggering token consumption (`getUser()`), protecting single-use Supabase refresh tokens from concurrent exhaustion.

---

## 3. Code Modifications Applied

### File: `src/proxy.ts`
Updated the error logger to distinguish between expected anonymous states and real authentication anomalies:

```typescript
// src/proxy.ts (lines 137-147)
} else if (error) {
  // Safe logging for debugging: suppress expected unauthenticated state to avoid log pollution
  const isExpectedNotice =
    error.code === "refresh_token_already_used" ||
    error.message === "Auth session missing!" ||
    error.name === "AuthSessionMissingError";

  if (!isExpectedNotice) {
    console.warn("[Proxy Auth] getUser notice:", error.message);
  }
}
```

---

## 4. Administrator Provisioning Instructions (Action Required)

Because authentication requires an entry in `public.admin_users` and no accounts currently exist in the database, follow these steps to provision an administrator:

### Option A: Via Supabase Web Dashboard (Recommended)

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw](https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw).
2. Navigate to **Authentication** → **Users**.
3. Click **Add user** → **Create user**.
   - Enter your email and a secure password.
   - Confirm the user is created and copy the **User UID** (UUID format).
4. Navigate to the **SQL Editor** tab in Supabase.
5. Execute the following SQL statement (replacing the UUID):
   ```sql
   INSERT INTO public.admin_users (id, role)
   VALUES ('<PASTE-USER-UID-HERE>', 'admin')
   ON CONFLICT (id) DO NOTHING;
   ```
6. Alternatively, you can grant the role via user metadata in the SQL Editor:
   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
   WHERE email = '<YOUR-ADMIN-EMAIL>';
   ```

### Option B: Optional Service Role Key in `.env.local`
If server-side user management or migration scripts require `createAdminClient()`, add your secret service role key to `.env.local`:
```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
```
*(Find this in Supabase Dashboard → Project Settings → API → `service_role` secret).*

---

## 5. Security & Architecture Verification

- **Access Controls Intact:** Authentication is never bypassed; unauthenticated users cannot access `/admin/*`.
- **Header Spoofing Prevention:** Incoming `x-admin-*` headers are stripped in `proxy.ts` before downstream handlers execute.
- **Row Level Security (RLS):** All Supabase tables (`projects`, `applications`, `skill_categories`, `media_assets`, `admin_users`) enforce RLS using `public.is_admin()`.
- **Zero Token Leakage:** No credentials, tokens, or passwords are logged in error messages or sent to the browser.
- **Production Build:** `npm run lint` (0 errors) and `npm run build` (Turbopack, Next.js 16.3.5) succeed with exit code 0.

