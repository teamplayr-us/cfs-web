---
name: cfs-org-announcements
description: >-
  Create College Flag Showcase Series team/org graphics: the official
  per-team tournament INVITATION card (attached to invite emails, shareable
  on Instagram) and the "They're In." ACCEPTANCE announcement (logo, home
  location, divisions competing). Use this whenever the user wants to
  invite, announce, welcome, or spotlight a team, club, program, or
  organization ("send [team] an invite", "invitation for [team] 14U",
  "announce [team]", "[club] accepted", "org announcement"). For
  college-coach announcements use cfs-ig-graphics; for individual athletes
  use cfs-athlete-announcements.
---

# Team Invitations & Org Announcements

Two graphics cover the team lifecycle, in order:

1. **Official Invitation** (`collateral/invite-team-official.html`) — sent
   WITH the invite email, one per TEAM (org + division).
2. **"They're In." acceptance announcement**
   (`collateral/ig-org-committed.html`) — posted after the team accepts
   and is on the site board.

## Workflow A — Official team invitation

- Invites are **team-specific**: name is org + division, e.g. "One of One
  Girls FFC 14U" (abbreviate long org names FFC-style so the name fits one
  line — check the render). One invitation per team; an org with 12U and
  14U teams gets two cards.
- The card is share-ready by design — invited teams are encouraged to post
  it to Instagram. Nothing private goes on it: the private registration
  link lives ONLY in the email body, never on the graphic.
- Logo: `public/programs/` if the org is already on the board; otherwise
  stage the provided logo in `collateral/invites/` (transparent PNG).
- Render from the repo root — name each output explicitly so multiple
  teams from one org don't overwrite:
  ```bash
  node collateral/render-team-invite.mjs \
    "Org Name 14U" public/programs/logo.png "" "" invite-org-14u.png
  ```
  Optional args 3–4 override the event line and venue (defaults are Dallas
  Event 01 / Craig Ranch Sports Complex — venue name only, no city).
- Verify the PNG (name on one line, logo legible), send as a downloadable
  attachment, commit.

## Workflow B — "They're In." acceptance announcement

One graphic per accepted travel program: their logo on the navy brand
system with the program name, **home location · divisions competing**, a
pink "THEY'RE IN." stamp, and the event line. Template:
`collateral/ig-org-committed.html` (1080×1350). General brand rules and
render environment live in the `cfs-ig-graphics` skill.

## Gather the facts (never invent any of them)

| Field | Source |
| --- | --- |
| Program name + home location | `data/organizations.ts` (the site's competing-programs board) — the announcement must match the board exactly |
| Divisions competing (e.g. "12U · 14U") | The accepted invite record in the Team Invite Requests Airtable (base `app0mk0cTZLDeVahe`, table `tblqtHoZgqgkNTgle`) or the user. NOTE: the first eight Dallas programs were accepted outside the form, so their invite records may not exist — ask the user for divisions rather than guessing |
| Logo | `public/programs/<name>.png` (same transparent PNG the site board uses). New program → get the logo from the user and process it (background knocked out, trimmed) before announcing |
| Event line | Defaults to Dallas Event 01; override for later events |

**Board first, announcement second:** an announced program must already be
on the site's board (`data/organizations.ts` + logo in `public/programs/`,
deployed). If it isn't, do that first — the graphic's implicit claim is
"see them on the board." Tournament language: teams are *invited* and
*accept* — never "signed up" or "registered."

## Produce the graphic

1. Render from the repo root (every arg is a placeholder — fill all four
   from the gathered facts):
   ```bash
   node collateral/render-org-announce.mjs \
     "Program Name" program-logo.png "City/Region" "12U · 14U"
   ```
   Optional args 5–7: event line, city, output name. The script
   auto-detects the sandbox Chromium; set `CHROMIUM_PATH` only if that
   fails.
2. Output: `collateral/ig-org-<logo-name>.png`. Read the PNG before
   sending: logo legible on navy (dark logos may need a processed
   variant), name fits (long club names may need a smaller `.org-name`
   font size or a `<br />` in the name arg), the location · divisions
   line doesn't wrap mid-word, nothing overflows.
3. Send the PNG to the user **as a downloadable attachment** (they post
   from a phone), deliver a caption, and commit the PNG to `collateral/`.

## Caption pattern (founder-approved style)

Complete sentences, blank line between thoughts, no exclamation marks,
never "CFS", never "bracketed". Model:

> THEY'RE IN.
>
> [Program name] has accepted their invite to the Travel Team Showcase
> Tournament at Event 01 in Dallas — December 11–13, 2026.
>
> [Location]'s own, competing in [divisions] — 5v5 against top travel
> programs, with college coaches evaluating from the sideline.
>
> The field is taking shape. More teams announcing soon.
>
> #GirlsFlagFootball #FlagFootball #CollegeFlagFootball
> #FlagFootballRecruiting

If the render used a non-default event line, sync the caption's city and
date. Suggest tagging the program's account. Vary the middle lines across
posts so the feed doesn't read copy-pasted, but keep every fact sourced.
Athletes on tournament teams get $50 off combine registration — fine to
mention in the caption when the user wants a registration push tied to the
team post (the code travels via the coach's invite email, so don't put the
code itself anywhere public).
