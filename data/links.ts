// Registration + contact links.
// These are placeholders for v1 — swap them for real URLs (or Airtable-driven
// values) without touching any component code.

// Native athlete registration for the next stop (see /events/[slug]/register).
export const ATHLETE_REG_URL = "/events/mckinney-tx/register";

export const CONTACT_EMAIL = "info@collegeflagshowcase.com";
export const CONTACT_PHONE = "888.350.2215";

export const INTEREST_MAILTO =
  "mailto:info@collegeflagshowcase.com?subject=College%20Flag%20Showcase%20Series%20—%20Interest";

export const SPONSOR_MAILTO =
  "mailto:info@collegeflagshowcase.com?subject=College%20Flag%20Showcase%20Series%20—%20Sponsorship";

// The Showcase Tournament is invite-only: teams request an invite, the
// organizer reviews and sends approved teams the private Zorts link (the
// `zortsUrl` field in data/events.ts — never rendered publicly).
export function teamInviteMailto(stop?: {
  number: string;
  city: string;
}): string {
  const subject = stop
    ? `Team Invite Request — ${stop.city} (Stop ${stop.number})`
    : "College Flag Showcase Series — Team Invite Request";
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
