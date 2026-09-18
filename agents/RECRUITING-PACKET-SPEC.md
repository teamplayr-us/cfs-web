# Athlete Recruiting Packet & Guest Player Pool — Spec

Standing spec for the recruiting deliverable college coaches receive and
the guest-player system for team-less athletes. Decisions here were made
with the founder (Sep 2026); open items are marked. Companion docs:
`OPERATIONS.md` (registration plumbing), `agents/SUPPORT.md` (approved
public copy), `agents/EXPERIENCE-STANDARDS.md` (every flow must pass).

## 1. Product shape — a coach prospect board, not a PDF

The "recruiting package college coaches receive" is a gated web mini app
on the existing Next.js site (working name: coach prospect board), alive
before, during, and after each event. A PDF snapshot can be exported
post-event for coaches who want a file, but the app is the product.

Why an app: the three founder-required elements — where and when an
athlete is playing, her key info and contact, and saving target
prospects — and the third is impossible in a static file. Watchlists are
also intelligence: they show which programs are interested in which
athletes.

Infrastructure: same stack and patterns already proven — Next.js route,
Airtable backend, key/magic-link gating like `/api/send-invite`,
MailerSend for notifications.

## 2. Flag Football Finder is the profile layer

Athlete profiles live on Flag Football Finder, not in the packet. The
board is the curated event-weekend lens over FFF profiles.

- Registration captures the minimum (name, grad year, position, club,
  guardian contact). The confirmation flow and a follow-up email push
  the athlete to create/link her FFF profile with film and details.
- Athlete effort is rewarded, nobody is excluded: with an FFF profile
  the coach sees a rich card; without one, registration basics plus
  verified combine numbers.
- Every registration is also an FFF acquisition.

OPEN: whether FFF can expose profiles via API or an Airtable sync (like
the existing FFF org/team sync) so cards enrich automatically, vs. the
athlete pasting her profile link. Founder to confirm.

## 3. Athlete data model

Three states, all rooted in the Athlete Registrations table:

1. **Registered** — paid camp registration (exists today).
2. **Profiled** — linked FFF profile (field exists; prompt to be
   strengthened at launch).
3. **Available** — opted into the guest player pool (new, below).

## 4. The coach board (college coaches)

- **Access:** one magic link per credentialed coach (Coach
  Registrations, Status Credentialed), emailed at credentialing.
  Per-coach identity is required for watchlists.
- **Roster view:** all registered athletes, filterable by grad year,
  position, division.
- **Athlete card:** name, grad year, position, club team, hometown,
  verified combine numbers (event weekend), FFF profile + film link,
  guardian contact. Contact is always the guardian — athletes are
  minors — and only credentialed coaches ever see it.
- **Where she's playing:** Friday = combine group and time; Sat–Sun =
  her team's game schedule and field (from the ISI/Zorts schedule when
  published).
- **Watchlist:** per-coach saves to a Coach Watchlist table in
  Airtable. Post-event it doubles as the coach's follow-up sheet.

OPEN: what belongs on the card vs. FFF's job (e.g. GPA/academics).

## 5. Guest player pool

For athletes registering for the Showcase Combine & Camp who want to
compete in the Showcase Tournament but don't have a team. Vocabulary
stays invite-only-safe: the athlete joins a pool and is placed with an
invited team; she never "signs up" for the tournament.

### Opt-in (ships with registration launch)

- One checkbox step on the athlete registration form + her division
  (derivable from birthdate; Zorts verifies age as of Aug 1 anyway).
- Rides through Stripe checkout metadata; lands as new fields on the
  Athlete Registrations row (add columns — safe per OPERATIONS §3).
- No placement guarantee — stated plainly in the opt-in copy.
- Must ship WITH the launch: retrofitting opt-ins means chasing
  families by email.

### Pool view (club coaches of registered teams)

- **Access:** magic link per ORGANIZATION with ≥1 team Registered in
  Team Invitations — read from the CRM; sent to the Opportunity's
  coach contact. Invited-but-unregistered orgs do NOT see the pool
  (one more reason to complete registration).
- **Shows:** pool grouped by division — name, position, age division,
  hometown, FFF profile link if present. Filterable to the org's own
  divisions. NO direct guardian contact.

### Request-based contact (DECIDED — founder, Sep 2026)

Club coaches never get direct contact info. The coach taps "request
this player" → row lands in a Guest Player Requests table → guardian
gets a MailerSend note ("Coach X from [org] would like to add your
daughter as a guest player for [division]") including the coach's
contact, and the family decides who they talk to. Rationale: families
opt into every conversation, every match is visible in the CRM, and
misuse can be monitored and throttled. Roster mechanics then run
through Zorts like any other player.

OPEN: founder ruling that guest players owe nothing beyond camp
registration (team entry is the team's $550; assumed yes).

## 6. Build order

1. **With registration launch:** guest-pool opt-in on the form + FFF
   profile prompt in confirmation flow/email.
2. **Launch + ~2 weeks:** guest pool view for club coaches — first
   live slice of the mini app; proves the magic-link pattern.
3. **October:** coach prospect board MVP — roster, cards, filters,
   watchlists.
4. **Event week:** combine groups, then live verified numbers on cards
   (the OPERATIONS parking-lot "combine results → FFF" pipeline).
5. **Post-event:** PDF snapshot export; watchlist-driven follow-up.

## 7. Airtable additions (when built)

- Athlete Registrations: guest-pool opt-in (checkbox) + division.
- Coach Watchlist: coach ↔ athlete saves.
- Guest Player Requests: org/coach ↔ athlete requests + status
  (Requested / Guardian Notified / Connected / Declined) — the
  monitor/throttle surface.

## 8. Public-copy rule

The packet stays publicly NAMED, never itemized ("the recruiting
package college coaches receive"). Everything in this spec is internal
until the founder vets specific public copy (opt-in text, FAQ lines,
request email).
