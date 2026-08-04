# College Flag Showcase — Operations Manual

Every workflow, automation, and integration behind collegeflagshowcase.com,
and the runbook for operating them. Companion docs: `BRAND.md` (design/voice),
`README.md` (developer setup).

---

## 1. System map

```
Visitor
  │
  ├─ Athlete registration   /events/[slug]/register
  │     form → /api/checkout → Stripe Checkout (payment)
  │     Stripe webhook → /api/stripe/webhook → Airtable "Athlete Registrations"
  │
  ├─ Team invite request    /events/[slug]/invite
  │     form → /api/team-invite → Airtable "Team Invite Requests"
  │     → YOU review → email private Zorts link → update Status
  │
  ├─ Sponsor interest       /sponsors/interest
  │     form → /api/sponsor-interest → Airtable "Sponsor Interest"
  │     → YOU review → reply with package + next steps → update Status
  │
  ├─ Coach registration     /colleges/register
  │     form → /api/coach-register → Airtable "Coach Registrations"
  │     → YOU confirm credentials by email → update Status
  └─ Interest list          homepage #interest → email to info@…
```

- **Website**: Next.js on Vercel. Deploys automatically on every push to
  `main` (github.com/teamplayr-us/cfs-web). Live in ~1–2 minutes.
- **Payments**: Stripe — the system of record for all money. Currently in
  TEST mode (see §6).
- **Ops database**: Airtable base **College Flag Showcase**
  (`app0mk0cTZLDeVahe`), two tables (§3).
- **Athlete profiles**: Flag Football Finder (separate product; the reg form
  captures an optional FFF profile link).

## 2. Automated flows

### 2a. Athlete registration (fully automated)

1. Parent fills the 3-step form (athlete → guardian + waiver → review).
2. `/api/checkout` re-validates, checks capacity (if set), creates a Stripe
   Checkout session. Registration data rides in the session metadata.
3. Parent pays on Stripe's hosted page ($125 — placeholder, see §7).
   Stripe emails the receipt.
4. Stripe fires `checkout.session.completed` → `/api/stripe/webhook`
   verifies the signature and writes the row to **Athlete Registrations**
   with Status **Paid**. Duplicate deliveries are detected by Stripe session
   ID — never two rows for one payment. If the Airtable write fails, the
   webhook errors so Stripe retries; a paid registration cannot be silently
   lost.
5. Parent lands on the "You're In" confirmation page.

**Nobody does anything manually here.** Check the table before each event
for the roster; use Airtable views to filter by Event Slug.

### 2b. Team invite request (automated intake, manual decision)

1. Coach fills the form (team, coach name, contact, location, age groups,
   background, link, events they want to play). Spam is filtered by a
   honeypot field.
2. `/api/team-invite` validates and writes to **Team Invite Requests**
   with Status **New**.
3. **Manual (you):** review the program → email the private Zorts
   registration link (the `zortsUrl` per event in `data/events.ts`) to
   invited teams → set Status **Invited** or **Declined**. The site never
   shows Zorts links publicly.
4. **When a team accepts** (registers via Zorts): add the program to
   `ORGS_BY_EVENT` in `data/organizations.ts` under the event's slug
   (name required; logo optional in `public/programs/`) and push — the
   event page's "Competing Programs" board updates on deploy.

### 2c. Sponsor interest (automated intake, manual close)

1. Sponsor fills the form at `/sponsors/interest` (company, contact,
   package interest, markets, message). Every sponsor CTA on `/sponsors`
   links here; tier-card buttons pre-select the package
   (`?package=presenting|season|single`). Spam is filtered by a honeypot.
2. `/api/sponsor-interest` validates and writes to **Sponsor Interest**
   with Status **New**.
3. **Manual (you):** reply from info@ with the one-pager
   (`collateral/cfs-sponsorship-one-pager.pdf`) and pricing → move Status
   through **Contacted → Won / Passed**. When a deal closes, add the logo
   to `data/sponsors.ts`.

### 2d. Coach registration (automated intake, manual credentialing)

1. Coach fills the form at `/colleges/register` (program, name, role,
   level, school email, events they plan to attend, recruiting notes).
   Free — no payment. Spam is filtered by a honeypot.
2. `/api/coach-register` validates and writes to **Coach Registrations**
   with Status **New**.
3. **Manual (you):** verify the program is real (school site/roster) →
   reply from info@ confirming credentials → set Status **Credentialed**
   (or **Declined**). Before each event, send credentialed coaches the
   expected participant counts and combine-data access details.
4. When a program confirms attendance for an event, add it to
   `COLLEGES_BY_EVENT` in `data/colleges.ts` (logo in
   `public/colleges/`, -mono variant for the dark board) so it shows on
   the Committed Colleges board.

**Habit:** check all intake tables for Status = New a few times a week (or
add an Airtable notification automation on record creation).

## 3. Airtable base (College Flag Showcase · app0mk0cTZLDeVahe)

| Table | ID | Written by | Purpose |
| --- | --- | --- | --- |
| Athlete Registrations | `tblmp5EHSrHHaxjpD` | Stripe webhook | Paid combine/camp registrations |
| Team Invite Requests | `tblqtHoZgqgkNTgle` | Invite form API | Tournament invite pipeline |
| Sponsor Interest | `tblW8wpENPt3yQDB0` | Sponsor form API | Sponsorship sales pipeline |
| Coach Registrations | `tblCZuBfVMjkEo5c5` | Coach form API | College coach credentialing |

Rules:
- The site writes by **field ID**, so you can rename fields freely — with
  two exceptions marked ⚠️ DO NOT RENAME in their field descriptions:
  **"Stripe Session"** and **"Event Slug"** (queried by name for duplicate
  checks and capacity counts).
- Don't delete rows in Athlete Registrations to "undo" a registration —
  refund in Stripe first (§5), then set Status **Refunded**.
- Adding columns is always safe; the site ignores them.

## 4. Manual (email-based) workflows

All arrive at **info@collegeflagshowcase.com** with a subject that
identifies the flow:

| Subject contains | From | Your action |
| --- | --- | --- |
| "Coach Registration" | /colleges CTAs | Reply with credential details; add the program to `data/colleges.ts` under its event (logo → `public/colleges/`, knockout version for dark boards) |
| "Sponsorship" | /sponsors CTAs + one-pager | Send `collateral/cfs-sponsorship-one-pager.pdf`, negotiate; add signed sponsors to `data/sponsors.ts` |
| "Interest" | homepage interest section | Add to your interest list (consider a table later) |

⚠️ **Prerequisite:** the info@collegeflagshowcase.com mailbox must exist /
forward somewhere monitored. Everything in this section depends on it.

Also note: two **Make.com scenarios** are subscribed to the same Stripe
account's events (hook.us1.make.com/...). They receive CFS checkout events
too — make sure they ignore events that aren't theirs.

## 5. Stripe runbooks

- **Refund:** Stripe Dashboard → Payments → find the payment → Refund.
  Then set the row's Status to **Refunded** in Airtable. (Auto-sync on
  `charge.refunded` is a possible future automation — not wired.)
- **Webhook failing:** Stripe → Developers → Webhooks → endpoint → look at
  delivery attempts. 400 = signing secret mismatch; 500 = Airtable write
  failed (check Vercel Logs for the `Airtable write failed` line and
  https://www.collegeflagshowcase.com/api/health for config state). After
  fixing, click **Resend** on the failed event — no data is lost.
- **Never** use Stripe's "Send test event" button — synthetic events lack
  registration metadata.

## 6. Going live on Stripe (still pending)

1. Toggle Stripe to Live mode; get the live secret key (`sk_live_…`).
2. Create a **new** webhook endpoint in live mode (same URL
   `https://www.collegeflagshowcase.com/api/stripe/webhook`, same single
   event `checkout.session.completed`); copy its live `whsec_…`.
3. In Vercel → Settings → Environment Variables: replace
   `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` with live values →
   Redeploy.
4. Real cards now work; test cards stop working.

## 7. Content updates (edit → commit to main → auto-deploy)

| To change… | Edit… |
| --- | --- |
| Event dates, venues, prices, tags, combine day/times, Zorts links, tournament dates | `data/events.ts` (adding an event auto-creates its page, nav entries, sitemap, forms) |
| Which event the homepage features | `NEXT_STOP_SLUG` in `data/events.ts` |
| Committed colleges per event | `data/colleges.ts` (+ logo in `public/colleges/`) |
| Competing programs per event (accepted tournament teams) | `data/organizations.ts` (+ logo in `public/programs/`) |
| Sponsors board | `data/sponsors.ts` |
| Contact email/phone, registration links | `data/links.ts` |
| Athlete price | `athleteReg.priceCents` in `data/events.ts` — **still the $125 placeholder; confirm before launch** |
| Waiver text | `WAIVER_SUMMARY` in `lib/registration.ts` — **still placeholder; replace with real legal text before live payments** |

## 8. Environment variables (Vercel → Settings → Environment Variables)

| Var | Value | Purpose |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | `sk_test_…` (→ `sk_live_…` at launch) | Create checkout sessions |
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` (per mode) | Verify webhook signatures |
| `AIRTABLE_API_KEY` | `pat…` (scopes: records read+write on the base) | All Airtable writes |
| `AIRTABLE_BASE_ID` | `app0mk0cTZLDeVahe` | The base |
| `AIRTABLE_TABLE` | `tblmp5EHSrHHaxjpD` | Athlete Registrations table |
| `AIRTABLE_TEAM_TABLE` | (optional; defaults in code to `tblqtHoZgqgkNTgle`) | Team Invite Requests table |

Changes take effect only after a **Redeploy**.

## 9. Diagnostics

- **https://www.collegeflagshowcase.com/api/health** — shows which env vars
  are set (never their values) and live-probes Airtable read access.
- **`/api/health?write=1`** — additionally replays the webhook's exact
  Airtable sequence with a throwaway record (created, then deleted).
- **Vercel → Logs** — runtime errors from all `/api/*` routes.
- **Stripe → Webhooks → endpoint** — delivery history with per-attempt
  status and response bodies.

## 10. Possible future automations (not built — ideas parking lot)

- Auto-set Status **Refunded** from Stripe `charge.refunded` events
- Email notification (or Airtable automation) on new team invite requests
- Confirmation email with event details from our own domain (currently
  Stripe's receipt is the only automated email)
- Interest list as an Airtable table + form instead of mailto
- Combine results pipeline: Athlete Registrations → verified metrics →
  Flag Football Finder profiles
