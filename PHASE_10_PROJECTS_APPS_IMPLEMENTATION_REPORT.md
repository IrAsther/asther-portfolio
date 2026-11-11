# Phase 10: Projects Search, Application Links & Admin Responsive Implementation Report

**Project:** Asther Irakaza Portfolio  
**Phase:** 10 — Project Search, Application Links & Admin Responsive  
**Date:** November 11, 2026  
**Status:** Completed & Verified  

---

## 1. Task A: Projects Search & Data Pipeline Resolution

### The Issue
Projects visible on the homepage (such as *Applied Machine Learning Pipeline* and *Component Web Architecture*) were missing on `/projects`, leaving only *Dandaza+*.

### Root Cause Analysis (Data Pipeline Trace)
1. **Database:** Supabase generates UUID primary keys for projects (e.g., `01ea0324-...`, `93c76f47-...`), while the human-readable slug is stored in `slug` (e.g. `'dandaza-plus'`, `'ai-applied-system'`, `'web-platform-core'`).
2. **Data Access Layer (`src/lib/data/projects.ts`):** `getPublishedProjects()` maps `row.id` to `id` (the UUID) and `row.slug` to `slug`.
3. **Projects Page (`src/components/projects/ProjectGrid.tsx`):**
   The legacy grid previously looked up items by matching `id` against hardcoded static strings:
   ```typescript
   const dandaza = projects.find((p) => p.id === "dandaza-plus") || projects[0];
   const aiProject = projects.find((p) => p.id === "ai-applied-system");
   const webProject = projects.find((p) => p.id === "web-platform-core");
   ```
   When connected to Supabase, `p.id` contains the UUID, causing `p.id === "ai-applied-system"` to evaluate to `false`. Both `aiProject` and `webProject` were evaluated as `undefined`, causing them to disappear from the page. Additionally, any new projects published from the admin panel were completely ignored.

### Enhancements & Fixes Implemented
- **Dynamic Project Rendering:** `ProjectGrid` now identifies the flagship project dynamically (`p.slug === "dandaza-plus" || p.id === "dandaza-plus" || p.featured || projects[0]`), and maps dynamically over **all** other published projects in `supportingProjects`.
- **Search System:**
  - Responsive search bar with search icon, live matching counter pill, and clear (`X`) button.
  - Client-side filtering searching across `title`, `category`, `summary`, `problem`, `direction`, and `technologies`.
  - Accessible Empty Search State with an icon, informative copy, and a one-click "Clear search" reset button.
  - Support for both static `Project` and Supabase `ProjectDTO` types.
- **Dynamic Route Invalidation:** Added `export const dynamic = "force-dynamic"` and `export const revalidate = 0` to `src/app/projects/page.tsx`.

---

## 2. Task B: Application Search & External URL Management

### Enhancements Implemented
1. **Server-Side URL Validation (`src/lib/actions/apps.ts`):**
   - Implemented strict absolute URL validation requiring valid `http:` or `https:` protocols for `demoUrl`, `downloadUrl`, and `githubUrl`.
2. **Application Card & Featured Links:**
   - Updated `AppCard.tsx` and `FeaturedApp.tsx` to display a styled **"Visit Live App"** action button only when a valid `demoUrl` or `href` is present.
   - External links strictly use `target="_blank"` and `rel="noopener noreferrer"`.
   - Missing or null URLs cleanly omit the button with zero layout shifting.
3. **Applications Search Explorer (`src/components/apps/AppsExplorer.tsx`):**
   - Created client-side `AppsExplorer` component.
   - Searches across application `name`, `category`, `description`, `problem`, `direction`, `technologies`, and `status`.
   - In default mode: showcases the primary `FeaturedApp` followed by the grid of remaining applications.
   - In search mode: dynamically displays matching applications with live counter and accessible empty state.

---

## 3. Task C: Admin Responsive Audit Summary

Full viewport testing was conducted across 320px, 360px, 375px, 390px, 430px, 600px, 768px, 1024px, 1280px, 1440px, and 1920px.

Key fixes:
- Replaced outdated "Demo State" pill in `AdminTopBar` with live connection status.
- Ensured touch targets meet the minimum 44px threshold.
- Optimized toolbar flex wrapping and breadcrumb truncations to eliminate horizontal overflow on narrow screens down to 320px.
- Verified mobile drawer navigation, forms, and data tables.

---

## 4. Quality Assurance & Verification

- `npx tsc --noEmit`: **0 errors** (Clean).
- `npm run lint`: **0 errors, 0 warnings** (Clean).
- `npm run build`: **Compiled successfully** with Turbopack (Next.js 16.3.5).

