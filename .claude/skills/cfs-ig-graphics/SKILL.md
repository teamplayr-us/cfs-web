---
name: cfs-ig-graphics
description: >-
  Create on-brand College Flag Showcase Series social graphics from the HTML
  templates in collateral/ — committed-college announcements, event teasers,
  explainer carousels, schedule posts, and new one-off announcement images.
  Use this whenever the user asks for an Instagram/IG/social post, story
  graphic, announcement image ("announce [college]", "post about X", "make a
  graphic for..."), or any branded image for the series — even if they don't
  say "Instagram" explicitly. Also use it when adapting an existing collateral
  template to new content.
---

# College Flag Showcase Series — Instagram Graphics

Every graphic is a self-contained HTML file in `collateral/` rendered to PNG
with headless Chromium. Edit or clone a template, render, **show the user the
PNG**, iterate on their feedback, then commit both the HTML and PNG to
`collateral/`.

## Brand rules (non-negotiable, learned from the founder)

- It's a **series**, never "a tour". Positioning line: "Girls National
  Recruiting Series". Never abbreviate the brand to "CFS" in anything public —
  always "College Flag Showcase Series" in written copy. (The logo artwork
  itself reads "Collegiate Flag Showcase Series" — that's the mark, not the
  written name; don't "correct" either one to match the other.)
- Name the sport — **girls flag football** — on brand-level graphics
  (teasers, explainers): the logo alone doesn't say it, and the founder has
  flagged its absence before. Templates the founder has already approved
  (e.g. the committed-college template) stand as approved; when creating a
  NEW graphic, check the sport is named somewhere before showing it.
- The heart of the pitch is the athlete **showing her game individually**
  (skill work, 1v1s, in front of college coaches). Don't over-rotate on
  "verified" / combine-testing language — measurement supports the story, it
  isn't the story.
- Tournament is **invite-only**: teams "request an invite", never "sign up" or
  "register". Athlete-facing tag: "invited teams only". Don't call it
  "bracketed" (format is group stage + playoffs; just say "5v5 competition").
- No exclamation marks, no hype-fluff, no invented facts. Every date, price,
  city, stat, college, coach name, and division must come from the repo data
  files (`data/events.ts`, `data/colleges.ts`, `data/organizations.ts`,
  `data/pathway.ts`), the Airtable base, or the user. If a fact is missing,
  ask — don't guess.
- Current sport stat if needed: **90+ college programs** (founder-confirmed
  Aug 2026; also in `data/pathway.ts`).
- Copy style: short staccato lines, athlete-first, confident. F3-style
  explainer structure works well: definition → contrast line → bold punchline
  (e.g. "Games show coaches your team. This weekend shows them you.").

## Visual system

All templates share the same skeleton — reuse it for new graphics:

- Canvas: **1080×1350 (4:5)** for feed posts (the founder's preference);
  1080×1080 square variants exist for the teaser.
- Tokens: navy `#110C0F` background, pink `#FF2D87` accent, chalk `#F5F2F0`,
  steel `#8A848C`. Fonts embedded from `collateral/fonts/` — Big Shoulders
  Display (display), Archivo (body), JetBrains Mono (kickers/labels).
- Shared furniture: faint yard-line grid (`.yards`), side hash marks
  (`.hash`), inset border (`.frame`), pink mono kicker line, pink rule +
  mono site URL footer. Copy the `<style>` block from an existing template
  rather than rebuilding it.
- Series logo: `../public/logo.png` (relative to `collateral/`).
- College logos: use the white-knockout `*-mono.png` files in
  `public/colleges/` (built for dark backgrounds). Program (travel team)
  logos: `public/programs/*.png`.

## Existing templates

| File (in `collateral/`) | What it is |
| --- | --- |
| `ig-college-committed.html` | **Parameterized template** — committed-college announcement ({{NAME}}, {{LOGO}}, {{COACH}}, {{DIVISION}}, {{EVENT_LINE}}, {{CITY}}) |
| `ig-teaser-ball-out.html` / `-4x5.html` | Brand teaser — "Ball Out. Get Seen. Get Recruited." |
| `ig-carousel-what-is.html` | 4-slide explainer carousel (cover + combine + skills showcase + tournament) |
| `ig-schedule-2026-27.html` | Season schedule list post |
| `ig-athlete-committed.html` | Athlete "She's In." announcement — covered by the separate `cfs-athlete-announcements` skill; use that skill for athlete posts |

## Workflow 1 — Committed-college announcement

1. **Get the facts.** Coach name, title, and division come from the Coach
   Registrations Airtable table (base `app0mk0cTZLDeVahe`, table
   `tblCZuBfVMjkEo5c5`) — never invent them. Records come back keyed by
   field ID: `fldNjZFox9FVxi5cZ` first name, `fldoe7n1csAhlHNo6` last name,
   `fldQZh36x6uGV7mle` title, `fldXCkBRKRimSP4ai` division,
   `fld6cOxBJa4pxIYwt` school, `fldsQJxM4a1XoPhTE` event,
   `fld4L5p35saiU7wPw` email. If the college has no registration row (some
   board colleges were added manually), ask the user for coach + division.
2. **Check the logo** exists in `public/colleges/` (`*-mono.png`). If the
   college is new, ask the user for the athletic logo (athletic mark, not the
   university seal) and process a white-knockout mono version first.
3. **Render:**
   ```bash
   node collateral/render-college-announce.mjs \
     "Cairn University" cairn-mono.png "Head Coach Mike Landis" "NCAA DIII"
   ```
   Optional args 5–7: event line, city, output filename (defaults are the
   Dallas Event 01 values). If Playwright can't find a browser, set
   `CHROMIUM_PATH` (see "Rendering" below).
4. Output lands at `collateral/ig-committed-<school>.png`. Send it to the
   user, iterate, commit.

## Workflow 2 — New or adapted graphic

1. Clone the closest existing template to a new descriptive filename in
   `collateral/` (keep the shared `<style>` skeleton).
2. Draft the copy from real facts and the brand rules above. For anything
   beyond boilerplate, show the user the copy or the rendered draft before
   treating it as final — the founder vets copy.
3. Render with Playwright (below), send the PNG, iterate.
4. Multi-slide carousels: stack `.slide` divs in one HTML file and screenshot
   each with `clip: {x: 0, y: i * 1350, width: 1080, height: 1350}` and a
   viewport tall enough to hold all slides.

## Rendering

Templates are file-URL loadable — no server needed. Generic render script:

```js
import { chromium } from "playwright"; // or the global install (see below)
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto("file:///abs/path/to/collateral/the-file.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: "/abs/path/to/collateral/the-file.png" });
await browser.close();
```

Environment notes (cloud sandbox):

- Playwright lives at `/opt/node22/lib/node_modules/playwright/index.mjs` —
  import that path directly if `import "playwright"` fails.
- Chromium binary: look under `/opt/pw-browsers/` (e.g.
  `chromium_headless_shell-*/chrome-linux/headless_shell`) and pass it as
  `executablePath` / `CHROMIUM_PATH`. Do not run `playwright install`.
- Fonts are embedded locally, so no network access is needed; Google Fonts
  would be blocked by the sandbox proxy anyway.
- Verify the render by reading the PNG before sending — check for text
  overflow, awkward wraps (wrap college/program names in no-break spans if
  needed), and that nothing fell off the canvas.

## Finishing

- Send the PNG(s) to the user in the conversation — the graphic is the
  deliverable, not the file path.
- Commit the HTML + PNG together to `collateral/` with a short message and
  push per the session's git conventions.
- If a fact changed that also lives on the site (new college, new price, new
  date), flag it so the site and design system stay in sync — the graphic is
  never the only place a fact should live.
