# HANDOVER — Grand View Golf Club Astro Site

**Project:** Rebuilding grandviewgolf.club (WordPress) in Astro v5
**Goal:** New Astro site eventually replaces production WordPress at grandviewgolf.club
**Dev server:** `http://localhost:4321` (run `npm run dev`)
**GitHub:** https://github.com/jcoenen/grandviewgolf.club
**Production:** https://grandviewgolf.club (WordPress, still live)

---

## What Was Done This Session

### 1. Deep WordPress Investigation
Downloaded the full WordPress site files + MySQL database dump (`coenen5_wpgrand.sql`, table prefix `emm_`). Did a thorough investigation of:
- Theme files (`ashe-child/functions.php`) — found the automated "Updated:" timestamp logic
- All WordPress nav menus — extracted exact document labels and PDF URLs
- All league page `post_content` — got exact announcement text
- Plugin list — 25 plugins, key ones: `shortcodes-ultimate`, `pdf-embedder`, `wp-fastest-cache`

**Key discoveries:**
- League secretaries **only use FTP** — they never log into WordPress
- The `[su_menu name="Monday League"]` shortcode renders WordPress nav menus as PDF link lists
- The "Updated:" timestamp is PHP `glob()` + `filemtime()` on the upload folder, injected via jQuery — NOT manually typed (except on Monday Ladies which has no automated function)
- League pages are **excluded from WP cache** so the timestamp PHP runs fresh on every visit
- **Announcements are written by Travis/admin** (tbauer) in the WordPress block editor — not the secretaries
- The Majors Pool page uses **5 Google Sheets iframes** — live data, no WordPress editing needed

### 2. League Pages — Full Overhaul
- **Restructured `LeaguePage.astro`**: moved documents from sidebar into main content column (matching production layout), added Last Updated client-side HEAD fetch, removed sidebar Documents section
- **Moved league pages into subdirectories** for clean `/event-results/` sub-page URLs:
  - `src/pages/leagues/monday-ladies/index.astro`
  - `src/pages/leagues/tuesday-mens/index.astro`
  - `src/pages/leagues/wednesday-mens/index.astro`
  - `src/pages/leagues/fall/index.astro`
- **Fixed all document labels** to exactly match production WordPress nav menus (from DB):
  - "Substitute List" → "Find A Substitute"
  - "4-Card Scores" → "Scoring Average"
  - "13-Week Scores" → "Misc Stats"
  - "8-Card Scores" → "Hole Averages"
  - "Individual Scores (Gross/Net)" → "Gross Skins" / "Net Skins"
  - "Individual Scores" → "Score History"
  - "Officers" → "League Officers"
  - "Handicap Order" → "Handicap Calculation Example" (Wednesday only)
- **Fixed document order** to match production exactly
- **Added "Past Event Results"** link in each league's document list
- **Created 4 event results sub-pages**:
  - `monday-ladies/event-results.astro` — Events 1–13 (`GVML_EVENT_N.pdf`)
  - `tuesday-mens/event-results.astro` — Events 1–16 (`GVTL_EVENT_N.pdf`)
  - `wednesday-mens/event-results.astro` — Events 1–18 (`GVWL_EVENT_N.pdf`)
  - `fall/event-results.astro` — Events 1–8 (`GVFL_WKN.pdf` — note different naming)
- **Fixed Fall League season-info**: replaced table with plain paragraph text matching production; red headings for "Handicap order" and "Tee Box Color / Attire"
- **Added redirects** for old WordPress event results URLs in `astro.config.mjs`

---

## How the WordPress League System Actually Works

This is critical context for any future decisions:

```
Secretary workflow:
1. Run League Manager (old Windows software from golfsoftware.com) → generates PDFs
2. FTP upload PDFs to fixed paths:
   /wp-content/uploads/MondayLeague/     (filenames never change, overwrite in place)
   /wp-content/uploads/TuesdayLeague/
   /wp-content/uploads/WednesdayLeague/
   /wp-content/uploads/FallLeague/
3. Done. No WordPress login. No admin access needed.

"Updated:" timestamp:
- PHP scans folder with glob() + filemtime() on every page load
- Injects timestamp via jQuery into first menu item
- Automated for Tuesday, Wednesday, Fall leagues
- Monday Ladies has NO automated function (was never added)
- Our client-side HEAD fetch replicates this and is actually better

Announcements:
- Written by Travis Bauer (tbauer) in WordPress block editor
- Only Monday Ladies currently has announcement content
- Tuesday/Wednesday/Fall pages are basically just the menu shortcode
```

---

## The Big Open Question: CMS / Architecture

**This is the most important topic for next session.**

The user is considering two paths:

### Option A: Stay Astro + Add a CMS
- Add Keystatic or Decap CMS for Travis to edit announcements
- Secretaries keep FTP workflow unchanged
- Pros: Fast, cheap hosting, already mostly built
- Cons: Limited flexibility for future dynamic features

### Option B: Rebuild in React (Next.js)
- Full React frontend with SSR/ISR capabilities
- Could add proper login pages for future features
- Could build a custom lightweight admin for announcements
- Pros: More freedom, easier to add dynamic features over time
- Cons: More complex, longer to build, higher hosting cost (needs server)
- User's note: "part of me thinks we revamp to react to give us more freedom but will discuss more"

**Things to discuss:**
- What "more freedom" means specifically — what future features are envisioned?
- Hosting cost tolerance (Vercel/Netlify for Next.js vs. static hosting for Astro)
- Timeline — how soon does the site need to go live?
- Whether the announcement editing problem is the main driver or there's a bigger vision

---

## Current Page Status

| Page | Status | Notes |
|------|--------|-------|
| Home (`/`) | ✅ Done | Hero, welcome text, course photo, app icon, Facebook widget |
| Rates (`/course-info/rates/`) | ✅ Done | |
| Membership (`/course-info/membership/`) | ✅ Done | |
| Scorecard (`/course-info/scorecard/`) | ✅ Done | |
| Banquet Hall (`/course-info/banquet-hall/`) | ✅ Done | |
| Directions (`/course-info/directions/`) | ✅ Done | |
| Mobile App (`/course-info/mobile-app/`) | ✅ Done | App screenshot, App Store + Google Play links |
| Leagues hub (`/leagues/`) | ✅ Done | |
| Monday Ladies (`/leagues/monday-ladies/`) | ✅ Done | Correct labels, last-updated, event results sub-page |
| Tuesday Men's (`/leagues/tuesday-mens/`) | ✅ Done | Correct labels, last-updated, event results sub-page |
| Wednesday Men's (`/leagues/wednesday-mens/`) | ✅ Done | Correct labels, last-updated, event results sub-page |
| Fall League (`/leagues/fall/`) | ✅ Done | Correct labels, attire schedule, event results sub-page |
| Contact (`/contact/`) | ✅ Done | |
| Events (`/events/`) | ⚠️ Stub | Not compared with production yet |
| Events Calendar (`/events/calendar/`) | ⚠️ Stub | Not compared with production yet |
| **Majors Pool** | ❌ Missing | 5 Google Sheets iframes — easy to build |

---

## Next Steps (Priority Order)

1. **CMS / architecture decision** — Discuss React vs Astro+CMS. This decision affects everything else.
2. **Majors Pool page** — Simple: 5 Google Sheets iframes. Spreadsheet ID: `2PACX-1vRziz1G9Nuu4c90bOc35qtTIRzEn57vxmqRiKnM0DFSYq32ykvhhK8-GR9YPKHh3ZVmXKOJlBDLM8gU`, gids: `82074356`, `875420293`, `1908630091`, `1954967436`, `1209561614`
3. **Events pages** — Compare `/events/` and `/events/calendar/` against production
4. **Test Last Updated fetch** — Verify HEAD request works on same-origin (will be fine on grandviewgolf.club, fails on localhost due to CORS — expected)
5. **Announcements solution** — Depends on architecture decision. If staying Astro, add Keystatic for Travis.

---

## Important Files

| File | Role |
|------|------|
| `src/layouts/BaseLayout.astro` | Global layout — favicons, Facebook SDK, Chronogolf floating widget |
| `src/components/Navigation.astro` | Sticky header, dropdown nav, phone number, mobile hamburger |
| `src/components/LeaguePage.astro` | Shared league page template — last-updated HEAD fetch, main content layout |
| `src/pages/index.astro` | Homepage |
| `src/pages/leagues/monday-ladies/index.astro` | Monday Ladies with all 10 correct PDF links |
| `src/pages/leagues/tuesday-mens/index.astro` | Tuesday Men's with all 15 correct PDF links |
| `src/pages/leagues/wednesday-mens/index.astro` | Wednesday Men's with all 19 correct PDF links |
| `src/pages/leagues/fall/index.astro` | Fall League with 11 PDFs, attire schedule, handicap order |
| `src/pages/leagues/*/event-results.astro` | Past event result PDFs for each league |
| `astro.config.mjs` | URL redirects from old WordPress paths; dev CSP relaxation |
| `grandviewgolf.club/` | Full WordPress site download (not committed) |
| `grandviewgolf.club/coenen5_wpgrand.sql` | MySQL database dump (not committed) |

---

## Key Gotchas

- **Chronogolf widget** requires `<div class="chrono-bookingbutton"></div>` in DOM or it won't render
- **Favicons are JPEGs** with `.jpg` extension — not `.ico`
- **Chronogolf booking link**: `https://www.chronogolf.com/club/15033/widget?medium=widget&source=club`
- **Last-Updated HEAD fetch** will silently fail on localhost (CORS) — this is expected and by design
- **Fall League event PDFs** use `GVFL_WKN.pdf` naming, not `GVFL_EVENT_N.pdf` like the other leagues
- **Monday Ladies** has no automated timestamp on production (the PHP function was never written for it) — our HEAD fetch actually improves on this
- **DB table prefix** is `emm_` (not `wp_`) — important if querying the dump again
- **WordPress nav menus** are the source of truth for document labels and order — not page content
- **`--color-primary`** is `#00870b` (green); Chronogolf widget color override is `#dd0000` (red)
