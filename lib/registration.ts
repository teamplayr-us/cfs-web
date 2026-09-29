// Shared types + validation for the athlete registration flow.
// Used by the client form (inline validation) and the API routes
// (authoritative re-validation) so the two can never drift.

import { WAIVER_VERSION } from "@/lib/waiver";

export const POSITIONS = [
  "QB",
  "WR",
  "RB",
  "Center",
  "DB",
  "Rusher",
  "Safety",
] as const;

export interface RegistrationData {
  athleteFirst: string;
  athleteLast: string;
  /** ISO date, e.g. "2011-04-02" */
  dob: string;
  gradYear: string;
  positions: string[];
  /** Optional Flag Football Finder profile URL */
  fffUrl: string;
  /** Optional free-text allergies / medical notes */
  medical: string;
  /** Hometown, "City, ST" */
  hometown: string;
  /** Optional club / travel team (blank = none) */
  clubTeam: string;
  /** Guardian confirms girls 12U–18U eligibility */
  eligibilityConfirmed: boolean;
  /** Opt-in to the guest player pool */
  guestPool: boolean;
  guardianFirst: string;
  guardianLast: string;
  guardianEmail: string;
  guardianPhone: string;
  emergencyFirst: string;
  emergencyLast: string;
  emergencyPhone: string;
  waiverAgreed: boolean;
  /** Guardian's typed full legal name, acting as signature */
  waiverSignature: string;
  /** Optional tournament-team discount code, validated server-side */
  discountCode: string;
}

export const EMPTY_REGISTRATION: RegistrationData = {
  athleteFirst: "",
  athleteLast: "",
  dob: "",
  gradYear: "",
  positions: [],
  fffUrl: "",
  medical: "",
  hometown: "",
  clubTeam: "",
  eligibilityConfirmed: false,
  guestPool: false,
  guardianFirst: "",
  guardianLast: "",
  guardianEmail: "",
  guardianPhone: "",
  emergencyFirst: "",
  emergencyLast: "",
  emergencyPhone: "",
  waiverAgreed: false,
  waiverSignature: "",
  discountCode: "",
};

// Current classes only — the class of 2026 has graduated.
export const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => 2027 + i);

/** Showcase age groups run on age as of Aug 1 (iFlag / Zorts); the combine
 * is 12U–18U, so an athlete must be 18 or younger on this date. */
export const AGE_CUTOFF = "2026-08-01";
export const MAX_AGE = 18;
/** Plausibility floor only — 12U includes younger athletes. */
export const MIN_AGE = 7;

/** Age in whole years on the cutoff date. */
export function ageOnCutoff(dob: string, cutoff = AGE_CUTOFF): number {
  const b = new Date(`${dob}T00:00:00Z`);
  const c = new Date(`${cutoff}T00:00:00Z`);
  let age = c.getUTCFullYear() - b.getUTCFullYear();
  if (
    c.getUTCMonth() < b.getUTCMonth() ||
    (c.getUTCMonth() === b.getUTCMonth() && c.getUTCDate() < b.getUTCDate())
  )
    age -= 1;
  return age;
}

export type FieldErrors = Partial<Record<keyof RegistrationData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredName(value: string): string | undefined {
  if (!value.trim()) return "Required";
  if (value.trim().length > 80) return "Too long";
  return undefined;
}

function requiredPhone(value: string): string | undefined {
  if (!value.trim()) return "Required";
  if (value.replace(/\D/g, "").length < 7) return "Enter a valid phone number";
  return undefined;
}

/** Validate a single step (1 = athlete, 2 = guardian + waiver) or, with no
 * step given, the whole form. */
export function validateRegistration(
  data: RegistrationData,
  step?: 1 | 2,
): FieldErrors {
  const errors: FieldErrors = {};

  if (step === undefined || step === 1) {
    errors.athleteFirst = requiredName(data.athleteFirst);
    errors.athleteLast = requiredName(data.athleteLast);
    if (!data.dob) {
      errors.dob = "Required";
    } else {
      const d = new Date(`${data.dob}T00:00:00Z`);
      if (Number.isNaN(d.getTime()) || d >= new Date())
        errors.dob = "Enter a valid date";
      else if (ageOnCutoff(data.dob) > MAX_AGE)
        errors.dob = "The combine is 12U–18U (age as of Aug 1, 2026)";
      else if (ageOnCutoff(data.dob) < MIN_AGE)
        errors.dob = "Check the date of birth";
    }
    const year = Number(data.gradYear);
    if (!data.gradYear) errors.gradYear = "Required";
    else if (!GRAD_YEARS.includes(year)) errors.gradYear = "Select a year";
    if (data.positions.length === 0)
      errors.positions = "Pick at least one position";
    if (data.fffUrl.trim() && !/^https?:\/\/\S+$/.test(data.fffUrl.trim()))
      errors.fffUrl = "Enter a full link (starting with http)";
    if (data.medical.length > 1000) errors.medical = "Too long";
    if (!data.hometown.trim()) errors.hometown = "Required";
    else if (data.hometown.trim().length > 80) errors.hometown = "Too long";
    if (data.clubTeam.trim().length > 80) errors.clubTeam = "Too long";
    if (!data.eligibilityConfirmed)
      errors.eligibilityConfirmed = "Required to register";
  }

  if (step === undefined || step === 2) {
    errors.guardianFirst = requiredName(data.guardianFirst);
    errors.guardianLast = requiredName(data.guardianLast);
    if (!data.guardianEmail.trim()) errors.guardianEmail = "Required";
    else if (!EMAIL_RE.test(data.guardianEmail.trim()))
      errors.guardianEmail = "Enter a valid email";
    errors.guardianPhone = requiredPhone(data.guardianPhone);
    errors.emergencyFirst = requiredName(data.emergencyFirst);
    errors.emergencyLast = requiredName(data.emergencyLast);
    errors.emergencyPhone = requiredPhone(data.emergencyPhone);
    if (!data.waiverAgreed) errors.waiverAgreed = "Required to participate";
    errors.waiverSignature = requiredName(data.waiverSignature);
  }

  for (const key of Object.keys(errors) as (keyof RegistrationData)[]) {
    if (errors[key] === undefined) delete errors[key];
  }
  return errors;
}

/** Flatten form data into Stripe Checkout metadata (string values, <=500
 * chars each). The webhook rebuilds the Airtable record from this. */
export function toStripeMetadata(
  data: RegistrationData,
  eventSlug: string,
): Record<string, string> {
  const clip = (s: string) => s.trim().slice(0, 500);
  return {
    eventSlug,
    athleteFirst: clip(data.athleteFirst),
    athleteLast: clip(data.athleteLast),
    dob: clip(data.dob),
    gradYear: clip(data.gradYear),
    positions: clip(data.positions.join(", ")),
    fffUrl: clip(data.fffUrl),
    medical: clip(data.medical),
    hometown: clip(data.hometown ?? ""),
    clubTeam: clip(data.clubTeam ?? ""),
    guestPool: data.guestPool ? "yes" : "no",
    guardianFirst: clip(data.guardianFirst),
    guardianLast: clip(data.guardianLast),
    guardianEmail: clip(data.guardianEmail),
    guardianPhone: clip(data.guardianPhone),
    emergencyFirst: clip(data.emergencyFirst),
    emergencyLast: clip(data.emergencyLast),
    emergencyPhone: clip(data.emergencyPhone),
    waiverSignature: clip(data.waiverSignature),
    waiverVersion: WAIVER_VERSION,
    discountCode: clip(data.discountCode ?? ""),
    waiverSignedAt: new Date().toISOString(),
  };
}
