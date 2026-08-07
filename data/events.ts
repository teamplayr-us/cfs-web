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
    /** Combine start/end times, e.g. "9:00 AM". Registration shows
     * "TBD" until both are set. */
    combineStartTime?: string;
    combineEndTime?: string;
    /** Optional cap on paid registrations; checkout closes when reached */
    capacity?: number;
  };
  /** Proof line for an established event this one runs alongside.
   * NOTE: anchor events are separate events CFS layers on top of. The
   * International Superflag Invitational is operated by 5v5 Sports
   * (founded by CFS team members Monty Holloway and Amanda Newman), but
   * the series itself is independent — copy may credit 5v5 Sports as the
   * anchor event's operator, never as the producer of CFS. */
  anchorEvent?: {
    name: string;
    /** e.g. "80 teams in 2025" */
    stat: string;
  };
  /** Full event details — omit until announced; the event page and the
   * Next Stop card show them when present */
  details?: {
    /** Full stop dates, e.g. "Dec 11–13, 2026" */
    dates: string;
    /** The days the tournament runs, when it differs from the full stop
     * dates (e.g. tournament Dec 12–13 within a Dec 11–13 stop). Falls
     * back to `dates` on the event page schedule. */
    tournamentDates?: string;
    divisions: string;
    teamEntry: string;
    regDeadline: string;
  };
}

export const EVENTS: TourEvent[] = [
  {
    slug: "mckinney-tx",
    number: "01",
    city: "Dallas, TX",
    venue: "Craig Ranch Sports Complex",
    date: "DEC 2026",
    tag: "Registration Open",
    live: true,
    // TODO: confirm real athlete price before launch (placeholder $125).
    // Checkout stays disabled until Stripe env vars are set in Vercel.
    athleteReg: {
      open: true,
      priceCents: 12500,
      combineDate: "Dec 11, 2026",
      // TODO: set combineStartTime / combineEndTime when the Dec 11
      // schedule is confirmed (shows "TBD" until then).
    },
    anchorEvent: {
      name: "International Superflag Invitational",
      stat: "80 teams in 2025",
    },
    details: {
      dates: "Dec 11–13, 2026",
      // TODO: set tournamentDates once confirmed (e.g. "Dec 12–13, 2026");
      // the schedule shows the full stop dates until then.
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
    slug: "phoenix-az",
    number: "03",
    city: "Phoenix, AZ",
    venue: "Venue announcing soon",
    date: "FEB 2027",
    tag: "Announcing",
  },
  {
    slug: "southern-california",
    number: "04",
    city: "Southern California",
    venue: "Venue announcing soon",
    date: "MAY 2027",
    tag: "Announcing",
  },
  {
    slug: "ohio",
    number: "05",
    city: "Ohio",
    venue: "Venue announcing soon",
    date: "JUN 2027",
    tag: "Announcing",
  },
  {
    slug: "boston-ma",
    number: "06",
    city: "Boston, MA",
    venue: "Venue announcing soon",
    date: "JUL 2027",
    tag: "Announcing",
  },
  {
    slug: "tampa-fl",
    number: "07",
    city: "Tampa, FL",
    venue: "Venue announcing soon",
    date: "SEP 2027",
    tag: "Announcing",
  },
  {
    slug: "nashville-tn",
    number: "08",
    city: "Nashville, TN",
    venue: "Venue announcing soon",
    date: "OCT 2027",
    tag: "Announcing",
  },
  {
    slug: "atlanta-ga",
    number: "09",
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

/** Display label like "Event 01" */
export function stopLabel(event: TourEvent): string {
  return `Event ${event.number}`;
}
