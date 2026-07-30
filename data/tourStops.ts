// Tour stop data for the 2026–27 season.
// Edit this file to add/update stops — components render whatever is here.
// Shaped so it can later be swapped for an Airtable API call returning the
// same TourStop[] / NextStop objects.

export interface TourStop {
  /** Two-digit stop number as displayed, e.g. "01" */
  number: string;
  city: string;
  venue: string;
  /** Display date, e.g. "DEC 2026" */
  date: string;
  /** Status tag label, e.g. "Registration Open" / "Announcing" */
  tag: string;
  /** Renders the tag in the live (red) style when true */
  live?: boolean;
  /** Zorts event URL for team (Showcase Tournament) registration, per stop */
  zortsUrl?: string;
}

export const TOUR_STOPS: TourStop[] = [
  {
    number: "01",
    city: "McKinney, TX",
    venue: "Craig Ranch Sports Complex",
    date: "DEC 2026",
    tag: "Registration Open",
    live: true,
  },
  {
    number: "02",
    city: "Charlotte, NC",
    venue: "Venue announcing soon",
    date: "JAN 2027",
    tag: "Announcing",
  },
  {
    number: "03",
    city: "Southern California",
    venue: "Venue announcing soon",
    date: "MAY 2027",
    tag: "Announcing",
  },
  {
    number: "04",
    city: "Ohio",
    venue: "Venue announcing soon",
    date: "JUN 2027",
    tag: "Announcing",
  },
  {
    number: "05",
    city: "Tampa, FL",
    venue: "Venue announcing soon",
    date: "SEP 2027",
    tag: "Announcing",
  },
  {
    number: "06",
    city: "Nashville, TN",
    venue: "Venue announcing soon",
    date: "OCT 2027",
    tag: "Announcing",
  },
  {
    number: "07",
    city: "Atlanta, GA",
    venue: "Venue announcing soon",
    date: "DEC 2027",
    tag: "Announcing",
  },
];

// Details for the "Next Stop" card in the hero.
export interface NextStop {
  /** Label in the card header, e.g. "Stop 01" */
  stopLabel: string;
  /** City line — non-breaking space keeps "McKinney, TX" on one line */
  city: string;
  venue: string;
  dates: string;
  divisions: string;
  teamEntry: string;
  regDeadline: string;
  /** Zorts event URL for this stop's team registration (optional) */
  zortsUrl?: string;
}

export const NEXT_STOP: NextStop = {
  stopLabel: "Stop 01",
  city: "McKinney, TX",
  venue: "Craig Ranch Sports Complex",
  dates: "Dec 11–13, 2026",
  divisions: "Girls 12U+",
  teamEntry: "$550",
  regDeadline: "Nov 29, 2026",
};
