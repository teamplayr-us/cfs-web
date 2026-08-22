---
name: cfs-athlete-announcements
description: >-
  Create the College Flag Showcase Series "She's In." athlete announcement
  graphic — the branded Instagram post welcoming an athlete who registered
  for the Showcase Combine & Camp, built from their action photo plus name,
  position, class year, club team, and hometown. Use this whenever the user
  wants to announce, feature, welcome, or spotlight an athlete ("announce
  [athlete]", "she's in post for...", "athlete spotlight", "welcome post"),
  or shares an athlete's photo with their details. For college-coach
  announcements and all other series social graphics, use cfs-ig-graphics
  instead.
---

# Athlete "She's In." Announcements

One graphic per athlete: her action photo over the navy brand system with a
pink "SHE'S IN." stamp, then name, position, class year, club, hometown,
and the event line. Template: `collateral/ig-athlete-committed.html`
(1080×1350). The general brand rules and render environment live in the
`cfs-ig-graphics` skill — this skill is the athlete-specific workflow.

## Gather the inputs (never invent any of them)

| Field | Source |
| --- | --- |
| Name, grad year, position(s) | Athlete Registrations Airtable (base `app0mk0cTZLDeVahe`, table `tblmp5EHSrHHaxjpD`) or the user |
| Club team, hometown | NOT captured at registration — must come from the user (or the family via the user) |
| Action photo | Provided by the user (chat upload lands in the session uploads dir; verify by viewing it — filenames are unreliable). Portrait or landscape both work; the template crops to cover with focus near the top |
| Event line | Defaults to Dallas Event 01; override for later events |

If club, hometown, or photo are missing, ask — a "She's In." post with
wrong or guessed details about a minor athlete is the worst failure mode
this skill has.

**Consent check:** these are minors, and there is no consent checkbox in
the registration flow yet. Unless the user's request already confirms the
family approved the photo/post, ask before delivering the graphic as
final — one line ("do we have the family's OK to post her?") is enough.
Never treat a prior athlete's post as blanket consent for the next one.

## Produce the graphic

1. Copy the photo into `collateral/athletes/<athlete-slug>.jpg` (if a
   photo is already on disk under another name, copy it to the athlete's
   slug — the output PNG is named after the photo file).
2. Render from the repo root:
   ```bash
   node collateral/render-athlete-announce.mjs \
     "Athlete Name" athlete-name.jpg "QB" 2029 "Club Name" "City, ST"
   ```
   Every arg is a placeholder — fill all six from the gathered facts, never
   from this example. Optional args 7–8: event line, output name. The
   script auto-detects the sandbox Chromium; set `CHROMIUM_PATH` only if
   that fails.
3. Output: `collateral/ig-athlete-<photo-name>.png`. Read the PNG before
   sending: check the crop keeps the athlete's head/action in frame
   (adjust the template's `object-position` if a specific photo crops
   badly), the name fits (long names may need a smaller `.name` font
   size), and nothing overflows.
4. Send the PNG to the user **as a downloadable attachment** (they post
   from a phone; inline previews can be hard to save), deliver a caption,
   and commit the HTML/photo/PNG to `collateral/`.

## Caption pattern (founder-approved style)

Complete sentences, blank line between thoughts, no exclamation marks,
never "CFS". Model:

> SHE'S IN.
>
> [Name] is registered for the Individual Showcase Combine & Camp at
> Event 01 in Dallas — December 11–13, 2026.
>
> [Position], Class of [year], [Club], [Hometown].
>
> One weekend to show her game — skill work and 1v1s in front of college
> coaches.
>
> #GirlsFlagFootball #FlagFootball #CollegeFlagFootball
> #FlagFootballRecruiting

If the render used a non-default event line (arg 7), update the city and
date in the caption to match. Tag the club's account and the family's account (if shared) when posting —
suggest it to the user. Vary the middle line across posts so a feed of
announcements doesn't read copy-pasted, but keep every fact sourced.

## Batch announcements

For several athletes at once, loop the render script (one call per
athlete) and deliver all PNGs in one message. Keep one commit for the
batch.
