# Resume PDF Upload MIME Type Fix & Storage Architecture Report

**Project:** Asther Irakaza Portfolio  
**Incident:** `Failed to upload resume to storage: mime type application/pdf is not supported`  
**Date:** November 11, 2026  
**Status:** Code Refactored & Validated / Storage Migration Prepared  

---

## 1. Executive Summary & Root Cause Analysis

### The Error
When an administrator attempts to upload a PDF resume in `/admin/content`, the upload operation fails with:
```text
Failed to upload resume to storage: mime type application/pdf is not supported
```

### Live Reproduction & Root Cause
A probe executed against the Supabase Storage endpoint confirmed the exact error:
```json
{
  "statusCode": "415",
  "code": "InvalidMimeType",
  "message": "mime type application/pdf is not supported"
}
```

Investigation traced this to two distinct issues:

#### 1. Storage Bucket Configuration (Root Cause)
In `supabase/migrations/20261030000002_phase5_designs_contacts.sql` (lines 114–122), the centralized storage bucket `portfolio-media` was defined as:
```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880, -- 5 MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'] -- Images only!
)
ON CONFLICT (id) DO NOTHING;
```
1. `allowed_mime_types` only listed image types; `application/pdf` was **completely excluded**.
2. `file_size_limit` was set to `5242880` (5 MB) instead of the required **10 MB** (10,485,760 bytes).

Supabase Storage validates MIME types and file sizes at the storage gateway **before** checking RLS or invoking handlers. Because `application/pdf` was not in the bucket whitelist, every PDF upload was rejected immediately with HTTP 415.

#### 2. Server Action Vulnerabilities in `src/lib/actions/bio-resume.ts`
Beyond the bucket configuration, the previous `uploadResumeAction` had three critical architectural flaws:
1. **Premature Deletion on Replacement:** The Server Action removed the previous resume file from storage *before* attempting to upload the new file. If the new upload failed (e.g. invalid MIME, network timeout, or size limit), the previous resume was already gone, resulting in broken public download links.
2. **Weak Format Check:** `if (mimeType !== "application/pdf" && !originalName.toLowerCase().endsWith(".pdf"))` used `&&` instead of `||`, allowing non-PDF files with spoofed client MIME types to slip past the extension check.
3. **No Rollback on Metadata Failure:** If `site_settings` database update failed after upload, the newly uploaded storage file was left orphaned.

---

## 2. Supabase Storage Bucket Configuration Fix

A safe, non-destructive migration has been created:
**Path:** `supabase/migrations/20261111000001_fix_resume_storage_bucket.sql`

```sql
-- 1. Update existing 'portfolio-media' bucket settings
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  file_size_limit = 10485760 -- 10 MB (10 * 1024 * 1024 bytes)
WHERE id = 'portfolio-media';

-- 2. Idempotent insert if the bucket does not exist yet
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  file_size_limit = 10485760;
```

### Applying the Configuration Fix

#### Option A: Supabase Web Dashboard (1-Click GUI)
1. Go to your Supabase Dashboard: [https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw](https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw)
2. In the left navigation, click **Storage** → **Buckets**.
3. Locate the `portfolio-media` bucket and click the three dots (`...`) → **Edit bucket**.
4. In **Allowed MIME types**, add `application/pdf` (so it includes: `image/jpeg, image/jpg, image/png, image/webp, application/pdf`).
5. In **Maximum file size**, update the value to `10 MB` (or `10485760` bytes).
6. Click **Save**.

#### Option B: Supabase SQL Editor
1. In the Supabase Dashboard, click **SQL Editor**.
2. Paste the SQL from `supabase/migrations/20261111000001_fix_resume_storage_bucket.sql`.
3. Click **Run**.

---

## 3. Server Action Refactoring (`src/lib/actions/bio-resume.ts`)

The `uploadResumeAction` has been completely rewritten to follow strict security and atomic replacement disciplines:

### 1. Server-Side Security & Validation
- **Admin Authorization:** Enforced via `getAuthenticatedAdmin()`; unauthorized or anonymous requests return `{ success: false, error: "Access denied..." }`.
- **Extension Enforcement:** Rejects any filename not ending in `.pdf` (case-insensitive).
- **Size Bounds:** Enforces `0 < size <= 10 * 1024 * 1024 bytes`. Empty files or oversized files are rejected with clear messages.
- **Magic-Byte Signature Verification:** Reads the initial 5 bytes of the server buffer and validates `%PDF-` (`0x25 0x50 0x44 0x46 0x2D`). Never trusts client-reported MIME types.
- **Explicit Storage Content-Type:** Hardcoded to `contentType: "application/pdf"`.
- **Filename Sanitization:** Strips directory traversal characters, non-alphanumeric symbols, and ensures a clean `.pdf` ending:
  ```typescript
  const baseName = originalName.slice(0, -4);
  const sanitizedBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_+|_+$/g, "") || "asther_irakaza_cv";
  const storagePath = `resumes/${Date.now()}-${sanitizedBase}.pdf`;
  ```

### 2. Atomic Replacement Discipline (Requirement 4)
The lifecycle now strictly protects existing documents:
```
1. Query current resume metadata -> capture previousStoragePath.
2. Upload NEW PDF to Supabase Storage -> 'resumes/<timestamp>-<name>.pdf'.
   └─ IF upload fails: Abort. Previous resume remains live and untouched.
3. Upsert new metadata in site_settings.
   └─ IF DB fails: Rollback newly uploaded file. Previous resume remains untouched.
4. Insert media_assets catalog record.
5. ONLY AFTER steps 2 and 3 succeed:
   └─ Delete previousStoragePath safely in try/catch.
```

### 3. Safe Deletion (`deleteResumeAction`)
- Storage file removal is safely wrapped in `try/catch` so orphaned references or pre-deleted storage files do not prevent catalog and settings cleanup.

---

## 4. Public Integration Verification

1. **Data Access Layer (`src/lib/data/resume.ts`):**
   - `getResumeData()` queries `site_settings` for `key = 'resume_document'`.
   - Returns typed `ResumeDocumentDTO`: `{ url, storagePath, filename, sizeBytes, uploadedAt, published }`.
   - Only passes `resumeDocument` to the UI if `published === true`.

2. **Public Resume Page (`src/app/resume/page.tsx`):**
   - Has `export const dynamic = "force-dynamic"`.
   - Passes `resumeData.resumeDocument.url` and `published` status to `<ResumeCTA />`.

3. **Public Component (`src/components/resume/ResumeCTA.tsx`):**
   - Renders download button when published:
     ```tsx
     <Button href={resumeUrl} target="_blank" rel="noopener noreferrer" variant="primary">
       <Download size={18} /> Download Resume (PDF)
     </Button>
     ```
   - Displays friendly notice if unpublished or in preparation.

---

## 5. Test Suite & Verification Results

A unit and simulation test suite (`scratch/test_resume_upload_validations.js`) was executed:

| Test # | Scenario | Expected Behavior | Result |
|---|---|---|---|
| 1 | Valid PDF below 10 MB (150 KB) | Passes validation | **PASS** |
| 2 | Valid PDF close to 10 MB (9.5 MB) | Passes validation | **PASS** |
| 3 | Oversized PDF (10.5 MB) | Rejected: exceeds 10 MB limit | **PASS** |
| 4 | Renamed non-PDF (PNG with .pdf extension) | Rejected: magic bytes mismatch (%PDF-) | **PASS** |
| 5 | Corrupted / non-PDF text file | Rejected: invalid PDF signature | **PASS** |
| 6 | Non-.pdf extension (.docx with %PDF- header) | Rejected: must have .pdf extension | **PASS** |
| 7 | Empty file (0 bytes) | Rejected: empty file | **PASS** |
| 8 | Safe Replacement: Upload failure simulation | Previous resume file & DB preserved | **PASS** |
| 9 | Safe Replacement: Upload success simulation | New file active, previous file cleaned | **PASS** |
| 10 | Filename Sanitization | Clean `resumes/asther_irakaza_resume_final_-_2026_1.pdf` | **PASS** |

### Build & Lint Verification
- `npm run lint`: **0 errors, 0 warnings** (Clean).
- `npm run build`: **Compiled successfully** with Turbopack & Next.js 16.3.5. All static and dynamic routes verified.

---

## 6. Files Modified

| File | Changes Made |
|---|---|
| `supabase/migrations/20261111000001_fix_resume_storage_bucket.sql` | Created migration to add `application/pdf` and 10 MB limit to `portfolio-media`. |
| `src/lib/actions/bio-resume.ts` | Refactored `uploadResumeAction` with strict extension check, size bounds, magic bytes, atomic replacement, and rollback. Updated `deleteResumeAction`. |
| `src/components/admin/content/ContentEditor.tsx` | Updated `handleFileSelected` to receive and store `res.data.storagePath`. |
| `scratch/test_resume_upload_validations.js` | Created automated test suite covering all 10 edge cases. |

