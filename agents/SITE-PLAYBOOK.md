# Site Playbook — brand-site build framework

A proven framework for building a brand's website, operations, and
design collateral in one repo with Claude Code. It is written for a
session starting from zero: follow it as instructions, not as a
description of some other project. (Maintainers: this distills the
College Flag Showcase Series build; the copy handed to sibling-brand
sessions should be exactly this file — it is deliberately
self-contained.)

## Core principles

1. **Facts live in exactly one place, and it's code.** Every date,
   price, city, division, and name lives in typed `data/*.ts` files.
   Pages, FAQs, PDFs, emails, and graphics all read from there or
   restate it verbatim. When a fact changes, update every surface in
   ONE pass — nothing public may drift.
2. **The brand is documented, not remembered.** Maintain four docs so
   any fresh session is productive from message one:
   - `CLAUDE.md` — repo guide: where things live, the non-negotiable
     rules, working conventions.
   - `BRAND.md` — identity: colors (exact hex), type, logo usage,
     voice, and a VOCABULARY table (what things are called, what's
     banned, hype level, punctuation policy).
   - `agents/SUPPORT.md` — every approved fact and answer, policies,
     and open TBDs marked "escalate." The single source for what may
     be said publicly.
   - `OPERATIONS.md` — how registrations, payments, email, and the
     CRM actually flow, including env vars and every manual step.
3. **The founder vets all public copy.** Draft, get approval, then
   ship. Never invent a fact — if something is missing, ask, then
   RECORD the answer (with date) in SUPPORT.md so it's never asked
   twice.
4. **Deploys are verified, not assumed.** Ship by pushing to the
   deploy branch, then curl production until the change is actually
   live. (Frameworks inject `<!-- -->` comment nodes into rendered
   text — strip them before grepping.)
5. **Design collateral is code too.** Social graphics, one-pagers, and
   email templates are self-contained HTML files in `collateral/`,
   rendered to PNG/PDF with headless Chromium via small render scripts
   kept alongside each template. All templates share one visual
   skeleton (CSS tokens for the palette, fonts embedded as local
   woff2, shared background furniture) so every artifact is on-brand
   automatically and diffs like source code.
6. **Repeatable workflows become skills.** Anything done twice gets a
   `.claude/skills/` entry recording the exact commands, data sources,
   brand rules, and output patterns — so it's executed identically
   every time, by any session.

## Technical skeleton

- Next.js App Router; static-first; deploys from `main` (Vercel).
- `data/*.ts` for all facts; components read only from data files.
- API routes for form intake → Airtable, written by FIELD ID (so field
  renames in the Airtable UI can't break writes), degrading gracefully
  when env vars aren't configured yet.
- Transactional email through an API provider (e.g. MailerSend): a
  best-effort helper for internal notifications (a lost email must
  never fail a form submission), and strict, checked calls for sends
  that must be confirmed before dependent records update.
- Email template rules learned the hard way: 620px table layout,
  inline styles, system fonts, and a LIGHT body — mobile dark-mode
  clients force-invert custom dark backgrounds and wreck dark designs.
  Put the dark brand header in the email as a pre-composed IMAGE;
  clients never recolor images.
- Sensitive one-tap actions (e.g. sending an official email to a
  customer from a CRM record) as key-gated API routes with a human
  confirmation step: GET renders a page showing exactly what will
  happen, a button POSTs to execute, and records stamp themselves with
  sent-at timestamps so nothing can double-fire.
- Collateral canvas standards: 1080×1350 for social feed graphics;
  8.5×11in one-pagers with a hard render-time check that page height
  stays ≤ 1056px at 96dpi (content must never spill to page two).

## Working conventions (copy into the new repo's CLAUDE.md)

- Never invent a fact — data files, the CRM, or the founder; ask if
  missing.
- Vet public copy with the founder before it ships.
- Keep facts in sync across every surface in one pass.
- Send image/PDF deliverables as downloadable attachments (the founder
  is usually on a phone).
- Commit and push when a task completes; verify production after
  deploys.
- Record every founder decision, with date, in SUPPORT.md the moment
  it's made.

## Applying this to an EXISTING repo (already building? start here)

If a site or landing page already exists, do not restart — retrofit:

1. **Inventory first.** List every page, component, form, and piece of
   public copy that exists, and every brand decision already made
   (colors, fonts, names, voice) whether it came from the founder or
   was improvised. Present the list to the founder, flagging anything
   improvised for confirmation or correction.
2. **Formalize what's confirmed.** Write the four docs from that
   inventory: confirmed decisions go into BRAND.md and SUPPORT.md with
   dates; unknowns go in as marked TBDs. From then on the docs — not
   chat memory — are the source of truth.
3. **Adopt the technical skeleton at the full-site moment.** If the
   existing repo isn't on the stack below (e.g. it's a standalone
   landing page), don't force-fit it — stand up the Next.js skeleton
   when the full site build begins and PORT the existing page into it
   as the first page, preserving its approved copy and look verbatim.
   Keep the waitlist live throughout; cut over only when the new
   deployment serves it identically.
4. **Extract hardcoded facts** out of pages/components into typed data
   files (`data/*.ts`), then make pages read from data. This is the
   single highest-value refactor: it's what makes every future fact
   change a one-pass update.
5. Continue with the interview step below for whatever the inventory
   showed as missing, then follow the rest of the bootstrap order for
   pieces that don't exist yet (collateral skeleton, skills, CRM
   wiring).

## Bootstrap order

1. Interview the founder BEFORE building or writing anything:
   - Brand: exact name and allowed short forms, logo files, colors,
     voice (hype level, punctuation policy), banned words/phrasings,
     and what every product/event is officially called.
   - Audiences: who the site speaks to, and in what priority.
   - Facts: events, programs, prices, dates, locations — only what the
     founder confirms goes in.
   - Integrations: Airtable base (if any), payment processor, email
     provider and sending domain, hosting.
2. Scaffold the four docs. Thin is fine — they grow with every
   decision.
3. Define `data/*.ts` from the confirmed facts before building pages.
4. Build the site skeleton; wire forms → Airtable by field ID.
5. Stand up the collateral skeleton: one shared style skeleton carrying
   the brand tokens, one render script, one proof-of-concept graphic
   for founder approval — then templatize.
6. Encode the first repeated workflow as a skill.
