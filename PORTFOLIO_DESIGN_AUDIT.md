# Portfolio Design Audit — Asther Irakaza
**Audit Date:** 2026-10-30  
**Auditor:** Antigravity (Senior UI/UX + Frontend review)  
**Status:** Read-only inspection — no files modified

---

## Table of Contents
1. [Discovered Public Routes](#1-discovered-public-routes)
2. [Page-by-Page Status](#2-page-by-page-status)
3. [Design System & Token Audit](#3-design-system--token-audit)
4. [Cross-Page Inconsistencies](#4-cross-page-inconsistencies)
5. [Missing & Broken Assets](#5-missing--broken-assets)
6. [Accessibility Issues](#6-accessibility-issues)
7. [Dead / Orphaned Code](#7-dead--orphaned-code)
8. [Mobile Responsiveness Issues](#8-mobile-responsiveness-issues)
9. [Recommended Improvements](#9-recommended-improvements)
10. [Prioritized Implementation Roadmap](#10-prioritized-implementation-roadmap)

---

## 1. Discovered Public Routes

| Route | File | Render Mode | Data Source |
|---|---|---|---|
| `/` | `src/app/page.tsx` | SSR (async) | Supabase → static fallback |
| `/about` | `src/app/about/page.tsx` | SSR (async) | Supabase `getResumeData()` |
| `/projects` | `src/app/projects/page.tsx` | SSR (async) | Supabase `getPublishedProjects()` |
| `/apps` | `src/app/apps/page.tsx` | SSR (async) | Supabase → `appsData` fallback |
| `/resume` | `src/app/resume/page.tsx` | SSR (async) | Supabase `getResumeData()` |
| `/design` | `src/app/design/page.tsx` | **Static (○)** | Static data only |
| `/contact` | `src/app/contact/page.tsx` | **Static (○)** | Static data only |
| `/admin` | `src/app/admin/…` | Auth-protected | Supabase |
| **404** | _(not found)_ | — | **MISSING — no `not-found.tsx`** |

> [!CAUTION]
> **No 404 page exists.** `src/app/not-found.tsx` was not found anywhere in the project. Next.js App Router will fall back to a default unstyled error page, which is completely off-brand.

---

## 2. Page-by-Page Status

### 2.1 Home — `/`
**Status: ✅ Fully Redesigned**

**Sections:** `Hero` → `Introduction` → `BuildCategories` → `FeaturedProjects` → `SkillsPreview` → `DesignPreview` → `FinalCTA`

**Strengths:**
- Sophisticated two-column Hero with portrait, dot-grid, mouse-parallax, polygon clip-path frame, corner brackets, accent lines — highest visual craft in the project
- `BuildCategories` (5 categories with Lucide icons + index numbers) is polished
- `SkillsPreview` is cleanly organized into 4 skill cluster cards with a CTA linking to Projects
- `FeaturedProjects` has inline modal overlay — no separate page navigation needed
- `DesignPreview` uses real `/design/pattern-1.jpg` and `/design/pattern-2.jpg` assets (both exist)
- `FinalCTA` is clean and uncluttered

**Issues found:**
- `Hero.module.css` line ~46 references `url('/images/pattern-1.jpg')` as a CSS background-image — this file **does not exist** in `/public`. The correct path is `/design/pattern-1.jpg`. This silently breaks the hero's pattern background.
- `Hero.module.css` has a stale comment: `"Space Grotesk headings"` — the actual font is **Archivo Black**. Minor but confusing for future maintenance.
- `FeaturedProjects` imports `type Project` from `@/data/projects` (static type) but the page passes `ProjectDTO[]` from Supabase. These are structurally compatible but the type mismatch is a latent maintenance issue.
- `Introduction.tsx` — 4 focus cards with badge and statement. Not read in full, but renders correctly from static data.

---

### 2.2 About — `/about`
**Status: ⚠️ Partially Redesigned — Structural Issues**

**Sections:** `AboutHero` → `AboutIntro` → `AboutStats` → `AboutSkills` → `AboutTimeline` → `AboutGallery` → `AboutCTA`

**Strengths:**
- `AboutHero` reuses `HeroPortrait` intelligently via `AboutPortrait.tsx` re-export — good DRY pattern
- `AboutTimeline` is semantic `<ol>` with dot+line track — well structured
- `AboutGallery` uses 4 real existing design images, no broken references
- All 4 gallery images exist: `/design/ui-preview-1.png`, `/design/ui-preview-2.png`, `/design/dandaza-dashboard-ui.png`, `/design/dandaza-settings-ui.png`

**Issues found:**

1. **Duplicate `<main>` landmark (Accessibility — WCAG 2.1 Landmark):**  
   `src/app/about/page.tsx` wraps content in `<main id="main-content">`. The root layout (`src/app/layout.tsx`) already renders a global `<main id="main-content">`. This creates two `<main>` elements on the About page — a hard accessibility violation. Screen readers will be confused; landmark navigation breaks.

2. **Hardcoded stats in `AboutStats.tsx`:**  
   Stats are not derived from the database:
   - "3+ Projects Built" → hardcoded
   - "14 Technologies" → hardcoded
   - "4+ Years Learning" → hardcoded
   - "3 Areas of Focus" → hardcoded  
   When real project/app counts change, these will be stale.

3. **7 orphaned components (dead code) in `src/components/about/`:**  
   These components exist on disk but are **never imported in `about/page.tsx`**:
   - `WhoIAm.tsx` + `.module.css`
   - `ValuesMission.tsx` + `.module.css`
   - `TechnicalDirection.tsx` + `.module.css`
   - `CurrentFocus.tsx` + `.module.css`
   - `DesignStory.tsx` + `.module.css`
   - `Education.tsx` + `.module.css`
   - `Journey.tsx` + `.module.css`  
   These are from an older page layout. They inflate bundle analysis, create maintenance confusion, and may have outdated design patterns.

---

### 2.3 Projects — `/projects`
**Status: ✅ Fully Redesigned**

**Sections:** `ProjectsBackground` → `ProjectsHero` → `ProjectGrid` → `ProjectsCTA`

**Strengths:**
- Flagship project showcase: 3-zone layout (Context Left / Screenshot Center / Specs Right) — distinctive and editorial
- Secondary project cards with concept diagram placeholders when no image — honest fallback
- `ProjectExpandedModal` provides in-page detail expansion — no page navigation required
- `ProjectCard` supports 3 layout variants: `spotlight`, `diagram`, `horizontal` — flexible
- `ProjectGrid` uses `"use client"` correctly for modal state; page itself is a server component

**Issues found:**
- `ProjectGrid` hardcodes project IDs (`"dandaza-plus"`, `"ai-applied-system"`, `"web-platform-core"`) as `find()` selectors:
  ```ts
  const dandaza = projects.find((p) => p.id === "dandaza-plus") || projects[0];
  ```
  If IDs change in the database or static data, the flagship rendering silently falls back to `projects[0]`. This is fragile.
- `ProjectGrid` accepts `Project[]` (static type from `@/data/projects`) but the page calls `getPublishedProjects()` which returns `ProjectDTO[]`. These are likely compatible but mismatched types.
- No empty state rendered if `projects` array is empty — the section will simply render nothing with no messaging to the visitor.
- `ProjectCard.tsx` is defined but **not actually used** in `ProjectGrid.tsx` — `ProjectGrid` renders its own inline article layouts. `ProjectCard` appears to be dead code or for future use.

---

### 2.4 Apps — `/apps`
**Status: ✅ Fully Redesigned**

**Sections:** `AppsBackground` → `AppsHero` → `FeaturedApp` → `AppsGrid` → `ProductProcess` → `TechnologyDirection` → `AppsCTA`

**Strengths:**
- `FeaturedApp` is richly detailed: Problem / Direction / Highlights / Technologies + dual overlapping mobile screenshots
- `AppsGrid` + `AppCard` handles secondary in-development apps cleanly
- `ProductProcess` 4-step editorial section consistent with Design page's process sections
- `TechnologyDirection` renders tech groups in clean table-style rows
- Consistent section numbering: 01 / 02 / 03 / 04

**Issues found:**
- `AppsHero` hardcodes "**1 Live Showcase**" and "**2 In Development**" as static strings. These will be stale if app counts change in Supabase.
- `FeaturedApp.tsx` hardcodes `"DANDAZA+ // DASHBOARD"` and `"REPORTS"` as shot labels — these are project-specific strings baked into a supposedly generic component.
- Apps page uses `<main className={styles.pageContent}>` but the root layout also wraps everything in `<main>`. **Same duplicate landmark issue as About page.**
- Fallback to `appsData` static data when Supabase returns empty: `const apps = publishedApps.length > 0 ? publishedApps : appsData` — This is documented behavior but could silently show stale data if Supabase returns 0 due to an error vs. genuinely having no records.

---

### 2.5 Resume — `/resume`
**Status: ✅ Fully Redesigned**

**Sections:** `ResumeHero` → `ResumeSummary` → `ResumeSkills` → `ResumeEducation` → `ResumeProjects` → `ResumeDirection` → `ResumeCTA`

**Strengths:**
- `ResumeHero` is strong: name, role, subtitles, positioning card, contact/verification pill bar (GitHub, Email, Portfolio, Education affiliation)
- `ResumeSkills` renders skill groups from Supabase (`getResumeData()`) with pill tags + a "Design & Engineering Intersection" callout card
- `ResumeEducation` handles `current` vs completed status badges cleanly
- `ResumeCTA` honestly notes "Formal PDF CV document is currently in preparation" — good authenticity
- Consistent section index numbering (01/02/03…)

**Issues found:**
- `ResumeCTA` notes that a PDF CV is not yet available. If one is eventually added, the component must be updated — worth tracking.
- Resume page has no `<main>` wrapper in `page.tsx` (it renders a fragment `<>...</>`), so the root layout's `<main>` is the only landmark. This is **correct** — no duplicate landmark issue here.
- `ResumeProjects` and `ResumeDirection` components were not fully read — flagged for follow-up if inconsistencies are discovered during implementation.

---

### 2.6 Design — `/design`
**Status: ✅ Fully Redesigned (Static)**

**Sections:** `DesignBackground` → `DesignHero` → `DesignWorks` → `DesignProcess` → `DesignSystemGlimpse` → `DesignCTA`

**Render mode:** Static (○) — no server data fetching. All content is hardcoded in components.

**Strengths:**
- `DesignHero` two-column layout with real screenshots (Scholarly ASA + Dandaza+ mobile overlay) — very polished
- `DesignWorks` editorial asymmetric grid: 1 primary featured work + 4 supporting works in 4-column rhythm. Uses 5 real existing images.
- `DesignProcess` 3-step card grid (Understand / Shape / Refine) — crisp
- `DesignSystemGlimpse` 3-column spec layout (Color Palette / Typography / Geometry & Brand) — correct and detailed. **This is the canonical public-facing design system reference.**
- `DesignCTA` box with accentCorner detail — consistent with AppsCTA style

**Issues found:**
- `DesignSystemGlimpse` shows `#01605A` as "Deep Teal" (current token value) and `#FF862D` as "Orange". The user's brief specifies original brand as `#023341` and `#FD5E02`. The DesignSystemGlimpse is therefore publicly displaying the drifted values, not the original brand specification.
- `DesignWorks` data is entirely inline (hardcoded `selectedWorks` array) — not from any data file or CMS. Adding new design works requires editing the component file directly.
- Design page is **static** — no dynamic content. This is intentional but means the works gallery cannot be managed from the admin panel.
- Design page also uses `<main className={styles.pageContent}>` wrapper. **Potential duplicate landmark if root layout already has `<main>`** — depends on exact `layout.tsx` structure. Needs verification.

---

### 2.7 Contact — `/contact`
**Status: ✅ Fully Redesigned (Static)**

**Sections:** `ContactBackground` → `ContactHero` → `ContactSection` (= `ContactInfo` + `ContactComposer`)

**Render mode:** Static (○) — no server data.

**Strengths:**
- Simple, focused layout: hero + two-column info/form
- `ContactHero` is clean with eyebrow, h1, and short lead
- `ContactComposer` form has correct `htmlFor`/`id` pairings, `autoComplete` attributes, `required` attributes
- Form fields: Name, Email, Message (textarea) — minimal but sufficient

**Issues found:**
- **Contact form is a `mailto:` link disguised as a form.** On submit, it builds a `mailto:` URI and calls `window.location.href`. This:
  - Requires the user to have a default email client configured
  - Will silently fail on devices with no mail app (common on mobile, Linux, some corporate desktops)
  - Provides no server-side confirmation, spam protection, or message storage
  - No loading/success/error state is shown — the form just opens an email client (or does nothing if none is configured)
- No character count or validation feedback UI (only native browser `required` enforcement)
- No visual error states for invalid email format

---

### 2.8 404 / Not Found
**Status: ❌ MISSING**

`src/app/not-found.tsx` does not exist. Next.js App Router will render a default unstyled 404 error page. This is fully off-brand and breaks the user experience for any mistyped URL.

---

## 3. Design System & Token Audit

### 3.1 Current Token Values (actual `tokens.css`)

| Token | Current Value | Original Specified Value | Difference |
|---|---|---|---|
| `--brand-deep-teal` | `#01605A` | `#023341` | Significantly different — green-teal vs dark navy-teal |
| `--brand-orange` | `#FF862D` | `#FD5E02` | Lighter, more pastel orange vs deeper burnt orange |
| `--color-bg` (light) | `#FAF8F5` | `#FCF5E3` | Warmer cream vs cooler off-white |
| `--brand-warm-peach` | `#FFD0A8` | _(not specified originally)_ | New color, not in original spec |
| Font (display) | Archivo Black | Space Grotesk (original phase 1) | Major change — both loaded correctly |
| Font (body) | Inter | _(not specified in user brief)_ | Solid choice |

> [!IMPORTANT]
> The design system has **intentionally drifted** from the phase-1 brand spec. The current palette (`#01605A` green-teal + `#FF862D` light orange) is internally consistent and well-implemented throughout the codebase. The question is whether the user wants to revert to the original `#023341` / `#FD5E02` / `#FCF5E3` palette. **This decision must be made before any token changes are implemented** — it would cascade across every component.

### 3.2 Token Coverage — What Uses the Design System

All public components consistently use CSS custom properties from `tokens.css`. No hardcoded color values were found in component CSS files during inspection. The token system is well-adopted.

### 3.3 Dark Theme

Dark theme tokens are defined in `[data-theme="dark"]` in `tokens.css`. A `ThemeProvider` and `ThemeScript` are present in `layout.tsx`. Dark mode appears functional at the token level. Individual component dark mode rendering was not visually tested.

### 3.4 Typography

- **Display/Headings:** Archivo Black (400 weight) — loaded via `next/font/google` in `layout.tsx` and `src/lib/fonts.ts`
- **Body/UI:** Inter — loaded via `next/font/google`
- Font CSS variables are correctly wired: `--font-family-display`, `--font-family-heading`, `--font-family-sans`
- Scale: xs (12px) through 5xl (48px) — standard, appropriate
- `Hero.module.css` has stale comment "Space Grotesk headings" — incorrect, now Archivo Black

---

## 4. Cross-Page Inconsistencies

### 4.1 CTA Button Implementation — Inconsistent Across Pages

| Location | CTA Implementation |
|---|---|
| Projects CTA, Resume CTA | Uses `<Button>` component (`src/components/ui/Button.tsx`) |
| Apps CTA, Design CTA | Uses raw `<Link>` with custom className (`styles.primaryBtn`, `styles.secondaryBtn`) |
| Home `FinalCTA` | Likely uses `<Button>` component (not fully read) |

**Impact:** Button hover/focus states, accessibility attributes, and visual styling may differ between pages. The `<Button>` component centralizes style changes; the raw `<Link>` implementations do not.

### 4.2 Section Header Pattern — Consistent ✅

The `indexNumber / verticalDivider / sectionLabel / metaLabel` strip pattern is used consistently across:
- Apps: FeaturedApp (01), AppsGrid (02), ProductProcess (03), TechnologyDirection (04)  
- Design: DesignWorks (01), DesignProcess (02), DesignSystemGlimpse (03)  
- Resume: ResumeSummary (01), ResumeSkills (02), ResumeEducation (03)

This is the strongest cross-page consistency in the design.

### 4.3 `<main>` Landmark — Inconsistent and Partially Broken

| Page | Has own `<main>`? | Correct? |
|---|---|---|
| `/` (Home) | No — uses `<>` fragments | ✅ Correct |
| `/about` | **Yes** — `<main id="main-content">` | ❌ Duplicate landmark |
| `/projects` | No — `<div className={styles.pageWrapper}>` | ✅ Correct |
| `/apps` | **Yes** — `<main className={styles.pageContent}>` | ❌ Duplicate landmark |
| `/resume` | No — `<>` fragment | ✅ Correct |
| `/design` | **Yes** — `<main className={styles.pageContent}>` | ❌ Duplicate landmark |
| `/contact` | No — `<div className={styles.pageWrapper}>` | ✅ Correct |

Three pages (About, Apps, Design) have duplicate `<main>` landmarks.

### 4.4 Footer — Minimal / No Navigation Links

The Footer contains only: logo + name + title + copyright. It has:
- No secondary navigation links
- No social media links
- No contact email/link
- No "Back to top" control

Every other modern portfolio footer includes at least navigation or social links. This is a missed opportunity and a UX gap compared to the richness of the page designs.

### 4.5 Hero Design Language — About vs Home vs Others

Home Hero and About Hero both use the `HeroPortrait` component (good DRY reuse). Other pages (Projects, Apps, Resume, Design, Contact) use simpler text-only hero sections with eyebrow/title/lead — a consistent pattern, but there is a visual richness gap between the home/about portrait heroes and the other pages.

---

## 5. Missing & Broken Assets

| Asset Path | Referenced In | Status | Correct Path |
|---|---|---|---|
| `/images/pattern-1.jpg` | `Hero.module.css` (CSS background-image) | **❌ MISSING** | `/design/pattern-1.jpg` |
| `/design/pattern-1.jpg` | `DesignPreview.tsx` | ✅ Exists | — |
| `/design/pattern-2.jpg` | `DesignPreview.tsx`, `DesignWorks.tsx` | ✅ Exists | — |
| `/design/scholarly-asa-ui.jpg` | `DesignHero.tsx`, `DesignWorks.tsx` | ✅ Exists | — |
| `/design/dandaza-dashboard-ui.png` | `DesignHero.tsx`, `DesignWorks.tsx`, `AboutGallery.tsx` | ✅ Exists | — |
| `/design/dandaza-settings-ui.png` | `AboutGallery.tsx` | ✅ Exists | — |
| `/design/dandaza-logo.png` | `DesignWorks.tsx` | ✅ Exists | — |
| `/design/ui-preview-1.png` | `AboutGallery.tsx` | ✅ Exists | — |
| `/design/ui-preview-2.png` | `DesignWorks.tsx`, `AboutGallery.tsx` | ✅ Exists | — |
| `/projects/dandaza-main.webp` | `src/data/projects.ts` | ✅ Exists | — |
| `/projects/dandaza-report.webp` | `src/data/projects.ts` | ✅ Exists | — |
| `/projects/dandaza-screen.webp` | `src/data/projects.ts` | ✅ Exists | — |
| `/hero-portrait-transparent.webp` | `HeroPortrait.tsx` | ✅ Exists | — |
| `/Asther_logo.png` | Header, Footer, DesignSystemGlimpse | ✅ Exists | — |

> [!WARNING]
> The missing `/images/pattern-1.jpg` is a **broken visual in the Hero section**. CSS background-image failures are silent — no error in the browser console by default, the hero pattern simply doesn't render. This should be the first bug fixed.

---

## 6. Accessibility Issues

| Severity | Issue | Location |
|---|---|---|
| 🔴 **High** | Duplicate `<main id="main-content">` landmark | `/about`, `/apps`, `/design` pages |
| 🔴 **High** | No 404 page — off-brand default error | Entire site |
| 🟡 **Medium** | Contact form opens `mailto:` with no feedback state (silent fail on mobile) | `/contact` → `ContactComposer.tsx` |
| 🟡 **Medium** | `ProjectGrid` articles use `role="button"` on `<article>` — should use `<button>` or proper link | `/projects` → `ProjectGrid.tsx` |
| 🟡 **Medium** | `ProjectCard` articles use `role="button"` on `<article>` | `/projects` → `ProjectCard.tsx` |
| 🟡 **Medium** | Hardcoded status counts ("1 Live Showcase", "2 In Development") will be stale | `/apps` → `AppsHero.tsx` |
| 🟢 **Low** | Footer has no "Back to top" or skip link equivalent beyond the header | All pages |
| 🟢 **Low** | Stale CSS comment "Space Grotesk" in `Hero.module.css` | Home page |
| 🟢 **Low** | FeaturedApp shot labels hardcoded ("DANDAZA+ // DASHBOARD", "REPORTS") | `/apps` → `FeaturedApp.tsx` |

---

## 7. Dead / Orphaned Code

### 7.1 Unused About Components (7 files + 7 CSS modules = 14 files)

These exist in `src/components/about/` but are never imported in `src/app/about/page.tsx`:

| Component | CSS Module | Notes |
|---|---|---|
| `WhoIAm.tsx` | `WhoIAm.module.css` | Older bio section |
| `ValuesMission.tsx` | `ValuesMission.module.css` | Values/mission content |
| `TechnicalDirection.tsx` | `TechnicalDirection.module.css` | Tech stack section |
| `CurrentFocus.tsx` | `CurrentFocus.module.css` | Current focus section |
| `DesignStory.tsx` | `DesignStory.module.css` | Design narrative |
| `Education.tsx` | `Education.module.css` | Education section |
| `Journey.tsx` | `Journey.module.css` | Journey/timeline |

**Recommendation:** Either delete these (if truly obsolete) or migrate content to the active page layout. They inflate the project, confuse contributors, and may import stale or incorrect data.

### 7.2 Potentially Unused `ProjectCard.tsx`

`src/components/projects/ProjectCard.tsx` defines a reusable card with 3 layout variants (`spotlight`, `diagram`, `horizontal`). However, `ProjectGrid.tsx` renders its own inline article layouts instead of using `ProjectCard`. The component may be dead code or reserved for future refactoring.

---

## 8. Mobile Responsiveness Issues

Based on CSS breakpoints observed (`768px`, `1024px`, `1200px`):

| Page/Component | Issue | Priority |
|---|---|---|
| **Home — Hero** | Portrait parallax may feel heavy on touch devices; polygon clip-path on small screens may crop the portrait unexpectedly | Medium |
| **Projects — ProjectGrid** | 3-zone flagship layout (left/center/right) likely collapses on mobile. No empty state message if `projects` array is empty | Medium |
| **Apps — FeaturedApp** | Dual overlapping screenshot composition (`primaryShot` + `secondaryShot`) may stack awkwardly on mobile | Medium |
| **Resume — ResumeHero** | Contact pill bar (4 pills in a row) may overflow or wrap unattractively below 480px | Low |
| **Design — DesignWorks** | 4-column supporting grid likely collapses to 2-col or 1-col — needs verification | Low |
| **Contact — ContactComposer** | `mailto:` behavior on mobile depends on OS mail app; no feedback to user if no app is set | High |
| **Footer** | With only logo + name + copyright, footer is fine on all screen sizes but feels sparse on desktop | Low |
| **Header** | Mobile hamburger implemented; desktop nav hidden below 768px. Logo scales via clamp. Appears solid. | ✅ OK |
| **All pages** | Dark mode has not been visually tested on mobile screen sizes | Medium |

---

## 9. Recommended Improvements

### 9.1 Critical Fixes (Bugs)

1. **Fix broken Hero pattern background:**  
   In `src/components/home/Hero.module.css`, change:
   ```css
   background-image: url('/images/pattern-1.jpg');
   ```
   to:
   ```css
   background-image: url('/design/pattern-1.jpg');
   ```

2. **Remove duplicate `<main>` landmarks:**  
   In `src/app/about/page.tsx`, `src/app/apps/page.tsx`, and `src/app/design/page.tsx`, change the `<main>` wrappers to `<div>` — the root layout already provides the single `<main>` landmark.

3. **Create a custom 404 page:**  
   Add `src/app/not-found.tsx` using the existing design system (brand colors, fonts, header, footer, a clear message and link back to home).

### 9.2 High-Priority UX

4. **Contact form — real server-side submission:**  
   Replace the `mailto:` hack in `ContactComposer.tsx` with a proper server action (Supabase `contact_messages` table, or a transactional email service). Add loading, success, and error states.

5. **Fix `role="button"` on `<article>` elements:**  
   In `ProjectGrid.tsx` and `ProjectCard.tsx`, replace `<article role="button" onClick={...}>` with a semantically correct `<button>` wrapper inside the `<article>`, or convert the article to a `<div>` with a proper interactive element.

6. **Footer — add navigation and social links:**  
   Add at minimum: secondary nav links (About, Projects, Apps, Contact), GitHub link, and optionally email. Use the existing design system — a simple `<nav>` row in the footer with token-based styling.

### 9.3 Design Polish

7. **Resolve brand color decision:**  
   Decide between:
   - **Current:** `#01605A` / `#FF862D` / `#FAF8F5` (green-teal / light orange / warm white) — already implemented, internally consistent
   - **Original spec:** `#023341` / `#FD5E02` / `#FCF5E3` (dark navy-teal / burnt orange / warm cream)  
   If reverting, update `tokens.css` (primary, comment header, RGB channels, all derived dark-mode tokens) and update `DesignSystemGlimpse.tsx` swatches.

8. **Update stale Hero.module.css comment:**  
   Change `/* Space Grotesk headings */` to `/* Archivo Black headings */`.

9. **Make `AppsHero` status counts dynamic:**  
   Replace hardcoded `"1 Live Showcase"` / `"2 In Development"` strings with props derived from the actual apps data passed to the page.

10. **Decouple `FeaturedApp` shot labels from Dandaza:**  
    `"DANDAZA+ // DASHBOARD"` and `"REPORTS"` are hardcoded in a "generic" component. Move these to the `AppItem` data type as `primaryLabel` and `secondaryLabel` fields.

### 9.4 Code Quality

11. **Delete or adopt orphaned About components:**  
    Make a decision on the 7 unused About components. If they contain valuable content, migrate it into the active page. If obsolete, delete them to clean the codebase.

12. **Clarify `ProjectCard.tsx` role:**  
    Either use `ProjectCard` in `ProjectGrid`, or document that it's reserved for future use, or delete it.

13. **Fix `ProjectGrid` hardcoded ID selectors:**  
    Replace `projects.find((p) => p.id === "dandaza-plus")` with a data-driven approach — e.g., a `featured: true` flag in the projects schema (already exists as `is_featured` in Supabase).

14. **Add empty state to `ProjectGrid`:**  
    When `projects.length === 0`, render a clear message: "No projects published yet. Check back soon."

---

## 10. Prioritized Implementation Roadmap

### P0 — Bugs to Fix Before Launch

| # | Task | File(s) | Effort |
|---|---|---|---|
| P0-1 | Fix missing `/images/pattern-1.jpg` background path | `Hero.module.css` | XS (1 line) |
| P0-2 | Remove duplicate `<main>` landmarks on About, Apps, Design | 3 page files | XS (3 changes) |
| P0-3 | Create custom 404 page | `src/app/not-found.tsx` (new file) | S (new component) |

### P1 — High-Priority Improvements

| # | Task | File(s) | Effort |
|---|---|---|---|
| P1-1 | Replace `mailto:` contact form with server action + feedback states | `ContactComposer.tsx` + new server action | M |
| P1-2 | Fix `role="button"` on `<article>` elements for accessibility | `ProjectGrid.tsx`, `ProjectCard.tsx` | S |
| P1-3 | Enrich Footer with nav links + social links | `Footer.tsx`, `Footer.module.css` | S |
| P1-4 | Decide and finalize brand palette (revert or confirm drift) | `tokens.css`, `DesignSystemGlimpse.tsx` | S–M |
| P1-5 | Make AppsHero status counts prop-driven | `AppsHero.tsx`, `apps/page.tsx` | XS |

### P2 — Design Polish & Code Quality

| # | Task | File(s) | Effort |
|---|---|---|---|
| P2-1 | Delete orphaned About components (or migrate content) | 14 files in `src/components/about/` | S |
| P2-2 | Fix stale "Space Grotesk" CSS comment | `Hero.module.css` | XS |
| P2-3 | Decouple FeaturedApp screenshot labels from Dandaza | `FeaturedApp.tsx`, `@/data/apps` type | S |
| P2-4 | Replace hardcoded ID selectors in `ProjectGrid` with `is_featured` flag | `ProjectGrid.tsx` | S |
| P2-5 | Add empty state to `ProjectGrid` | `ProjectGrid.tsx` | XS |
| P2-6 | Unify CTA button implementation (use `<Button>` component everywhere) | `AppsCTA.tsx`, `DesignCTA.tsx` | S |
| P2-7 | Add PDF CV download when document is ready | `ResumeCTA.tsx` | Future |
| P2-8 | Clarify / remove unused `ProjectCard.tsx` | `ProjectCard.tsx` | XS |
| P2-9 | Add mobile responsiveness testing for portrait clip-path, flagship grid, apps screenshot stack | Multiple components | M |
| P2-10 | Visual QA of dark mode on mobile screen sizes | All pages | M |

---

## Summary Table

| Page | Design Status | Critical Bugs | A11y Issues | Mobile Risk |
|---|---|---|---|---|
| `/` Home | ✅ Fully Redesigned | Missing pattern asset | Minor | Medium (parallax) |
| `/about` | ⚠️ Partial | Duplicate `<main>` | High | Low |
| `/projects` | ✅ Fully Redesigned | None | Medium (role=button) | Medium |
| `/apps` | ✅ Fully Redesigned | Duplicate `<main>` | Medium | Medium |
| `/resume` | ✅ Fully Redesigned | None | Low | Low |
| `/design` | ✅ Fully Redesigned | Duplicate `<main>` | Low | Low |
| `/contact` | ✅ Fully Redesigned | mailto: form | Medium | High |
| 404 | ❌ Missing | **No 404 page** | High | High |

---

*Audit complete. No files were modified during this review. All findings are based on static code inspection. Await approval before implementing any changes.*

