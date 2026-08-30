// "The Path Is Real" proof facts — the college-pathway milestones shown on
// the homepage. Every fact was independently verified before publishing
// (2026-08); update or add facts here as the sport's timeline advances.

export interface PathwayFact {
  /** Big display stat, e.g. "LA28" */
  stat: string;
  /** Two short mono label lines */
  label: string;
  detail: string;
}

export const PATHWAY_FACTS: PathwayFact[] = [
  // Source: olympics.com — flag football added to the LA 2028 Olympic
  // program (men's + women's); nfl.com/partners/flag-football
  {
    stat: "LA28",
    label: "Olympic sport",
    detail: "Flag football debuts at the 2028 Los Angeles Games",
  },
  // Source: ncaa.org media release, Jan 16 2026 — "NCAA adds flag football
  // to Emerging Sports for Women program"
  {
    stat: "NCAA",
    label: "Emerging sport",
    detail: "Added to the Emerging Sports for Women program in 2026",
  },
  // Source: huskers.com, Jan 16 2026 — Nebraska first Power Four school to
  // add varsity women's flag football; scholarships scaling to 25.
  // Founder update Aug 2026: season moved up to spring 2027.
  {
    stat: "P4",
    label: "Scholarships live",
    detail: "Nebraska is the first Power Four school with varsity flag — debuting spring 2027",
  },
  // Source: founder-confirmed count, Aug 2026 — over 90 college flag
  // football programs playing
  {
    stat: "90+",
    label: "College programs",
    detail: "College flag football programs playing — and climbing",
  },
];
