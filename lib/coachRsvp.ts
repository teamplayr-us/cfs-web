// College coach RSVP — personal links (/colleges/rsvp/<token>).
// Each Coach Registrations row gets a random "RSVP Token"; the page looks the
// coach up by it and writes their per-event RSVP back to the same row.
// Field IDs for reads/writes; the lookup formula references {RSVP Token}
// by NAME (don't rename that field).

const API = "https://api.airtable.com/v0";
const COACH_TABLE = process.env.AIRTABLE_COACH_TABLE ?? "tblCZuBfVMjkEo5c5";

export const RSVP_FIELD = {
  program: "fld6cOxBJa4pxIYwt",
  first: "fldNjZFox9FVxi5cZ",
  last: "fldoe7n1csAhlHNo6",
  email: "fld4L5p35saiU7wPw",
  tent: "fldiWWTASldaYWD5w",
  token: "fldqEf9SnAuTXTZfh",
  combine: "fldsd6CssnRxcILjF",
  welcome: "fldiNJvAiJn9DHjjt",
  saturday: "fld94VycwdO3Si9ei",
  sunday: "fldbatYNbvrOAGu63",
  rsvpAt: "fldrNqmYpmDAPHvl6",
} as const;

/** The four Dallas weekend events a coach can RSVP to. */
export const RSVP_EVENTS = [
  {
    key: "combine",
    label: "Showcase Combine & Camp",
    when: "Friday, Dec 11 · 3:00–5:30 PM",
    where: "Craig Ranch Sports Complex",
  },
  {
    key: "welcome",
    label: "Coaches Welcome Event",
    when: "Friday, Dec 11 · 7:00–8:30 PM",
    where: "Sheraton McKinney Hotel",
  },
  {
    key: "saturday",
    label: "Showcase Tournament — Saturday",
    when: "Saturday, Dec 12 · 8:00 AM–4:00 PM",
    where: "Craig Ranch Sports Complex",
  },
  {
    key: "sunday",
    label: "Showcase Tournament — Sunday",
    when: "Sunday, Dec 13 · 8:00 AM–4:00 PM",
    where: "Craig Ranch Sports Complex",
  },
] as const;

export type RsvpEventKey = (typeof RSVP_EVENTS)[number]["key"];

export interface RsvpAnswers {
  combine: boolean;
  welcome: boolean;
  saturday: boolean;
  sunday: boolean;
  tent: boolean;
}

export interface CoachRsvp extends RsvpAnswers {
  id: string;
  first: string;
  last: string;
  program: string;
  email: string;
  /** ISO time of the last RSVP, or null if they haven't responded */
  rsvpAt: string | null;
}

const TOKEN_RE = /^[A-Za-z0-9_-]{16,64}$/;

function config() {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  return key && baseId ? { key, baseId } : null;
}

/** Look a coach up by their RSVP token. Null if not found / invalid. */
export async function findCoachByToken(
  token: string,
): Promise<CoachRsvp | null> {
  const cfg = config();
  if (!cfg || !TOKEN_RE.test(token)) return null;
  const params = new URLSearchParams({
    filterByFormula: `{RSVP Token} = '${token}'`,
    maxRecords: "1",
    returnFieldsByFieldId: "true",
  });
  for (const f of Object.values(RSVP_FIELD)) params.append("fields[]", f);
  const res = await fetch(
    `${API}/${cfg.baseId}/${encodeURIComponent(COACH_TABLE)}?${params}`,
    { headers: { Authorization: `Bearer ${cfg.key}` }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Airtable lookup failed: ${res.status}`);
  const rec = (await res.json()).records?.[0];
  if (!rec) return null;
  const f = rec.fields ?? {};
  const s = (k: string) => (typeof f[k] === "string" ? (f[k] as string) : "");
  return {
    id: rec.id,
    first: s(RSVP_FIELD.first).trim(),
    last: s(RSVP_FIELD.last).trim(),
    program: s(RSVP_FIELD.program).trim(),
    email: s(RSVP_FIELD.email).trim(),
    tent: f[RSVP_FIELD.tent] === true,
    combine: f[RSVP_FIELD.combine] === true,
    welcome: f[RSVP_FIELD.welcome] === true,
    saturday: f[RSVP_FIELD.saturday] === true,
    sunday: f[RSVP_FIELD.sunday] === true,
    rsvpAt: s(RSVP_FIELD.rsvpAt) || null,
  };
}

/** Write a coach's RSVP answers to their row. */
export async function saveRsvp(
  recordId: string,
  a: RsvpAnswers,
): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("Airtable is not configured");
  const res = await fetch(
    `${API}/${cfg.baseId}/${encodeURIComponent(COACH_TABLE)}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          [RSVP_FIELD.combine]: a.combine,
          [RSVP_FIELD.welcome]: a.welcome,
          [RSVP_FIELD.saturday]: a.saturday,
          [RSVP_FIELD.sunday]: a.sunday,
          [RSVP_FIELD.tent]: a.tent,
          [RSVP_FIELD.rsvpAt]: new Date().toISOString(),
        },
      }),
    },
  );
  if (!res.ok) {
    throw new Error(`Airtable update failed: ${res.status} ${await res.text()}`);
  }
}
