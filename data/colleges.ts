// Committed college board.
// Each slot is either a placeholder or a filled program. Filled slots show
// the program's logo (drop the file in /public/colleges/) with the name as
// a caption; slots with a name but no logo render the name as text.
// Shaped for a later swap to Airtable-driven data.

export interface CollegeSlot {
  filled: boolean;
  /** Program name (shown as caption under the logo, and as alt text) */
  name?: string;
  /** Path under /public, e.g. "/colleges/etbu.png" */
  logo?: string;
}

const PLACEHOLDER: CollegeSlot = { filled: false };

export const COLLEGE_SLOTS: CollegeSlot[] = [
  {
    filled: true,
    name: "East Texas Baptist University",
    logo: "/colleges/etbu.png",
  },
  {
    filled: true,
    name: "Illinois Wesleyan University",
    logo: "/colleges/illinois-wesleyan.png",
  },
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
];
