// Committed college board.
// Each slot is either a placeholder or a filled program. To fill a slot, set
// `filled: true` and give it a `name` (the .filled style renders it on a light
// card). Shaped for a later swap to Airtable-driven data.

export interface CollegeSlot {
  filled: boolean;
  /** Program name shown when filled */
  name?: string;
}

const PLACEHOLDER: CollegeSlot = { filled: false };

export const COLLEGE_SLOTS: CollegeSlot[] = [
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
];
