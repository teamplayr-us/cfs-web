// Competing program boards, per tour event.
// This board mirrors accepted invites in the Team Invite Requests Airtable
// table — when a team's invite is accepted (and the private Zorts link is
// sent), add the program here under the event's slug so the public board
// stays in sync with the real tournament field. Filled slots show the
// program's logo (drop the file in /public/programs/) with the name as a
// caption; name-only entries (no logo) render fine too. Events with no
// entry render a full placeholder board. Shaped for a later swap to an
// Airtable-driven pull (Status = Accepted).

export interface OrgSlot {
  filled: boolean;
  /** Program name (shown as caption under the logo, and as alt text) */
  name?: string;
  /** Path under /public, e.g. "/programs/example-elite.png" */
  logo?: string;
}

const PLACEHOLDER: OrgSlot = { filled: false };

export const ORG_BOARD_SIZE = 8;

export const ORGS_BY_EVENT: Record<string, OrgSlot[]> = {
  "mckinney-tx": [
    {
      filled: true,
      name: "Conquer Chargers",
      logo: "/programs/conquer-chargers.png",
    },
    {
      filled: true,
      name: "Texas Fury",
      logo: "/programs/fury.png",
    },
    { filled: true, name: "NorCal Elite" },
    { filled: true, name: "Monterrey Football League" },
    { filled: true, name: "Monterrey Azteca" },
    {
      filled: true,
      name: "Mexico Prime",
      logo: "/programs/mexico-prime.png",
    },
    { filled: true, name: "Panama Wardogs" },
  ],
};

/** Board for an event: its confirmed programs padded with placeholders. */
export function orgsForEvent(slug: string): OrgSlot[] {
  const confirmed = ORGS_BY_EVENT[slug] ?? [];
  return [
    ...confirmed,
    ...Array(Math.max(0, ORG_BOARD_SIZE - confirmed.length)).fill(PLACEHOLDER),
  ];
}
