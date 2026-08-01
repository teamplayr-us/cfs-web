// Tour event data for the 2026–27 season.
// Edit this file to add/update stops — the tour list, the hero "Next Stop"
// card, and each /events/[slug] page render whatever is here. Shaped so it
// can later be swapped for an Airtable API call returning TourEvent[].

export interface TourEvent {
  /** URL slug for the event page, e.g. "mckinney-tx" → /events/mckinney-tx */
  slug: string;
  /** Two-digit stop number as displayed, e.g. "01" */
  number: string;
  city: string;
  venue: string;
  /** Display date for the tour list, e.g. "DEC 2026" */
  date: string;
  /** Status tag label, e.g. "Registration Open" / "Announcing" */
  tag: string;
  /** Renders the tag in the live (red) style when true */
  live?: boolean;
  /** PRIVATE Zorts registration URL for this stop's Showcase Tournament.
   * The tournament is invite-only: this link is sent directly to approved
   * teams and is never rendered on the public site. */
  zortsUrl?: string;
  /** Native athlete (Combine & Camp) registration for this stop.
   * Omit until the stop takes athlete registrations. `open: false` shows a
   * "registration opens soon" page at /events/[slug]/register. */
  athleteReg?: {
    open: boolean;
    /** Price in cents, charged via Stripe Checkout */
    priceCents: number;
    /** The day(s) the Combine & Camp actually runs — often a subset of the
     * full stop dates (e.g. combine Dec 11 within a Dec 11–13 stop). Shown
     * in the registration flow instead of the full stop dates. */
    combineDate?: string;
    /** Optional cap on paid registrations; checkout closes when reached */
    capacity?: number;
  };
  /** Full event details — omit until announced; the event page and the
   * Next Stop card show them when present */
  details?: {
    /** e.g. "Dec 11–13, 2026" */
    dates: string;
    divisions: string;
    teamEntry: string;
    regDeadline: string;
  };
}

export const EVENTS: TourEvent[] = [
  {
    slug: "mckinney-tx",
    number: "01",
    city: "McKinney, TX",
    venue: "Craig Ranch Sports Complex",
    date: "DEC 2026",
    tag: "Registration Open",
    live: true,
    // TODO: confirm real athlete price before launch (placeholder $125).
    // Checkout stays disabled until Stripe env vars are set in Vercel.
    athleteReg: { open: true, priceCents: 12500, combineDate: "Dec 11, 2026" },
    details: {
      dates: "Dec 11–13, 2026",
      divisions: "Girls 12U+",
      teamEntry: "$550",
      regDeadline: "Nov 29, 2026",
    },
  },
  {
    slug: "charlotte-nc",
    number: "02",
    city: "Charlotte, NC",
    venue: "Venue announcing soon",
    date: "JAN 2027",
    tag: "Announcing",
  },
  {
    slug: "southern-california",
    number: "03",
    city: "Southern California",
    venue: "Venue announcing soon",
    date: "MAY 2027",
    tag: "Announcing",
  },
  {
    slug: "ohio",
    number: "04",
    city: "Ohio",
    venue: "Venue announcing soon",
    date: "JUN 2027",
    tag: "Announcing",
  },
  {
    slug: "tampa-fl",
    number: "05",
    city: "Tampa, FL",
    venue: "Venue announcing soon",
    date: "SEP 2027",
    tag: "Announcing",
  },
  {
    slug: "nashville-tn",
    number: "06",
    city: "Nashville, TN",
    venue: "Venue announcing soon",
    date: "OCT 2027",
    tag: "Announcing",
  },
  {
    slug: "atlanta-ga",
    number: "07",
    city: "Atlanta, GA",
    venue: "Venue announcing soon",
    date: "DEC 2027",
    tag: "Announcing",
  },
];

// Which event the hero "Next Stop" card features.
export const NEXT_STOP_SLUG = "mckinney-tx";

export const NEXT_STOP: TourEvent = EVENTS.find(
  (e) => e.slug === NEXT_STOP_SLUG,
)!;

export function getEvent(slug: string): TourEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

/** Display label like "Stop 01" */
export function stopLabel(event: TourEvent): string {
  return `Stop ${event.number}`;
}
