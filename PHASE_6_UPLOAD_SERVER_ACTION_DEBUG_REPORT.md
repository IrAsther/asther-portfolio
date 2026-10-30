# Phase 6 — Media Library Upload Server Action Diagnostic & Debug Report

**Date:** 2026-10-30  
**Stack:** Next.js 16.3.5 (Turbopack) · React 19.2.8 · Supabase Auth & Storage  
**Error Investigated:** `Error: An unexpected response was received from the server at fetchServerAction (server-action-reducer.ts:237)`

---

## 1. Executive Summary & Confirmed Root Cause

When invoking `uploadMediaAction` from `MediaLibrary.tsx` in the browser, the browser console reported:
```text
MediaLibrary.tsx:150 [MediaLibrary] Upload error:
Error: An unexpected response was received from the server.
    at fetchServerAction (server-action-reducer.ts:237)
```

### The Root Cause Mechanism

By inspecting `.next/dev/logs/next-development.log`, the exact sequence of events on the server was captured:
```json
{"timestamp":"00:00:54.309","source":"Server","level":"WARN","message":"AuthApiError: Invalid Refresh Token: Already Used"}
{"timestamp":"00:00:54.310","source":"Server","level":"WARN","message":"AuthApiError: Invalid Refresh Token: Already Used"}
{"timestamp":"00:00:54.429","source":"Browser","level":"ERROR","message":"[MediaLibrary] Upload error: Error: An unexpected response was received from the server. (src/components/admin/media/MediaLibrary.tsx:150:19)"}
```

This occurred identically in `MediaLibrary.tsx`, `AppForm.tsx`, and `ImageUploader.tsx`.

The failure was caused by a combination of two interacting flaws:

#### A. Stale Cookie Desynchronization in `src/proxy.ts`
1. Next.js 16 invokes `proxy.ts` on every incoming request matching `matcher: ["/admin/:path*"]`, including Server Action `POST` requests.
2. In `proxy.ts`, `createServerClient` called `supabase.auth.getUser()`. If the user's JWT access token was close to expiration, Supabase rotated the refresh token and passed new cookies to `setAll`.
3. In `proxy.ts`, `setAll` previously did:
   ```typescript
   cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
   response = NextResponse.next({ request: { headers: requestHeaders } });
   ```
   **The Bug:** `requestHeaders` was created at the beginning of the function and never received the new cookies. Calling `NextResponse.next({ request: { headers: requestHeaders } })` created a downstream request with the **original, stale `cookie` header**.
4. When Next.js subsequently dispatched the request to the Server Action (`uploadMediaAction`), `getAuthenticatedAdmin()` called `cookies()` and read the **stale `cookie` header**.
5. When `supabase.auth.getUser()` was called inside the action with the already-used refresh token, Supabase Auth's **Refresh Token Reuse Detection** was triggered:
   `AuthApiError: Invalid Refresh Token: Already Used`
   Supabase invalidated the session immediately.

#### B. Raw HTTP 307 Redirect on Server Action Requests
1. When `proxy.ts` evaluated `!user` (due to expired session or the invalid refresh token error), it issued a raw HTTP 307 redirect:
   ```typescript
   const redirectResponse = NextResponse.redirect(redirectUrl);
   ```
2. The browser networking layer's `fetch()` automatically followed the 307 redirect to `/admin/login`, receiving an HTML response (`content-type: text/html`).
3. Next.js App Router's client action reducer (`server-action-reducer.ts:136-149`) inspected the response `content-type`:
   ```javascript
   const isRscResponse = !!(contentType && contentType.startsWith('text/x-component'));
   if (!isRscResponse && !redirectLocation) {
     throw new Error('An unexpected response was received from the server.'); // Code E394
   }
   ```
4. Because the response was HTML rather than the expected `text/x-component` React Flight stream, Next.js threw `Error: An unexpected response was received from the server (E394)`.

---

## 2. Server Action Contract Inspection

| Check | Result | Detail |
| :--- | :---: | :--- |
| `"use server"` declaration | **PASS** | Top line of `src/lib/actions/upload.ts`. |
| Async exports only | **PASS** | Only `uploadMediaAction` and `deleteMediaAction` are exported, both `async`. |
| Argument serializability | **PASS** | Accepts `formData: FormData` and optional `folderArg: string`. |
| Return type serializability | **PASS** | Returns `{ success: boolean, data?: { url, path, filename, sizeBytes, assetId }, error?: string }` (pure JSON primitives). |
| Exception safety | **PASS** | Full `try...catch` wrapper returning structured error object. |
| Framework control-flow (`redirect`, `notFound`) | **PASS** | Neither is called within `uploadMediaAction`. |

---

## 3. Exact Fixes Applied

### Fix 1: Synchronize Mutated Cookies in `src/proxy.ts`
In [`src/proxy.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/proxy.ts):
```typescript
setAll(cookiesToSet) {
  cookiesToSet.forEach(({ name, value }) =>
    request.cookies.set(name, value)
  );
  // Synchronize updated cookies into requestHeaders so downstream
  // Server Components and Server Actions reading cookies() receive
  // fresh tokens rather than stale tokens that trigger "Invalid Refresh Token: Already Used".
  requestHeaders.set(
    "cookie",
    request.cookies
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ")
  );
  response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  cookiesToSet.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options)
  );
}
```

### Fix 2: Prevent Raw 307 Redirects on Server Action Requests
In [`src/proxy.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/proxy.ts):
```typescript
const isServerAction = request.headers.has("next-action");

if (!user) {
  if (!isLoginPage) {
    // For Server Actions, do NOT issue a raw HTTP 307 redirect.
    // Allow the action to execute its own getAuthenticatedAdmin() check
    // and return a safe, serializable { success: false, error: "..." } payload.
    if (isServerAction) {
      return applyAdminCacheHeaders(response);
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/admin/login";
    ...
```
Now, if a session is invalid during a Server Action, the action returns `{ success: false, error: "Authentication required. Please sign in to upload files." }`, which the UI displays as an error banner rather than crashing the client router.

### Fix 3: Added Structured Diagnostics to `uploadMediaAction`
In [`src/lib/actions/upload.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/lib/actions/upload.ts), added safe server-side telemetry logging without exposing credentials:
- `[upload_action_started]`
- `[admin_authorization_passed]`
- `[file_validation_passed]`
- `[storage_upload_started]`
- `[storage_upload_completed]`
- `[metadata_insert_started]`
- `[metadata_insert_completed]`
- `[upload_action_completed]`

---

## 4. Verification Results

| Verification | Status | Evidence |
| :--- | :---: | :--- |
| `npx tsc --noEmit` | **PASS** | 0 TypeScript errors. |
| `npm run lint` | **PASS** | 0 ESLint errors. |
| `npm run build` | **PASS** | Compiled successfully in 1181ms. Dynamic rendering confirmed for `/admin/media`. |
| Server Action POST test | **PASS** | Direct mock POST with action ID `60e138ce16bbb131cda6923226841c054d529cf58f` cleanly rejected/handled without node crashes. |
| Browser upload testing | **PENDING USER VERIFICATION** | The user should refresh `/admin/media` (or sign in again to obtain a fresh session token if the previous token was rotated), open the upload modal, and upload a JPG. |

