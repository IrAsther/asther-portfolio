# APPS_COVER_IMAGE_DEBUG_REPORT

**Date:** 2026-10-30  
**Portfolio:** Asther Irakaza — Personal Portfolio  
**Page affected:** `/apps`  
**Item affected:** CoLD — Compétences Locales, pilier du Développement durable

---

## 1. Symptom

The public `/apps` page displayed the CoLD application card with its title, description, and tech list, but the image area was completely blank. No broken-image icon was visible — the card rendered as if no image existed.

Other card content (index number, status badge, category, highlights, tech list) rendered correctly.

---

## 2. Diagnosis Approach

Traced the complete data pipeline in four stages:

```
Supabase DB → getPublishedApplications() → apps/page.tsx → AppCard.tsx → <Image>
```

### Stage 1 — Database Record

Queried the `applications` table via a temporary Node.js script.

| Field           | Value |
|-----------------|-------|
| `id`            | (UUID) |
| `name`          | CoLD — Compétences Locales, pilier du Développement durable |
| `featured`      | `false` |
| `published`     | `true` |
| `image`         | `https://etjnlqhewraboapmnfdw.supabase.co/storage/v1/object/public/portfolio-media/applications/1793388306402-r9gbf8-cold.png` |
| `secondary_image` | `https://etjnlqhewraboapmnfdw.supabase.co/storage/v1/object/public/portfolio-media/applications/1793388425537-49la4l-cold.png` |

**Result:** Image URL is present and correct in the database. ✅

### Stage 2 — HTTP Accessibility

```
curl -I "https://etjnlqhewraboapmnfdw.supabase.co/storage/v1/object/public/portfolio-media/applications/1793388306402-r9gbf8-cold.png"
```

**Response:** `HTTP/2 200`, `content-type: image/png`, `content-length: 496432` (~485 KB) ✅

The image exists in Supabase Storage and is publicly accessible.

### Stage 3 — Data Mapping (`applications.ts`)

Inspected [`src/lib/data/applications.ts`](file:///c:/Users/LENOVO/Desktop/asther-portfolio/src/lib/data/applications.ts).

```typescript
image: row.image ?? undefined,
secondary_image: row.secondary_image ?? undefined,
```

The field is correctly mapped from the Supabase row into `ApplicationDTO`. ✅

### Stage 4 — Component Rendering (`AppCard.tsx`)

**ROOT CAUSE FOUND HERE.**

The original `AppCard.tsx` unconditionally rendered the blueprint/grid placeholder area for every card — it never checked whether `app.image` was set, and never rendered an `<Image>` element:

```tsx
// BEFORE (broken) — blueprint always rendered, image never rendered
<div className={styles.blueprintArea} aria-hidden="true">
  <div className={styles.blueprintGrid} />
  {/* ... */}
</div>
```

The `image` field was fetched correctly from Supabase but was **completely ignored at render time**. The failure was purely presentational.

---

## 3. Root Cause

> **`AppCard.tsx` hardcoded the blueprint placeholder unconditionally and never rendered a cover image, regardless of whether `app.image` was populated.**

The data pipeline was entirely correct:
- Supabase row had the correct image URL ✅
- `getPublishedApplications()` mapped the field ✅
- `apps/page.tsx` passed `ApplicationDTO[]` to `AppsGrid` ✅
- `AppCard` received `app.image` but discarded it silently ❌

---

## 4. Secondary Issues Discovered

### 4.1 Type mismatch: `AppItem` vs `ApplicationDTO`

`AppsGrid` and `FeaturedApp` accepted only `AppItem` (the static data type from `@/data/apps`), not `ApplicationDTO` (the Supabase DTO). This caused TypeScript type errors when passing Supabase records and masked the real capability of the data layer.

### 4.2 Hardcoded label in `FeaturedApp`

```tsx
// BEFORE
<span className={styles.shotLabel}>DANDAZA+ // INTERFACE</span>
```

The label was hardcoded to "DANDAZA+" making it wrong for any other featured app. Fixed to use the dynamic app name.

---

## 5. Fix Applied

### Files Modified

#### `src/components/apps/AppCard.tsx`

Added `"use client"` directive and `useState(hasImageError)` for graceful fallback.

```tsx
const hasValidImage = Boolean(app.image && app.image.trim() && !hasImageError);

{hasValidImage ? (
  <div className={styles.imageArea}>
    <Image
      src={app.image!}
      alt={`${app.name} interface preview`}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 540px"
      className={styles.coverImage}
      onError={() => setHasImageError(true)}
    />
  </div>
) : (
  /* Blueprint fallback — shown for apps without screenshots */
  <div className={styles.blueprintArea} aria-hidden="true">
    {/* ... */}
  </div>
)}
```

- Real cover image shown when `app.image` is populated and loads successfully
- Blueprint fallback shown when image is absent or fails to load
- `onError` handler sets `hasImageError` → blueprint is shown instead

#### `src/components/apps/AppCard.module.css`

Added `.imageArea` and `.coverImage` styles:

```css
.imageArea {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--color-bg-alt);
  border-bottom: 1px solid var(--color-border-subtle);
}

.coverImage {
  object-fit: cover;
  object-position: top center;
  transition: transform var(--transition-medium);
}

.card:hover .coverImage {
  transform: scale(1.03);
}
```

#### `src/components/apps/AppsGrid.tsx`

Changed prop type from `AppItem[]` to `(AppItem | ApplicationDTO)[]` to accept both static and database-sourced data.

#### `src/components/apps/FeaturedApp.tsx`

Changed prop type from `AppItem` to `AppItem | ApplicationDTO`. Changed hardcoded `"DANDAZA+ // INTERFACE"` label to dynamic `{app.name.toUpperCase()} {"//"}  INTERFACE`.

#### `src/app/apps/page.tsx`

Added `export const dynamic = "force-dynamic"` and `export const revalidate = 0` to prevent stale ISR caching from masking updates to published applications.

---

## 6. `next.config.ts` — Already Correct

No changes required. Remote patterns were already configured:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "etjnlqhewraboapmnfdw.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
}
```

---

## 7. Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` (ESLint) | ✅ 0 errors |
| `npm run build` | ✅ Compiled successfully |
| `/apps` page type: Dynamic (no stale ISR) | ✅ `ƒ (Dynamic)` |
| Supabase image URL HTTP status | ✅ 200 OK (485 KB PNG) |
| Blueprint shown for apps without image | ✅ (`app.image` falsy → blueprint) |
| Blueprint shown on image load error | ✅ (`onError` → `hasImageError` → blueprint) |
| CoLD image rendered on `/apps` grid | ✅ `AppCard` now renders `<Image>` when `app.image` is set |

> [!NOTE]
> Dev server localhost network is not accessible from the automated sandbox environment.
> Browser visual verification must be performed by opening `http://localhost:3000/apps` in a browser.
> The dev server was confirmed running on PID 5976 at `localhost:3000` at time of writing.

---

## 8. Expected Outcome

After these changes:

- **CoLD card** — Displays the 485 KB PNG cover image in a `200px`-tall area with `object-fit: cover`, subtle scale hover effect, and blueprint fallback if the image fails to load.
- **Dandaza+ (FeaturedApp)** — Continues to render as the featured app with its primary and secondary images from Supabase (was already working).
- **Static fallback apps** (ESE, ASA) — If Supabase is unavailable, the static `appsData` array is used; those entries have no `image` field so the blueprint placeholder renders correctly.
- **Other pages** — No regressions; Projects, Designs, Media Library, and Admin pages are untouched.

---

## 9. Lessons Learned

1. **Hardcoded placeholder UI can silently discard real data.** Always check whether a visual area conditionally renders real content vs. always rendering a placeholder.
2. **Test the presentation layer independently** from the data layer. A correct DB query + correct mapping is not enough if the component ignores the prop.
3. **Union types** (`AppItem | ApplicationDTO`) allow gradual migration from static data to live data without breaking existing consumers.
4. **`force-dynamic`** on data-fetching pages prevents ISR from serving stale renders after Supabase records change.

