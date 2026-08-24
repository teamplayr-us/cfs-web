# College Flag Showcase Series — repo guide

This repo is the website AND the brand home for the College Flag Showcase
Series (girls flag football national recruiting series). Sessions here
produce public-facing work — read the brand sources before writing any
copy or creating any document.

## Brand sources of truth (read before producing anything public)

- `BRAND.md` — identity, colors, type, motifs, voice, vocabulary rules
- `SOCIAL.md` — social content brief
- `agents/SUPPORT.md` — every approved fact and answer, policies, TBDs
- `data/*.ts` — the only source for event facts (dates, prices, cities,
  divisions, colleges, programs)

## Non-negotiable rules (the founder enforces these)

- Never invent a fact. Dates, prices, names, divisions, stats come from
  the data files, Airtable, or the founder — if missing, ask.
- Vet copy with the founder before publishing anything public-facing.
- It's a **series**, never "a tour"; events, never "stops"; never
  abbreviate to "CFS" publicly; teams "request an invite", never
  "sign up"; don't call the tournament "bracketed".
- No exclamation marks, no hype-fluff. Athlete-first voice.
- The series is independent — never "a 5v5 Sports production".
- The athlete recruiting package's contents are deliberately not
  committed publicly — name it, don't itemize it.
- Send image/PDF deliverables to the founder as downloadable attachments
  (they work from a phone).

## Where things live

- `app/`, `components/`, `data/` — Next.js site (deploys from `main` via
  Vercel; the working branch gets pushed to `main` to ship)
- `collateral/` — one-pagers + IG graphic templates (HTML → Playwright →
  PNG/PDF; render scripts alongside)
- `.claude/skills/` — cfs-ig-graphics, cfs-athlete-announcements,
  cfs-org-announcements (use them for any social graphic)
- `agents/` — intelligence docs for future agents (support today)
- `OPERATIONS.md` — how registrations, emails, Stripe, and Airtable work

## Conventions

- Commit and push work when a task completes; site changes ship by
  pushing the working branch to `main` (this deploys immediately —
  verify on production after).
- Keep facts in sync across every surface: site, FAQ, one-pagers,
  SUPPORT.md, and the design system all state the same thing. When a
  fact changes, update all of them in one pass.
