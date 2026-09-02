// Committed college boards, per tour stop.
// Coach commitments are event-specific: add each program under the stop's
// slug. Filled slots show the program's logo (drop the file in
// /public/colleges/, use the -mono knockout variant for the dark board)
// with the name as a caption. Stops with no entry render a full
// placeholder board. Shaped for a later swap to Airtable-driven data.

export interface CollegeSlot {
  filled: boolean;
  /** Program name (shown as caption under the logo, and as alt text) */
  name?: string;
  /** Path under /public, e.g. "/colleges/etbu-mono.png" */
  logo?: string;
}

const PLACEHOLDER: CollegeSlot = { filled: false };

export const BOARD_SIZE = 16;

export const COLLEGES_BY_EVENT: Record<string, CollegeSlot[]> = {
  "mckinney-tx": [
    {
      filled: true,
      name: "East Texas Baptist University",
      logo: "/colleges/etbu-mono.png",
    },
    {
      filled: true,
      name: "Illinois Wesleyan University",
      logo: "/colleges/illinois-wesleyan-mono.png",
    },
    {
      filled: true,
      name: "Our Lady of the Lake University",
      logo: "/colleges/ollu-mono.png",
    },
    {
      filled: true,
      name: "Dallas College Richland",
      logo: "/colleges/richland-mono.png",
    },
    {
      filled: true,
      name: "Missouri Valley College",
      logo: "/colleges/missouri-valley-mono.png",
    },
    {
      filled: true,
      name: "Texas Wesleyan University",
      logo: "/colleges/texas-wesleyan-mono.png",
    },
    {
      filled: true,
      name: "Cairn University",
      logo: "/colleges/cairn-mono.png",
    },
    {
      filled: true,
      name: "Olivet Nazarene University",
      logo: "/colleges/olivet-nazarene-mono.png",
    },
    {
      filled: true,
      name: "Lawrence University",
      logo: "/colleges/lawrence-mono.png",
    },
    {
      filled: true,
      name: "Eastern Connecticut State University",
      logo: "/colleges/eastern-connecticut-mono.png",
    },
    {
      filled: true,
      name: "Binghamton University",
      logo: "/colleges/binghamton-mono.png",
    },
    {
      filled: true,
      name: "Hendrix College",
      logo: "/colleges/hendrix-mono.png",
    },
  ],
};

/** Board for a stop: its committed programs padded with placeholders. */
export function collegesForEvent(slug: string): CollegeSlot[] {
  const committed = COLLEGES_BY_EVENT[slug] ?? [];
  return [
    ...committed,
    ...Array(Math.max(0, BOARD_SIZE - committed.length)).fill(PLACEHOLDER),
  ];
}

/** Homepage board: every program participating anywhere on the tour,
 * de-duplicated, padded with placeholders. */
export function allParticipatingColleges(): CollegeSlot[] {
  const seen = new Set<string>();
  const committed: CollegeSlot[] = [];
  for (const slots of Object.values(COLLEGES_BY_EVENT)) {
    for (const slot of slots) {
      if (slot.filled && slot.name && !seen.has(slot.name)) {
        seen.add(slot.name);
        committed.push(slot);
      }
    }
  }
  return [
    ...committed,
    ...Array(Math.max(0, BOARD_SIZE - committed.length)).fill(PLACEHOLDER),
  ];
}
