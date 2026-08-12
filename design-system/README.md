# College Flag Showcase Series — Design System

Self-contained spec cards for a Claude Design (claude.ai/design) project,
generated from the live site (`app/globals.css`) and `BRAND.md`. Each HTML
file is one preview card, marked with a first-line
`<!-- @dsCard group="…" -->` comment.

| Card | Group |
| --- | --- |
| `foundations/colors.html` | Colors — palette, hexes, usage rules |
| `foundations/type.html` | Type — display/eyebrow/body/mono scale |
| `foundations/motifs.html` | Brand — yard lines, offset shadows, ✓ marks, numbered lists |
| `foundations/voice.html` | Brand — voice + vocabulary rules |
| `foundations/logos.html` | Brand — primary badge (embedded file) + third-party logo treatment |
| `components/buttons.html` | Components — primary / ghost / ghost-on-dark |
| `components/cards.html` | Components — numbered cards + board slots |
| `components/forms.html` | Forms — inputs, labels, checks, errors |
| `sections/hero.html` | Sections — dark hero with badge + pink em |
| `sections/stat-band.html` | Sections — dark stat band ("The Path Is Real") |

## Syncing to claude.ai/design

This cloud session can't authorize the DesignSync tool directly. Two ways to
publish:

1. In claude.ai/design, create a design-system project and use **"Send to
   Claude Code Web"** — then ask the session to sync this `design-system/`
   folder into it.
2. From a local Claude Code session (which can run `/design-login`):
   "sync design-system/ to my Claude Design project".

Source of truth stays here: regenerate cards from `app/globals.css` +
`BRAND.md` when the brand changes, then re-sync.
