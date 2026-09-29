// Guest player pool: a self-serve directory where club coaches of
// registered Showcase Tournament teams browse team-less athletes who opted
// in at registration and contact their families directly.
//
// Access is by emailed sign-in link. A coach qualifies when their email is
// on an Opportunity (Email Override, synced FFF email, or Invite CC) whose
// Stage is Registered OR whose "Guest Pool Access" box is checked. Every
// sign-in is emailed to the shared inbox so use can be monitored.

import { createHmac, timingSafeEqual } from "node:crypto";
import { EVENTS, TourEvent } from "@/data/events";
import { REG_FIELD } from "@/lib/airtable";
import { ageOnCutoff } from "@/lib/registration";

const API = "https://api.airtable.com/v0";

const OPPS_TABLE = "tblkq5JvMFHkYbWyO";
const OPP = {
  orgName: "fldp6pmD5p5xPXXBc",
  stage: "fldRuafCFYHhIGvE7",
  emailOverride: "fldLuRLN0Abz9dwEl",
  emailSynced: "fldiYNhnIE0hG6PEB",
  inviteCc: "fldEqwOUtHaKJkrNm",
  event: "fldkbOR7PhxjgPIdb",
  guestPoolAccess: "fldkGLYdIWDenr6lJ",
} as const;

const REG_TABLE = "tblmp5EHSrHHaxjpD";

export const SESSION_COOKIE = "cfs_guest_pool";
const LINK_TTL_MS = 1000 * 60 * 60 * 24; // sign-in link: 24 hours
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // session: 30 days

function airtable() {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  return key && baseId ? { key, baseId } : null;
}

// ---------- signed tokens ----------

/** HMAC key derived from a server-only secret; never sent to the client. */
function signingKey(): Buffer | null {
  const secret = process.env.AIRTABLE_API_KEY;
  if (!secret) return null;
  return createHmac("sha256", secret).update("guest-pool-v1").digest();
}

export function signToken(email: string, ttlMs: number): string | null {
  const key = signingKey();
  if (!key) return null;
  const body = Buffer.from(
    JSON.stringify({ e: email.toLowerCase(), x: Date.now() + ttlMs }),
  ).toString("base64url");
  const sig = createHmac("sha256", key).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token: string | undefined): string | null {
  const key = signingKey();
  if (!key || !token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", key).update(body).digest();
  const given = Buffer.from(sig, "base64url");
  if (given.length !== expected.length || !timingSafeEqual(given, expected))
    return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(body, "base64url").toString());
    return typeof e === "string" && typeof x === "number" && x > Date.now()
      ? e
      : null;
  } catch {
    return null;
  }
}

export const linkToken = (email: string) => signToken(email, LINK_TTL_MS);
export const sessionToken = (email: string) =>
  signToken(email, SESSION_TTL_MS);

// ---------- coach access ----------

export interface CoachAccess {
  email: string;
  orgs: string[];
  events: TourEvent[];
}

const EMAIL_RE = /[^\s,;<>"]+@[^\s,;<>"]+\.[^\s,;<>"]+/g;

/** Look up which orgs/events an email may see. null = no access. */
export async function coachAccess(email: string): Promise<CoachAccess | null> {
  const cfg = airtable();
  if (!cfg) return null;
  const want = email.trim().toLowerCase();
  const orgs = new Set<string>();
  const eventIds = new Set<string>();
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({
      filterByFormula: `OR({Stage} = 'Registered', {Guest Pool Access})`,
      returnFieldsByFieldId: "true",
      pageSize: "100",
    });
    for (const f of Object.values(OPP)) params.append("fields[]", f);
    if (offset) params.set("offset", offset);
    const res = await fetch(`${API}/${cfg.baseId}/${OPPS_TABLE}?${params}`, {
      headers: { Authorization: `Bearer ${cfg.key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Airtable opportunities: ${res.status}`);
    const page = (await res.json()) as {
      records: { fields: Record<string, unknown> }[];
      offset?: string;
    };
    for (const { fields: f } of page.records) {
      const emails = [
        f[OPP.emailOverride],
        ...((f[OPP.emailSynced] as unknown[] | undefined) ?? []),
        f[OPP.inviteCc],
      ]
        .filter((v): v is string => typeof v === "string")
        .flatMap((v) => v.match(EMAIL_RE) ?? [])
        .map((v) => v.toLowerCase());
      if (!emails.includes(want)) continue;
      if (typeof f[OPP.orgName] === "string") orgs.add(f[OPP.orgName] as string);
      for (const id of (f[OPP.event] as string[] | undefined) ?? [])
        eventIds.add(id);
    }
    offset = page.offset;
  } while (offset);

  if (orgs.size === 0) return null;
  const events = EVENTS.filter(
    (e) => e.airtableEventId && eventIds.has(e.airtableEventId),
  );
  return { email: want, orgs: Array.from(orgs), events };
}

// ---------- the pool ----------

export interface GuestPlayer {
  id: string;
  name: string;
  division: string;
  gradYear?: number;
  positions?: string;
  hometown?: string;
  club?: string;
  fffProfile?: string;
  guardianName: string;
  guardianEmail?: string;
  guardianPhone?: string;
}

/** Showcase division from DOB: 12U/14U/16U/18U by age on the cutoff. */
export function divisionFor(dob: string | undefined): string {
  if (!dob) return "—";
  const age = ageOnCutoff(dob);
  if (age <= 12) return "12U";
  if (age <= 14) return "14U";
  if (age <= 16) return "16U";
  return "18U";
}

/** Paid, opted-in athletes for an event, youngest division first. */
export async function guestPool(eventSlug: string): Promise<GuestPlayer[]> {
  const cfg = airtable();
  if (!cfg) return [];
  const out: GuestPlayer[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({
      filterByFormula: `AND({Event Slug} = '${eventSlug.replace(/'/g, "\\'")}', {Guest Player Pool}, {Status} = 'Paid')`,
      returnFieldsByFieldId: "true",
      pageSize: "100",
    });
    if (offset) params.set("offset", offset);
    const res = await fetch(`${API}/${cfg.baseId}/${REG_TABLE}?${params}`, {
      headers: { Authorization: `Bearer ${cfg.key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Airtable guest pool: ${res.status}`);
    const page = (await res.json()) as {
      records: { id: string; fields: Record<string, unknown> }[];
      offset?: string;
    };
    for (const { id, fields: f } of page.records) {
      const s = (k: keyof typeof REG_FIELD) =>
        typeof f[REG_FIELD[k]] === "string"
          ? (f[REG_FIELD[k]] as string)
          : undefined;
      out.push({
        id,
        name: s("athlete") ?? "",
        division: divisionFor(s("dob")),
        gradYear:
          typeof f[REG_FIELD.gradYear] === "number"
            ? (f[REG_FIELD.gradYear] as number)
            : undefined,
        positions: s("positions"),
        hometown: s("hometown"),
        club: s("clubTeam"),
        fffProfile: s("fffProfile"),
        guardianName: [s("guardianFirst"), s("guardianLast")]
          .filter(Boolean)
          .join(" "),
        guardianEmail: s("guardianEmail"),
        guardianPhone: s("guardianPhone"),
      });
    }
    offset = page.offset;
  } while (offset);
  return out.sort(
    (a, b) =>
      a.division.localeCompare(b.division) ||
      (a.gradYear ?? 0) - (b.gradYear ?? 0) ||
      a.name.localeCompare(b.name),
  );
}
