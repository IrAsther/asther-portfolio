# Phase 5 Implementation Report
**Design CMS, Universal Media Upload, and Contact Message Management**  
**Date:** 2026-10-30  
**Project:** Asther Irakaza — Personal Digital Portfolio (`asther-portfolio`)  
**Stack:** Next.js 16 (App Router), TypeScript, Supabase (PostgreSQL, Auth, Storage, RLS), CSS Modules  

---

## 1. Architecture Overview

Phase 5 extends the portfolio CMS architecture with three primary production modules:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Asther Portfolio CMS                             │
└────────────────────────────────────────────────────────────────────────┘
          │                                           │
  [Public Visitors]                           [Authenticated Admin]
          │                                           │
  ┌───────▼─────────────────┐                 ┌───────▼─────────────────┐
  │ Public Pages & Actions  │                 │ Admin Pages & Actions   │
  │ • /design               │                 │ • /admin/designs        │
  │ • /design/[slug]        │                 │ • /admin/messages       │
  │ • /contact (submission) │                 │ • /admin (dashboard)    │
  └───────┬─────────────────┘                 └───────┬─────────────────┘
          │                                           │
          │     DAL & Server-Side Security            │
          │     (getAuthenticatedAdmin, RLS)          │
          └───────────────────┬───────────────────────┘
                              │
               ┌──────────────▼──────────────┐
               │    Supabase PostgreSQL      │
               │ • designs                   │
               │ • contact_messages          │
               │ • storage.objects           │
               └─────────────────────────────┘
```

The system strictly preserves the established project patterns:
- **Server Actions** handle data mutations with server-side authorization checks (`getAuthenticatedAdmin()`), input normalization, client/server validation, and cache revalidation (`revalidatePath()`).
- **Data Access Layer (DAL)** handles database interactions via server-only modules (`designs.ts`, `messages.ts`), with fallbacks to static verified data when database tables are unpopulated or unconfigured.
- **Universal Media Uploader** (`ImageUploader.tsx`) unifies file uploads to Supabase Storage (`portfolio-media` bucket) with support for direct URL entry, mime-type validation, and 5 MB size limits across Projects, Applications, and Designs.
- **Contact Message Workflow** replaces `mailto:` form submission with backend database storage, honeypot spam protection, and an admin inbox featuring custom `mailto:` reply pre-fills without storing third-party SMTP credentials.

---

## 2. Database Schema and Migrations

Migration file created:  
[`supabase/migrations/20261030000002_phase5_designs_contacts.sql`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/supabase/migrations/20261030000002_phase5_designs_contacts.sql)

### 2.1 Table: `public.designs`
Stores dedicated design portfolio case studies separate from engineering projects.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique design identifier |
| `slug` | `TEXT` | `UNIQUE NOT NULL` | URL-safe slug for public routes |
| `title` | `TEXT` | `NOT NULL` | Design project title |
| `category` | `TEXT` | `NOT NULL DEFAULT 'UI/UX Design'` | UI/UX, Graphic, Branding, etc. |
| `description` | `TEXT` | `NULLABLE` | Case study narrative and approach |
| `tools` | `TEXT[]` | `NOT NULL DEFAULT '{}'` | Figma, Photoshop, Illustrator, etc. |
| `cover_image` | `TEXT` | `NULLABLE` | Main thumbnail / presentation URL |
| `gallery` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Array of `{ url, alt, caption }` |
| `external_url` | `TEXT` | `NULLABLE` | Live link / Figma prototype URL |
| `project_date` | `DATE` | `NULLABLE` | Project completion / presentation date |
| `published` | `BOOLEAN` | `NOT NULL DEFAULT false` | Public visibility flag |
| `featured` | `BOOLEAN` | `NOT NULL DEFAULT false` | Highlighted on showcase grid |
| `sort_order` | `INT` | `NOT NULL DEFAULT 0` | Priority sequence |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Record timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Trigger-updated timestamp |

### 2.2 Table: `public.contact_messages`
Stores inquiries submitted through the public contact form.

| Column | Type | Constraints / Defaults | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY DEFAULT gen_random_uuid()` | Unique message ID |
| `sender_name` | `TEXT` | `NOT NULL` | Visitor's full name |
| `sender_email` | `TEXT` | `NOT NULL` | Visitor's reply email |
| `subject` | `TEXT` | `NOT NULL` | Message subject |
| `message` | `TEXT` | `NOT NULL` | Full inquiry text |
| `status` | `TEXT` | `NOT NULL DEFAULT 'new' CHECK (...)` | `'new'`, `'read'`, `'replied'`, `'archived'` |
| `is_read` | `BOOLEAN` | `NOT NULL DEFAULT false` | Read status |
| `replied_at` | `TIMESTAMPTZ` | `NULLABLE` | Recorded when admin confirms reply sent |
| `archived_at` | `TIMESTAMPTZ` | `NULLABLE` | Recorded when moved to archive |
| `website` | `TEXT` | `NULLABLE` | Honeypot field (bots trap) |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL DEFAULT NOW()` | Timestamp of submission |

---

## 3. Row Level Security (RLS) Policies

RLS is enabled on both `public.designs` and `public.contact_messages`:

### `public.designs`
- **Anonymous visitors (`anon`):**
  ```sql
  CREATE POLICY "Public visitors can view published designs"
    ON public.designs FOR SELECT
    USING (published = true);
  ```
- **Authenticated administrators (`is_admin()`):**
  ```sql
  CREATE POLICY "Admins have full access to designs"
    ON public.designs FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
  ```

### `public.contact_messages`
- **Anonymous visitors (`anon`):**
  - **INSERT only** with initial status validation:
    ```sql
    CREATE POLICY "Public visitors can submit contact messages"
      ON public.contact_messages FOR INSERT
      WITH CHECK (
        status = 'new'
        AND is_read = false
        AND replied_at IS NULL
        AND archived_at IS NULL
      );
    ```
  - **No SELECT, UPDATE, or DELETE** for anonymous visitors. Messages are strictly private.
- **Authenticated administrators (`is_admin()`):**
  - Full `SELECT`, `UPDATE`, and `DELETE` access to manage messages, mark as read, set replied state, and archive.

---

## 4. Storage Bucket and Policies

Bucket: `portfolio-media`  
Public: `true` (public reads for image rendering)  
File Size Limit: `5242880` bytes (5 MB)  
Allowed MIME Types: `['image/jpeg', 'image/jpg', 'image/png', 'image/webp']`

Folder organization:
```
portfolio-media/
  projects/
  applications/
  designs/
    covers/
    gallery/
  general/
```

Policies:
- **Public read:** Anyone can view images (`SELECT`).
- **Admin upload/update/delete:** Strictly restricted to authenticated admins (`public.is_admin()`).

---

## 5. Files Created and Modified

### New Files Created
1. `supabase/migrations/20261030000002_phase5_designs_contacts.sql` — Schema, RLS, and storage migration
2. `src/lib/data/designs.ts` — Data Access Layer for designs (public & admin queries)
3. `src/lib/data/messages.ts` — Data Access Layer for contact messages (admin only)
4. `src/lib/actions/designs.ts` — Server actions for designs CRUD
5. `src/lib/actions/contact.ts` — Server actions for contact submission and inbox operations
6. `src/lib/actions/upload.ts` — Server action for Supabase Storage uploads
7. `src/components/admin/media/ImageUploader.tsx` — Reusable image uploader + URL fallback component
8. `src/components/admin/media/ImageUploader.module.css` — CSS Module for ImageUploader
9. `src/components/admin/designs/DesignList.tsx` — Interactive design list with search, filter, and delete modal
10. `src/components/admin/designs/DesignList.module.css` — CSS Module for DesignList
11. `src/components/admin/designs/DesignForm.tsx` — Full design editor with tags, slug auto-generation, and ImageUploader
12. `src/components/admin/designs/DesignForm.module.css` — CSS Module for DesignForm
13. `src/components/admin/messages/MessageList.tsx` — Inbox list with unread markers, status filters, archive, and delete
14. `src/components/admin/messages/MessageList.module.css` — CSS Module for MessageList
15. `src/components/admin/messages/MessageDetail.tsx` — Message reader with mailto reply draft generator and reply confirmation modal
16. `src/components/admin/messages/MessageDetail.module.css` — CSS Module for MessageDetail
17. `src/app/admin/designs/page.tsx` — Admin designs list route
18. `src/app/admin/designs/new/page.tsx` — Admin design create route
19. `src/app/admin/designs/[id]/edit/page.tsx` — Admin design edit route
20. `src/app/admin/messages/page.tsx` — Admin messages inbox route
21. `src/app/admin/messages/[id]/page.tsx` — Admin message detail route
22. `src/app/design/[slug]/page.tsx` — Public design detail route
23. `src/app/design/[slug]/page.module.css` — CSS Module for public design detail

### Files Modified
1. `src/types/database.types.ts` — Added `designs` and `contact_messages` table definitions
2. `src/types/admin.ts` — Added `AdminDesign`, `DesignGalleryItem`, and `AdminContactMessage` types
3. `src/lib/data/index.ts` — Re-exported `designs` and `messages` DAL modules
4. `src/components/admin/projects/ProjectForm.tsx` — Integrated `ImageUploader` for primary & secondary screens
5. `src/components/admin/apps/AppForm.tsx` — Integrated `ImageUploader` for cover & detail images
6. `src/components/contact/ContactComposer.tsx` — Upgraded to backend Server Action, honeypot, and state feedback
7. `src/components/design/DesignWorks.tsx` — Connected to `DesignDTO[]` with fallback to verified static works
8. `src/app/design/page.tsx` — Server data fetching via `getPublishedDesigns()` & removed duplicate `<main>` landmark
9. `src/components/admin/layout/AdminSidebar.tsx` — Added Designs and Messages navigation items
10. `src/app/admin/page.tsx` — Added live metrics and shortcuts for Designs and Messages

---

## 6. Features Implemented

### Feature A — Design Portfolio Management
- **Full CRUD:** Create, list, search, filter, edit, and delete designs.
- **Slug Generation:** Automatic slugification from design title with manual override capability.
- **Category & Tools:** Reusable tag selector with predefined recommendations (Figma, Photoshop, Illustrator, Canva, etc.).
- **Publication Controls:** Quick toggle for published/draft and featured status directly from the list or form.
- **Gallery Management:** Ability to manage both a primary cover image and additional gallery preview artifacts.
- **Public Integration:** The `/design` page dynamically displays published designs while preserving static fallbacks.
- **Detail Route:** Accessible at `/design/[slug]` with responsive cover display and artifact gallery.

### Feature B — Universal Image Upload
- **Dual Mode:** Choose between uploading a local file or entering an image URL.
- **Validation:** Server-side and client-side mime-type (`JPG`, `PNG`, `WEBP`) and size limits (`<= 5 MB`).
- **Preview & Management:** Immediate visual preview, replace, and remove capabilities.
- **Zero Secrets in Client:** Upload occurs strictly via Server Action with authenticated admin checks.
- **Uniform Integration:** Used across Projects (`ProjectForm`), Applications (`AppForm`), and Designs (`DesignForm`).

### Feature C — Contact Message Management
- **Spam Defeat:** Integrated honeypot input field (`website`) silently drops bot submissions without error.
- **Admin Inbox:** Search, filter by status (Unread, Read, Replied, Archived), and view message counters.
- **Automatic Read State:** Viewing a message automatically updates `is_read` to `true`.
- **Mailto Workflow:** Constructs a formatted `mailto:` link with `Re:` subject prefix, personalized greeting, and signature.
- **Replied Confirmation:** Does not falsely assume mailto clicked equals email sent; provides dedicated "Mark as Replied" confirmation modal recording `replied_at`.

---

## 7. Verification and Testing Results

| Test Category | Target / Description | Result |
|---|---|---|
| **TypeScript Typecheck** | `npx tsc --noEmit` across entire repository | **PASSED (0 errors)** |
| **ESLint Check** | `npm run lint` across all components and pages | **PASSED (0 errors, 0 warnings)** |
| **Next.js Production Build** | `npm run build` (Turbopack production compilation) | **PASSED (100% routes compiled)** |
| **Designs Validation** | Title, slug regex, category, tools validation | **13 / 13 PASSED** |
| **Contact Submission Validation** | Email format, message length, honeypot detection | **PASSED** |
| **Universal Upload Validation** | Allowed mime types, oversized 5 MB rejection | **PASSED** |
| **Mailto URL Encoding** | Subject `Re:` prefix handling and body encoding | **PASSED** |
| **Live Supabase Connectivity** | Verification of existing tables and anon API responses | **PASSED (Projects & Apps 200 OK)** |

---

## 8. Manual Testing Instructions for Supabase Migration

To apply the Phase 5 schema to the remote Supabase project:

1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw](https://supabase.com/dashboard/project/etjnlqhewraboapmnfdw)
2. Navigate to the **SQL Editor** tab.
3. Open or copy the contents of:  
   [`supabase/migrations/20261030000002_phase5_designs_contacts.sql`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/supabase/migrations/20261030000002_phase5_designs_contacts.sql)
4. Click **Run** to execute the migration.
5. In the **Storage** section, confirm the `portfolio-media` bucket is present.

