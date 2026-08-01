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

export const BOARD_SIZE = 8;

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
