// Series sponsor board.
// Each slot is either a placeholder or a named sponsor. Shaped for a later
// swap to Airtable-driven data.

export interface SponsorSlot {
  filled: boolean;
  /** Sponsor name shown when filled */
  name?: string;
}

const PLACEHOLDER: SponsorSlot = { filled: false };

export const SPONSOR_SLOTS: SponsorSlot[] = [
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
  PLACEHOLDER,
];
