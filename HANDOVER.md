# HANDOVER — Grand View Golf Club Astro Site

**Project:** Rebuilding grandviewgolf.club (WordPress) in Astro v5
**Goal:** New Astro site eventually replaces production WordPress at grandviewgolf.club
**Dev server:** `http://localhost:4321` (run `npm run dev` or `bun dev`)
**GitHub:** https://github.com/jcoenen/grandviewgolf.club
**Production:** https://grandviewgolf.club (WordPress, still live)

---

## What Was Done This Session

### League Pages — Major Overhaul
This session was focused entirely on the four league pages.

1. **`LeaguePage.astro` component** — restructured layout to match production:
   - Documents moved from sidebar into **main content column** (was in sidebar before — user flagged this as wrong)
   - New section order: Announcements → Last Updated → League Reports → Season Info
   - Sidebar now only has Quick Links
   - Removed the fancy `.doc-list` card styling in favor of plain `<ul>/<li>` text links matching production

2. **Dynamic "Last Updated" timestamp** — implemented client-side fetch:
   - Each league page passes a `keyFileUrl` prop pointing to its most-frequently-updated PDF
   - Client-side script does a `HEAD` request and reads the `Last-Modified` header
   - Updates the page dynamically — works even after deployment when FTP updates the PDF
   - Falls back gracefully (removes element) if header missing or fetch fails

3. **All four league pages updated** with real production PDF URLs:
   - **Monday Ladies** (9 docs) — keyFile: `GVML2A.pdf` (Current Event Pairings)
   - **Tuesday Men's** (14 docs) — keyFile: `GVTL2A.pdf`
   - **Wednesday Men's** (17 docs) — keyFile: `GVWL2A.pdf` (has unique Officers + Handicap PDFs)
   - **Fall League** (11 docs) — keyFile: `GVFL_TeamStandings.pdf`; also has schedule/attire table + handicap order content

4. **PDF URL pattern confirmed** — all files live at:
   - `https://grandviewgolf.club/wp-content/uploads/MondayLeague/GVML_*.pdf`
   - `https://grandviewgolf.club/wp-content/uploads/TuesdayLeague/GVTL_*.pdf`
   - `https://grandviewgolf.club/wp-content/uploads/WednesdayLeague/GVWL_*.pdf`
   - `https://grandviewgolf.club/wp-content/uploads/FallLeague/GVFL_*.pdf`
   - These files are uploaded by the club admin via FTP — the site just links to them directly

---

## Key Decisions Made

### Announcements are manually managed
Production WordPress pages are **hand-edited each week** by Travis Bauer. He types circles, birdies, and the "Last Updated" stamp directly in the WordPress block editor. There is no CMS API or dynamic source.

**Implication for Astro site:** Announcements currently live in the `.astro` files and would need to be manually updated the same way. This was flagged as a potential problem.

### CMS discussion — not resolved yet
User raised whether Astro was the wrong choice given the manual update workflow. Decision was deferred. Recommended path is **Astro + Tina CMS or Decap CMS** (git-based headless CMS with a visual editor UI). Full React rewrite was considered overkill. User wants to revisit this next session with more context/credits.

### "Last Updated" — client-side HEAD fetch (not build-time)
Production WordPress uses a manually typed timestamp. We replaced it with an automatic approach: client-side `fetch(url, { method: 'HEAD' })` reads the PDF's `Last-Modified` HTTP header. This is superior to build-time because it stays accurate even after FTP uploads post-deployment. Works fine once site is on grandviewgolf.club (same origin, no CORS issues).

---

## Production vs Dev — What's Done

| Page | Status |
|------|--------|
| Home (`/`) | ✅ Done — hero, welcome text, course photo, app icon, Facebook widget |
| Rates (`/course-info/rates/`) | ✅ Done |
| Membership (`/course-info/membership/`) | ✅ Done |
| Scorecard (`/course-info/scorecard/`) | ✅ Done |
| Banquet Hall (`/course-info/banquet-hall/`) | ✅ Done |
| Directions (`/course-info/directions/`) | ✅ Done |
| Mobile App (`/course-info/mobile-app/`) | ✅ Done — screenshot, App Store + Google Play links |
| Leagues hub (`/leagues/`) | ✅ Done |
| Monday Ladies (`/leagues/monday-ladies/`) | ✅ Done — real PDF links, last-updated |
| Tuesday Men's (`/leagues/tuesday-mens/`) | ✅ Done — real PDF links, last-updated |
| Wednesday Men's (`/leagues/wednesday-mens/`) | ✅ Done — real PDF links, last-updated |
| Fall League (`/leagues/fall/`) | ✅ Done — real PDF links, schedule table, last-updated |
| Events (`/events/`) | ⚠️ Stub — not compared with production yet |
| Events Calendar (`/events/calendar/`) | ⚠️ Stub — not compared with production yet |
| Contact (`/contact/`) | ✅ Done |
| **Majors Pool** | ❌ Missing — exists on production, not created yet |

---

## Next Steps (Priority Order)

1. **CMS decision** — Revisit Tina CMS or Decap CMS to give Travis a UI for weekly announcement updates (circles/birdies). This is the most important unresolved architectural question.

2. **Announcements content** — Until CMS is decided, optionally extract announcement content into simple JSON/markdown files so they're easier to edit without touching layout code.

3. **Events pages** — Compare `/events/` and `/events/calendar/` against production and fill in real content.

4. **Majors Pool page** — Exists on production at some URL, not yet created in Astro. Need to find the production URL and replicate.

5. **Test "Last Updated"** — Verify the client-side HEAD fetch actually works for PDF files on grandviewgolf.club (may need CORS headers to work from localhost during dev; will work fine when site is on the same domain).

6. **URL redirects** — Already configured in `astro.config.mjs` for old WordPress URLs. Verify all work.

---

## Important Files

| File | Role |
|------|------|
| `src/layouts/BaseLayout.astro` | Global layout — head tags, Facebook SDK, Chronogolf floating widget |
| `src/components/Navigation.astro` | Sticky header with dropdown nav, phone number, mobile hamburger |
| `src/components/LeaguePage.astro` | Shared template for all league pages — handles last-updated fetch |
| `src/pages/index.astro` | Homepage — hero, welcome text, app promo, Facebook embed |
| `src/pages/leagues/monday-ladies.astro` | Monday Ladies with all 9 real PDF links |
| `src/pages/leagues/tuesday-mens.astro` | Tuesday Men's with all 14 real PDF links |
| `src/pages/leagues/wednesday-mens.astro` | Wednesday Men's with all 17 real PDF links |
| `src/pages/leagues/fall.astro` | Fall League with 11 PDF links, schedule table, handicap order |
| `astro.config.mjs` | URL redirects from old WordPress paths; dev CSP relaxation |
| `public/images/` | hero-banner.jpg, course-main.jpg, app-icon.png, app-screenshot.png, badges |
| `public/favicon-32.jpg` | Favicon (JPEG format, not .ico) |

---

## Gotchas & Technical Notes

- **Chronogolf widget** requires BOTH `<div class="chrono-bookingbutton"></div>` in the DOM AND `<script is:inline src="...">` — missing the div prevents the widget from rendering
- **Favicons are JPEGs** with `.jpg` extension — not `.ico` or `.png` despite the name
- **Chronogolf booking link** must be `https://www.chronogolf.com/club/15033/widget?medium=widget&source=club` — not the plain club URL
- **Facebook SDK** `appId=576823465693057` is in BaseLayout
- **`--color-primary`** is `#00870b` (green); Chronogolf widget color override is `#dd0000` (red)
- **PDF Last-Modified HEAD fetch** will be blocked by CORS during local dev (PDFs are on grandviewgolf.club). This is expected and fine — it works on the live domain. The element gracefully removes itself on fetch failure.
- **Announcements are static** in the `.astro` files right now — they need manual edits to update, same as WordPress. A CMS would solve this.
- **Wednesday Men's** is the most complex league — has extra Officer and Handicap PDFs, and Net standings split into B and CD divisions
