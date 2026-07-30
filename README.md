# College Flag Showcase Series — collegeflagshowcase

Static marketing site for the **Collegiate Flag Showcase Series**, a girls
flag football college recruiting tour. Built with Next.js (App Router,
TypeScript), fully statically generated — no server runtime needed.

The page is a faithful port of the approved v1 design in
`college-flag-showcase-series.html` (kept in the repo as the design
reference).

## Run locally

```bash
pnpm install   # or: npm install
pnpm dev       # or: npm run dev
```

Open http://localhost:3000.

Production build (this is what Vercel runs):

```bash
pnpm build
pnpm start
```

## Where to edit content

All page content lives in `/data` — you can update it without touching any
component code:

| File | What it controls |
| --- | --- |
| `data/events.ts` | The tour events (`EVENTS`): the tour stop list, the hero "Next Stop" card (via `NEXT_STOP_SLUG`), and one page per stop at `/events/[slug]`. Each event has an optional `zortsUrl` for team (Showcase Tournament) registration — set it when the Zorts event for that stop goes live — and an optional `details` block (dates, divisions, entry fee, deadline) shown once announced. Adding an event to the array automatically creates its page and sitemap entry. |
| `data/links.ts` | `ATHLETE_REG_URL` (individual Combine & Camp registration — currently a `#` placeholder, TODO), `teamInviteMailto()` (builds the "Request an Invite" email link — the tournament is invite-only; the per-stop `zortsUrl` in `data/events.ts` is the private link you send to approved teams and is never shown on the site), contact email/phone, and the interest mailto link. |
| `data/colleges.ts` | Committed college board. Set a slot to `{ filled: true, name: "..." }` to fill it. |
| `data/sponsors.ts` | Sponsor board slots, same pattern. |

These files are shaped so they can later be swapped for Airtable API calls
returning the same types (nothing is wired to Airtable yet).

Design tokens (colors, fonts, spacing) are CSS custom properties at the top
of `app/globals.css` (`--navy`, `--red`, `--chalk`, …). Fonts are loaded via
`next/font` in `app/layout.tsx`. The logo is `public/logo.png` (also used as
favicon / OG image).

## Athlete registration

Native athlete (Combine & Camp) registration lives at
`/events/[slug]/register`: a 3-step form (athlete → guardian + waiver →
review) that hands off to **Stripe Checkout**; a Stripe webhook
(`/api/stripe/webhook`) then writes the paid registration to **Airtable**.
Stripe is the system of record for payments; Airtable is the ops view.

Per-stop config is the `athleteReg` block in `data/events.ts`
(`open`, `priceCents`, optional `capacity`). Pages for stops without an open
`athleteReg` show "registration opens soon". Registration pages are
`noindex` and not in the sitemap.

### Launch checklist (currently deployed dark — no public links)

1. Confirm the real athlete price in `data/events.ts` (placeholder $125) and
   replace the waiver placeholder in `lib/registration.ts` (`WAIVER_SUMMARY`).
2. Create the Airtable base + `Registrations` table (schema in
   `lib/airtable.ts` / webhook field names) and a personal access token.
3. In Stripe: create a webhook endpoint for
   `https://www.collegeflagshowcase.com/api/stripe/webhook`
   (event: `checkout.session.completed`).
4. Set the env vars from `.env.example` in Vercel and redeploy.
5. Test end-to-end with Stripe test keys (card `4242 4242 4242 4242`),
   confirm the record lands in Airtable, then swap to live keys.
6. Point `ATHLETE_REG_URL` in `data/links.ts` at
   `/events/mckinney-tx/register` — that turns the hero/event CTAs on.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), click **Add New →
   Project** and import the `cfs-web` repository.
3. Framework preset: **Next.js** (auto-detected). No environment variables
   are needed. Click **Deploy**.

### Attach the collegeflagshowcase.com domain

1. In the Vercel project, go to **Settings → Domains** and add
   `collegeflagshowcase.com` (Vercel will also offer `www.` — add it and
   redirect it to the apex, or vice versa).
2. At your DNS provider, either:
   - point the domain's nameservers at Vercel, or
   - add the records Vercel shows you (an `A` record `76.76.21.21` for the
     apex and a `CNAME` `cname.vercel-dns.com` for `www`).
3. Wait for DNS to propagate; Vercel provisions HTTPS automatically.

SEO metadata (`app/layout.tsx`), `sitemap.xml`, and `robots.txt`
(`app/sitemap.ts`, `app/robots.ts`) already assume the production URL
`https://collegeflagshowcase.com`.
