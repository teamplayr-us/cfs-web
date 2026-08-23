---
name: cfs-org-announcements
description: >-
  Create the College Flag Showcase Series "They're In." announcement graphic
  for a travel program/club/team accepted into the Showcase Tournament —
  their logo plus home location and the age groups (divisions) they're
  competing in. Use this whenever the user wants to announce, welcome, or
  spotlight a team, club, program, or organization ("announce [team]",
  "[club] accepted", "add [program]'s announcement", "org announcement").
  For college-coach announcements use cfs-ig-graphics; for individual
  athletes use cfs-athlete-announcements.
---

# Org "They're In." Announcements

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
