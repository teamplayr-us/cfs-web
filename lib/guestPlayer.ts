// Guest player pool sign-up: free, open to any eligible athlete without a
// tournament team, in any age group 8U–18U (no camp registration required). Shared by the
// /guest-players form (client validation), /api/guest-players (server
// re-validation + write), and the Stripe webhook (camp registrants who opt
// in). The pool itself lives in the Airtable "Guest Players" table.

import {
  AGE_CUTOFF,
  ageOnCutoff,
  EMAIL_RE,
  MAX_AGE,
  requiredName,
  requiredPhone,
} from "@/lib/registration";
import { COUNTRY_CODE_SET, countryName, STATE_CODES, US } from "@/lib/states";

export const GUEST_TABLE = "tblN52I5B3MBBrI3H";

export const GUEST_FIELD = {
  athlete: "fldi9Pkj9sXKIKtxq",
  athleteFirst: "fldPOwNInQ5diWRwl",
  athleteLast: "fldKalIvPMXBTxDN2",
  dob: "fldKb4s6D96S6maT2",
  division: "flddeTii3IvDmP3Zl",
  gradYear: "fldLwEOh6q0j8yjCx",
  positions: "fld8E6FuNJktzuosf",
  country: "fldxXlNQXTIS0BZ4c",
  city: "fldXQnMLuwPnpVPCn",
  state: "fldvDfa9GDjTz8DbP",
  zip: "fldOfH7mxooqEhn1a",
  hometown: "fldE4PCHlUt4SqQWr",
  clubTeam: "fldYqijrke3yD6xiG",
  fffProfile: "fldl7JUjHrYZrXJp1",
  guardianFirst: "fld1w7uNjkPpIFyaQ",
  guardianLast: "fldKSj2WVAVe5m7ap",
  guardianEmail: "fldiB8y80CYx3weWe",
  guardianPhone: "fldt6EjZL67Y0bvdh",
  eventSlug: "fldIF2WyqrpcqtzbI",
  eventLabel: "fldIOjTNd0rwp9tNF",
  source: "fld7wAgyA80p7Bte4",
  campRegistered: "fldLn9by2D0pC84Yd",
  status: "fldWREFvmS6Rz7xnn",
  consentSignature: "fldzHDY6fui5OeV2f",
  consentVersion: "fldkx1nxTjaPXtxRh",
  submittedAt: "fldiO1IZZ6tcB9zgC",
} as const;

/** Bump on any substantive edit — stored with every sign-up. */
export const GUEST_CONSENT_VERSION = "2026-09-29";
export const GUEST_CONSENT =
  "I am the athlete's parent or legal guardian. I consent to the College " +
  "Flag Showcase Series making the athlete's name, division, grad year, " +
  "positions, hometown, club, and profile link, together with my name, " +
  "email, and phone, available to club coaches of registered tournament " +
  "teams, who may contact me directly about a roster spot. " +
  "Joining is free, and I can leave the pool at any time by emailing " +
  "info@collegeflagshowcase.com. Playing in the tournament is subject to " +
  "the team's registration and the event's participant waiver.";

export interface GuestPlayerData {
  eventSlug: string;
  athleteFirst: string;
  athleteLast: string;
  dob: string;
  gradYear: string;
  positions: string[];
  country: string;
  city: string;
  state: string;
  zip: string;
  clubTeam: string;
  fffUrl: string;
  guardianFirst: string;
  guardianLast: string;
  guardianEmail: string;
  guardianPhone: string;
  eligibilityConfirmed: boolean;
  consentAgreed: boolean;
  consentSignature: string;
  /** Honeypot — real people never fill this */
  website: string;
}

export const EMPTY_GUEST_PLAYER: GuestPlayerData = {
  eventSlug: "",
  athleteFirst: "",
  athleteLast: "",
  dob: "",
  gradYear: "",
  positions: [],
  country: US,
  city: "",
  state: "",
  zip: "",
  clubTeam: "",
  fffUrl: "",
  guardianFirst: "",
  guardianLast: "",
  guardianEmail: "",
  guardianPhone: "",
  eligibilityConfirmed: false,
  consentAgreed: false,
  consentSignature: "",
  website: "",
};

/** The pool covers every tournament age group, 8U–18U (8U includes
 * younger athletes; this floor is a plausibility check only). */
export const GUEST_MIN_AGE = 5;
/** 8U athletes reach into the late-2030s classes. */
export const GUEST_GRAD_YEARS = Array.from({ length: 13 }, (_, i) => 2027 + i);

export type GuestErrors = Partial<Record<keyof GuestPlayerData, string>>;

export function validateGuestPlayer(d: GuestPlayerData): GuestErrors {
  const e: GuestErrors = {};
  if (!d.eventSlug) e.eventSlug = "Select an event";
  e.athleteFirst = requiredName(d.athleteFirst);
  e.athleteLast = requiredName(d.athleteLast);
  if (!d.dob) e.dob = "Required";
  else {
    const dt = new Date(`${d.dob}T00:00:00Z`);
    if (Number.isNaN(dt.getTime()) || dt >= new Date()) e.dob = "Enter a valid date";
    else if (ageOnCutoff(d.dob) > MAX_AGE)
      e.dob = "The tournament divisions are 8U–18U (age as of Aug 1, 2026)";
    else if (ageOnCutoff(d.dob) < GUEST_MIN_AGE) e.dob = "Check the date of birth";
  }
  if (!GUEST_GRAD_YEARS.includes(Number(d.gradYear))) e.gradYear = "Select a year";
  if (d.positions.length === 0) e.positions = "Pick at least one position";
  if (!COUNTRY_CODE_SET.has(d.country)) e.country = "Select a country";
  e.city = requiredName(d.city);
  if (d.country === US) {
    if (!STATE_CODES.has(d.state)) e.state = "Select a state";
    if (!/^\d{5}(-\d{4})?$/.test(d.zip.trim())) e.zip = "Enter a 5-digit ZIP";
  } else {
    if (d.state.trim().length > 80) e.state = "Too long";
    if (d.zip.trim().length > 12) e.zip = "Too long";
  }
  if (d.clubTeam.trim().length > 80) e.clubTeam = "Too long";
  if (d.fffUrl.trim() && !/^https?:\/\/\S+$/.test(d.fffUrl.trim()))
    e.fffUrl = "Enter a full link (starting with http)";
  e.guardianFirst = requiredName(d.guardianFirst);
  e.guardianLast = requiredName(d.guardianLast);
  if (!EMAIL_RE.test(d.guardianEmail.trim())) e.guardianEmail = "Enter a valid email";
  e.guardianPhone = requiredPhone(d.guardianPhone);
  if (!d.eligibilityConfirmed) e.eligibilityConfirmed = "Required to join";
  if (!d.consentAgreed) e.consentAgreed = "Required to join";
  e.consentSignature = requiredName(d.consentSignature);
  for (const k of Object.keys(e) as (keyof GuestPlayerData)[])
    if (e[k] === undefined) delete e[k];
  return e;
}

/** Tournament division (8U/10U/…/18U) from DOB, by age on the Aug 1 cutoff. */
export function divisionFor(dob: string | undefined): string {
  if (!dob) return "";
  const age = ageOnCutoff(dob, AGE_CUTOFF);
  if (age <= 8) return "8U";
  if (age <= 10) return "10U";
  if (age <= 12) return "12U";
  if (age <= 14) return "14U";
  if (age <= 16) return "16U";
  return "18U";
}

export function hometownOf(country: string, city: string, state: string) {
  return (country === US ? [city, state] : [city, state, countryName(country)])
    .map((x) => x?.trim())
    .filter(Boolean)
    .join(", ");
}

/** Plain string record (form data or Stripe metadata) → Airtable fields. */
export function guestPlayerFields(
  m: Record<string, string | undefined>,
  opts: {
    source: "Guest Pool Form" | "Camp Registration";
    eventLabel: string;
    consentSignature: string;
    consentVersion: string;
  },
): Record<string, unknown> {
  const s = (v?: string) => (v && v.trim() ? v.trim() : undefined);
  return {
    [GUEST_FIELD.athlete]: `${m.athleteFirst ?? ""} ${m.athleteLast ?? ""}`.trim(),
    [GUEST_FIELD.athleteFirst]: s(m.athleteFirst),
    [GUEST_FIELD.athleteLast]: s(m.athleteLast),
    [GUEST_FIELD.dob]: s(m.dob),
    [GUEST_FIELD.division]: divisionFor(m.dob) || undefined,
    [GUEST_FIELD.gradYear]: m.gradYear ? Number(m.gradYear) : undefined,
    [GUEST_FIELD.positions]: s(m.positions),
    [GUEST_FIELD.country]: s(m.country),
    [GUEST_FIELD.city]: s(m.city),
    [GUEST_FIELD.state]: s(m.state),
    [GUEST_FIELD.zip]: s(m.zip),
    [GUEST_FIELD.hometown]: s(m.hometown),
    [GUEST_FIELD.clubTeam]: s(m.clubTeam),
    [GUEST_FIELD.fffProfile]: s(m.fffUrl),
    [GUEST_FIELD.guardianFirst]: s(m.guardianFirst),
    [GUEST_FIELD.guardianLast]: s(m.guardianLast),
    [GUEST_FIELD.guardianEmail]: s(m.guardianEmail),
    [GUEST_FIELD.guardianPhone]: s(m.guardianPhone),
    [GUEST_FIELD.eventSlug]: s(m.eventSlug),
    [GUEST_FIELD.eventLabel]: opts.eventLabel,
    [GUEST_FIELD.source]: opts.source,
    [GUEST_FIELD.campRegistered]: opts.source === "Camp Registration",
    [GUEST_FIELD.status]: "Active",
    [GUEST_FIELD.consentSignature]: opts.consentSignature,
    [GUEST_FIELD.consentVersion]: opts.consentVersion,
    [GUEST_FIELD.submittedAt]: new Date().toISOString(),
  };
}

export async function createGuestPlayer(
  fields: Record<string, unknown>,
): Promise<void> {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!key || !baseId) throw new Error("Airtable is not configured");
  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${GUEST_TABLE}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  if (!res.ok)
    throw new Error(`Airtable guest player create failed: ${res.status} ${await res.text()}`);
}
