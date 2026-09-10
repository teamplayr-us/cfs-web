# The CFS Website Playbook — for bootstrapping sibling-brand sites

Written from the College Flag Showcase Series build (cfs-web) so another
Claude Code session can replicate the framework for a new brand site
(first use: the iFlag youth website). Give this file to the new session
as its first input and have it follow the bootstrap order at the bottom.

## Why this repo works — the load-bearing ideas

1. **Facts live in exactly one place, and it's code.** Every date, price,
   city, division, and name lives in typed `data/*.ts` files. Pages,
   FAQs, one-pagers, emails, and graphics all read from there or restate
   it verbatim. When a fact changes, every surface changes in ONE pass —
   nothing public can drift.
2. **The brand is documented, not remembered.** Four docs make any
   session productive from message one:
   - `CLAUDE.md` — repo guide: where things live, the non-negotiable
     rules, working conventions. This is what a fresh session reads first.
   - `BRAND.md` — identity: colors (exact hex), type, logo usage, voice,
     and a VOCABULARY table (what things are called, what's banned).
   - `agents/SUPPORT.md` — every approved fact and answer, policies,
     open TBDs marked "escalate." The single source for what may be said.
   - `OPERATIONS.md` — how registrations, payments, email, and the
     CRM actually flow, including env vars and manual steps.
3. **The founder vets all public copy.** The session drafts, the founder
   approves, then it ships. Facts never get invented — if something is
   missing, the session asks instead of guessing, then RECORDS the answer
   in SUPPORT.md so it's never asked twice.
4. **Deploys are verified, not assumed.** Work ships by pushing to the
   deploy branch, then curling production until the change is actually
   live (frameworks inject comment nodes into text — strip `<!-- -->`
   before grepping).
5. **Design collateral is code too.** Social graphics, one-pagers, and
   email templates are self-contained HTML in `collateral/` rendered to
   PNG/PDF with headless Chromium. Templates share one visual skeleton
   (tokens, fonts embedded as woff2, shared furniture), so every artifact
   is on-brand automatically and diffs like source code.
6. **Repeatable workflows become skills.** Anything done twice
   (announcement graphics, invitations) gets a `.claude/skills/` entry
   with the exact commands, data sources, brand rules, and captions
   pattern — so any future session executes it identically.

## The technical skeleton to replicate

- Next.js App Router; static-first; deploys from `main` (Vercel).
- `data/*.ts` for events/programs/facts; components read only from data.
- API routes for form intake → Airtable, written by FIELD ID (rename-proof),
  with graceful degradation when env vars are missing.
- Transactional email through MailerSend (`lib/email.ts` pattern:
  best-effort helper for notifications; strict dedicated calls for sends
  that must be confirmed). Email templates: 620px tables, inline styles,
  system fonts, LIGHT body (dark-mode clients force-invert dark designs),
  brand header as a pre-composed IMAGE (clients never recolor images).
- Sensitive triggered actions (like invitation sends) as key-gated API
  routes with a human confirmation page: GET shows what will happen,
  POST does it, records stamp themselves so nothing double-fires.
- Collateral pipeline: 1080×1350 social canvas; 8.5×11in one-pagers with
  a hard `scrollHeight ≤ 1056px` check; render scripts alongside each
  template; Playwright + system Chromium; fonts embedded locally.

## Working conventions (put these in the new repo's CLAUDE.md)

- Never invent a fact — data files, the CRM, or the founder; ask if missing.
- Vet public copy with the founder before it ships.
- Keep facts in sync across every surface in one pass.
- Send image/PDF deliverables as downloadable attachments (founder is
  usually on a phone).
- Commit and push when a task completes; verify production after deploys.
- Record every founder decision (with date) in the SUPPORT doc the moment
  it's made.

## What NOT to copy

- CFS's voice, vocabulary rules, and positioning are CFS's. The new brand
  needs its own BRAND.md built from founder interviews — especially the
  vocabulary table (what the events/products are called, what's banned,
  hype level, exclamation policy) and audience definitions. Do not
  inherit "series not tour," "request an invite," etc. — elicit the
  equivalents.
- Facts. Nothing from CFS data files applies. Start SUPPORT.md empty and
  fill it only with founder-confirmed iFlag facts.

## Bootstrap order for the new session

1. Read this file, then interview the founder for: brand name usage,
   colors/logo files, voice + vocabulary rules, audiences, the fact base
   (events, programs, prices, dates), and integrations (Airtable base,
   payment, email domain).
2. Scaffold the four docs (CLAUDE.md, BRAND.md, agents/SUPPORT.md,
   OPERATIONS.md) — thin is fine; they grow with every decision.
3. Define `data/*.ts` from the confirmed facts before building pages.
4. Build the site skeleton; wire forms → Airtable by field ID.
5. Stand up the collateral skeleton: one shared `<style>` skeleton with
   the new brand tokens, one render script, one proof-of-concept graphic
   for founder approval — then templatize.
6. Encode the first repeated workflow as a skill.
