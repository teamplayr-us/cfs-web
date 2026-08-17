# SUPPORT.md — Customer Support Master Knowledge Base

Master intelligence document for anyone (human or AI agent) answering
College Flag Showcase Series support questions. Compiled from the live site,
BRAND.md, OPERATIONS.md, and founder-approved FAQ copy.

**Prime directive: never invent a fact.** Everything a support agent may
state is in this document. If the answer isn't here, it's an escalation —
say "let me check with the team and get back to you," and escalate (§10).
Sections marked **[INTERNAL]** are context for the agent and must never be
quoted to a customer.

Last updated: Aug 15, 2026 — keep in sync with `data/events.ts`, the /faq
page, and OPERATIONS.md when facts change.

---

## 1. What the series is

- **College Flag Showcase Series** — a girls national recruiting series for
  girls flag football. Each event includes a verified combine plus a college
  showcase tournament in one weekend, evaluated in person by college flag
  football coaches. Ten events across the 2026–27 season, coast to coast.
- Three parts to every event weekend:
  1. **Showcase Combine & Camp** (a.k.a. Individual Showcase Combine &
     Camp) — individual, open registration. Position-specific skill work
     and 1v1s in front of college coaches, plus verified combine testing
     measured by trained staff and on the record.
  2. **Showcase Tournament** (a.k.a. Travel Team Showcase Tournament) —
     team competition, INVITE-ONLY. 5v5 against a curated field of travel
     programs; college coaches evaluate live from the sideline; every game
     filmed by AI cameras in the full-field view college coaches use to
     evaluate.
  3. **College Row / coach credentials** — free credentials for college
     programs; coaches evaluate all weekend.
- Format: the competition is **5v5** ("while we understand the college game
  is 7v7, our competition is 5v5 — that currently aligns with the most
  common youth travel competition formats and roster structures").
  **[INTERNAL]** tournament structure is group stage + playoffs — the
  founder prefers we not lead with format mechanics; don't say "bracketed."
- Who runs it: founded by a team with decades of experience operating
  premier youth tournaments, delivering elite event weekends, and building
  sports technology. **[INTERNAL]** Founders: Allen Hamilton, Monty
  Holloway, Amanda Newman. Monty and Amanda co-founded 5v5 Sports. The
  series is INDEPENDENT — never describe it as "a 5v5 Sports production."
  5v5 Sports may be credited only as operator of the Superflag anchor event.
- Event 01 runs alongside the **International Superflag Invitational**
  (80 teams from three countries in 2025).
- Why college flag is real: flag football debuts at the **2028 Olympics**
  (LA); it's an **NCAA Emerging Sport for Women** with scholarships live
  today; **Nebraska** becomes the first Power Four school with varsity flag
  in 2028; **90+ college programs** are playing (founder-confirmed count,
  Aug 2026).

## 2. Season schedule (2026–27)

| # | City | Date | Status |
|---|------|------|--------|
| 01 | Dallas, TX — Craig Ranch Sports Complex, McKinney | **Dec 11–13, 2026** | First event; registration currently in "Coming Soon" mode (§4) |
| 02 | Charlotte, NC | Jan 2027 | Venue announcing |
| 03 | Phoenix, AZ | Feb 2027 | Venue announcing |
| 04 | Seattle, WA | Apr 2027 | Venue announcing |
| 05 | Southern California | May 2027 | Venue announcing |
| 06 | Ohio | Jun 2027 | Venue announcing |
| 07 | Boston, MA | Jul 2027 | Venue announcing |
| 08 | Tampa, FL | Sep 2027 | Venue announcing |
| 09 | Nashville, TN | Oct 2027 | Venue announcing |
| 10 | Atlanta, GA | Dec 2027 | Venue announcing |

Dallas weekend rhythm: **Fri Dec 11 — Individual Showcase Combine & Camp;
Sat–Sun Dec 12–13 — Travel Team Showcase Tournament.** Combine start/end
times: **TBD** — "detailed weekend agendas and game schedules are confirmed
closer to the event." Dallas registration deadline: **Nov 29, 2026**.

## 3. Divisions & eligibility

- Showcase divisions: **12U, 14U, 16U, 18U**.
- Age groups are based on the athlete's **age as of August 1**.
- Recruiting focus: grad year matters most — coaches recruit current and
  upcoming classes.
- Girls flag football athletes. No team required for the Combine & Camp —
  it's individual, open registration.

## 4. Pricing & registration

### Athlete — Showcase Combine & Camp
- **$175 standard.** Athletes on a team competing in the Showcase
  Tournament get **$50 off ($125)** — the discount code is included in
  their coach's tournament invite email and entered at checkout (the
  "Team discount code" field on the Review & Pay step). Code is
  case-insensitive. Marketing shows "Starting at $125."
- Registration is a 3-step form at `/events/<event>/register` (athlete →
  parent/guardian + waiver → review), then Stripe secure checkout. Receipt
  goes to the guardian email. Parent/guardian must complete it (waiver
  signature).
- **Current state [INTERNAL]:** the site is public but athlete registration
  is in **"Coming Soon" mode** — buttons are disabled while traffic ramps
  up. If someone asks "how do I register": registration opens soon; offer
  to take their email (site "Get Notified" interest form) so they're
  notified. Do NOT hand out the direct /register URL — it's live only for
  internal testing.
- **[INTERNAL]** An invalid discount code shows "That discount code isn't
  valid." Until the TOURNAMENT_DISCOUNT_CODE environment variable is set in
  Vercel, ALL codes are rejected — full-price checkout still works.

### Team — Showcase Tournament
- **$550 per team**, with a **three-game minimum**. Invite-only.
- Teams **"request an invite"** (never "sign up" / "register") at
  collegeflagshowcase.com → we review every program to keep the field
  competitive → we reply either way → selected teams receive their invite
  and a private registration link by email. The private link is never
  shared publicly — if a team lost theirs, escalate.
- The Combine & Camp is NOT included in team entry — each athlete registers
  individually (that's where the $50 tournament-athlete discount applies).

### College coaches
- **Credentials are free** for college programs at every event.
- Credentials include: sideline access all weekend, expected participant
  counts before each event, and the **athlete recruiting package**
  (verified combine results — speed, agility, explosiveness measured by
  trained staff and on the record — plus each athlete's contact information
  and academic/athletic profile).
- Free **College Row** tent space in the Fan Zone — opt in via checkbox at
  coach registration (site: /colleges/register).
- Compliance (approved answer, use verbatim): "Coaches are responsible for
  ensuring compliance with their respective governing bodies' recruiting
  rules."

### Spectators
- Spectators welcome. A **gate fee applies, set by each venue**, posted
  with each event's details. Amounts: **TBD — escalate if pressed.**

## 5. Refund & cancellation policy (approved copy)

- **Showcase Tournament (team entry):** refund requests must be made at
  least **21 days before the event**; requests inside that window are
  reviewed **case by case**.
- **Showcase Combine & Camp (athlete registration):** cancellation requests
  must be made at least **7 days before the event**; requests inside that
  window are reviewed case by case.
- Events canceled due to circumstances beyond our control receive **credit
  toward future events** (not cash refunds).
- **[INTERNAL]** Support agents never approve/deny a refund themselves —
  log the request and escalate. All case-by-case decisions are the
  founders'.

## 6. Film & media

- Every tournament game is filmed by **AI cameras in the full-field view
  college coaches use to evaluate**.
- Athlete film packages **will be available** — details and pricing at
  collegeflagshowcase.com/film. Pricing/timing beyond that: **TBD**.
- Game film is NOT automatically included with registration — don't imply
  it is.

## 7. Recruiting package & data

- What coaches receive about an athlete: verified combine results + contact
  info + academic/athletic profile ("the athlete recruiting package").
- What "verified" means: measured by trained staff and on the record — not
  self-reported.
- If a family asks to opt out of data sharing, or anything
  privacy/data-related beyond the above: **escalate**.

## 8. Committed colleges & competing programs (Dallas)

Colleges committed to attend and evaluate (public, as of Aug 15, 2026):
East Texas Baptist University, Illinois Wesleyan University, Our Lady of
the Lake University, Dallas College Richland, Missouri Valley College,
Texas Wesleyan University, Cairn University. The board at
collegeflagshowcase.com/colleges updates as coaches register.

Competing programs (public board, as of Aug 15, 2026): Conquer Chargers
(SoCal), Texas Fury (TX), NorCal Elite (NorCal), Mexico Prime (Mexico),
Panama Wardogs (Panama), Kansas City Heat (KC), FamLife Flex (TX), One of
One Girls Flag Football Club (Oklahoma City).

**[INTERNAL]** Never share individual coaches' names/emails/phones with
customers; college interest inquiries from athletes should be pointed at
the public /colleges board.

## 9. Contact & channels

- Single public contact: **info@collegeflagshowcase.com** — athletes,
  teams, colleges, sponsors, and press all go there.
- Transactional email comes from no-reply@collegeflagshowcase.com; the
  correct guidance is "email us at info@collegeflagshowcase.com" (never
  tell someone to reply to the no-reply address).
- **[INTERNAL]** The phone number appearing on some collateral
  (888.555.0199) is a **placeholder** — never give it out as a working
  number. If someone asks for a phone contact: email is the channel right
  now.
- Website: collegeflagshowcase.com (FAQ at /faq covers most of this doc in
  public form — safe to link customers there).

## 10. Escalation rules

Escalate to the founders (via info@collegeflagshowcase.com internal
routing) — do not improvise — for:

1. Refund/cancellation decisions (all of them — policy quotes are fine,
   decisions are not).
2. Anything marked TBD: combine times, detailed agendas, gate fee amounts,
   film package pricing, venues/dates for events 02–10 beyond the table.
3. Lost/never-received tournament invite links or discount codes.
4. Medical, safety, or incident reports.
5. Press/media requests; sponsorship inquiries (**[INTERNAL]** sponsor
   pricing exists — $850/event tiers, presenting tier by contact — but
   support should hand sponsors to the founders, not quote numbers).
6. Legal/waiver questions ([INTERNAL] waiver text is still placeholder).
7. Data-privacy or opt-out requests.
8. Anything about 5v5 Sports/Superflag attribution beyond §1's language.
9. Any question whose answer is not in this document.

## 11. Voice & vocabulary for support replies

- Plain, warm, athlete-first, confident. No hype, no exclamation marks.
- Always: "the series", "events", "Event 01", "request an invite" (teams),
  "College Flag Showcase Series" written out (never "CFS").
- Never: "tour", "stops", "sign up" (for tournament teams), "bracketed".
- Speak to parents plainly and athletes directly; when in doubt, mirror the
  approved FAQ answers at /faq — that copy is founder-approved verbatim.

## 12. Quick answers (approved one-liners)

- **Is this legit / is college flag real?** "Very. Flag football debuts at
  the 2028 Olympics in LA, it's an NCAA Emerging Sport for Women with
  scholarships live today, Nebraska becomes the first Power Four school
  with varsity flag in 2028, and 90+ college programs are playing with
  more added every season."
- **Does my daughter need a team?** "No. The Showcase Combine & Camp is
  individual, open registration — her chance to show what she can do on her
  own. The team tournament is separate and invite-only."
- **Will coaches actually see her?** "Yes — coaches are credentialed
  on-site all weekend, watching skill work and 1v1s at the Combine & Camp
  and on the sideline for games. Her verified results go into the
  recruiting package those coaches receive."
- **5v5 or 7v7?** "While we understand the college game is 7v7, our
  competition is 5v5 — that currently aligns with the most common youth
  travel competition formats and roster structures."
- **How do we get in the tournament?** "The field is invite-only — request
  an invite at collegeflagshowcase.com, tell us about your program, and we
  reply either way."
- **When's the schedule?** "The weekend runs combine first, tournament
  after. Detailed agendas and game schedules are confirmed closer to the
  event."
