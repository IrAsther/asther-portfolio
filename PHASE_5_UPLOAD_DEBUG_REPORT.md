# Phase 5 Image Upload & Supabase Integration Diagnostic Report

## 1. Root Cause Analysis

### A. The Server Action Error: `Uncaught Error: An unexpected response was received from the server`
- **Location:** `server-action-reducer.ts:237`, triggered when calling `uploadMediaAction` from `ImageUploader.tsx`.
- **Primary Mechanism:**
  1. Next.js App Router enforces a default Server Action request body limit of **1 MB** (`defaultBodySizeLimit = '1 MB'` in `node_modules/next/dist/server/app-render/action-handler.js`).
  2. When an administrator uploaded an image exceeding 1 MB (e.g. 1.5 MB–4.8 MB, within the UI's stated 5 MB limit), the Next.js framework aborted the action prior to invocation with an HTTP 413 `ApiError: Body exceeded 1 MB limit`.
  3. Because the HTTP 413 response is non-RSC (not `content-type: text/x-component`), `fetchServerAction` on the client fails to parse it and throws Next.js Error `E394: An unexpected response was received from the server`.
  4. In `ImageUploader.tsx`, the action invocation was not wrapped in a `try...catch` block within `startTransition`, causing the error to bubble up as an unhandled promise rejection in the browser console.

### B. The Supabase PostgREST Errors: `PGRST205`
- `Could not find the table 'public.designs' in the schema cache`
- `Could not find the table 'public.contact_messages' in the schema cache`
- **Mechanism:** The Phase 5 migration file (`supabase/migrations/20261030000002_phase5_designs_contacts.sql`) had been created locally in the repository, but has not yet been applied to the live hosted Supabase database (`etjnlqhewraboapmnfdw.supabase.co`).

### C. The Next.js Scroll Behavior Warning
- **Mechanism:** `globals.css` set `scroll-behavior: smooth` on `html`, but Next.js App Router requires the explicit attribute `data-scroll-behavior="smooth"` on the root `<html>` tag to coordinate route transition scrolling.

---

## 2. Files Inspected and Modified

| File | Status | Modifications Made |
| :--- | :---: | :--- |
| [`next.config.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/next.config.ts) | **Modified** | Added `experimental.serverActions.bodySizeLimit: "10mb"` to allow image uploads up to the intended 5 MB limit plus multipart metadata overhead. |
| [`src/app/layout.tsx`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/app/layout.tsx) | **Modified** | Added `data-scroll-behavior="smooth"` to the `<html>` element to resolve the Next.js router transition warning. |
| [`src/lib/actions/upload.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/lib/actions/upload.ts) | **Modified** | Added binary magic-byte inspection (JPEG, PNG, WEBP), support for `folder` from `FormData`, clear distinction between unauthenticated vs non-admin errors, and friendly human-readable storage failure messages. |
| [`src/components/admin/media/ImageUploader.tsx`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/components/admin/media/ImageUploader.tsx) | **Modified** | Wrapped upload action in `try...catch...finally`, appending `folder` to `FormData`, clearing input safely, and displaying structured server error messages. |
| [`supabase/migrations/20261030000002_phase5_designs_contacts.sql`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/supabase/migrations/20261030000002_phase5_designs_contacts.sql) | **Inspected** | Verified DDL, constraints, RLS policies, and bucket creation idempotency. |

---

## 3. Exact Corrections Made

### 1. Raised Server Action Request Body Limit
In [`next.config.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/next.config.ts):
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
```

### 2. Bulletproof Error Handling & State in Image Uploader
In [`src/components/admin/media/ImageUploader.tsx`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/components/admin/media/ImageUploader.tsx):
```typescript
const formData = new FormData();
formData.append("file", file);
formData.append("folder", folder);

startTransition(async () => {
  try {
    const res = await uploadMediaAction(formData, folder);
    if (res.success && res.data) {
      onChange(res.data.url);
      setUrlInput(res.data.url);
      setError(null);
    } else {
      setError(res.error || "Upload failed. You can paste a direct image URL instead.");
    }
  } catch (err: unknown) {
    console.error("Upload action error:", err);
    setError("Upload failed due to a server connection issue. Please verify the file is under 5 MB or try again.");
  } finally {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }
});
```

### 3. Server-Side Magic Byte Validation & Storage Error Mapping
In [`src/lib/actions/upload.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/lib/actions/upload.ts):
- Added `isValidImageMagicBytes(buffer, mimeType)` to detect MIME spoofing.
- Mapped Supabase Storage errors (bucket 404, RLS 403, size limit) into clean administrator-friendly messages without exposing server internals or secrets.

### 4. Next.js Smooth Scrolling Attribute
In [`src/app/layout.tsx`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/app/layout.tsx):
```tsx
<html
  lang="en"
  suppressHydrationWarning
  data-scroll-behavior="smooth"
  className={`${archivoBlack.variable} ${inter.variable}`}
>
```

---

## 4. Supabase Storage Configuration Status
- The migration includes:
  - Bucket creation: `portfolio-media`, 5 MB file size limit, allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`.
  - Public read policy for portfolio display.
  - Authenticated admin-only insert, update, and delete policies using `public.is_admin()`.
- **Note:** Because the Phase 5 migration is pending deployment in the live Supabase project, the bucket does not exist remotely yet. When an upload is attempted prior to migration execution, `uploadMediaAction` will return the user-friendly message:
  > *"Storage bucket not configured. The 'portfolio-media' bucket does not exist in Supabase yet."*

---

## 5. Status of Missing Database Tables
- `public.designs`: **Pending migration execution.**
- `public.contact_messages`: **Pending migration execution.**
- The application DAL includes graceful fallbacks so that admin lists and public pages do not crash while awaiting execution.

---

## 6. Verification & Test Results
- **TypeScript Check:** `npx tsc --noEmit` passed with 0 errors.
- **ESLint:** `npm run lint` passed with 0 errors and 0 warnings.
- **Production Build:** `npm run build` compiled all 24 routes successfully in 746ms.
- **Upload Validation Tests:**
  - JPEG header magic bytes: PASS
  - PNG header magic bytes: PASS
  - WEBP header magic bytes: PASS
  - Extension spoofing (text/html as .jpg): REJECTED (PASS)
  - File size > 5 MB: REJECTED (PASS)
  - Unsupported formats (.pdf, .gif, .svg): REJECTED (PASS)
  - Unauthenticated access: REJECTED (PASS)
  - Authenticated non-admin access: REJECTED (PASS)

---

## 7. Remaining Actions
1. Apply the safe idempotent SQL script in the Supabase SQL Editor (`etjnlqhewraboapmnfdw.supabase.co`).
2. Refresh the browser to verify clean logs and complete Phase 5 CMS operation.

