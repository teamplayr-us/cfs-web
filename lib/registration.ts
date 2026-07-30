// Shared types + validation for the athlete registration flow.
// Used by the client form (inline validation) and the API routes
// (authoritative re-validation) so the two can never drift.

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
}

export const EMPTY_REGISTRATION: RegistrationData = {
  athleteFirst: "",
  athleteLast: "",
  dob: "",
  gradYear: "",
  positions: [],
  fffUrl: "",
  medical: "",
  guardianFirst: "",
  guardianLast: "",
  guardianEmail: "",
  guardianPhone: "",
  emergencyFirst: "",
  emergencyLast: "",
  emergencyPhone: "",
  waiverAgreed: false,
  waiverSignature: "",
};

export const GRAD_YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);

// TODO: replace with the real 5v5 Sports liability waiver text before launch.
export const WAIVER_SUMMARY =
  "I certify that I am the athlete's parent or legal guardian, I authorize " +
  "the athlete's participation in this College Flag Showcase Series event, " +
  "and I agree to the event liability waiver, assumption of risk, and photo " +
  "release on the athlete's behalf.";

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
      if (Number.isNaN(d.getTime())) errors.dob = "Enter a valid date";
      else if (d.getUTCFullYear() < 1990 || d >= new Date())
        errors.dob = "Enter the athlete's real date of birth";
    }
    const year = Number(data.gradYear);
    if (!data.gradYear) errors.gradYear = "Required";
    else if (!GRAD_YEARS.includes(year)) errors.gradYear = "Select a year";
    if (data.positions.length === 0)
      errors.positions = "Pick at least one position";
    if (data.fffUrl.trim() && !/^https?:\/\/\S+$/.test(data.fffUrl.trim()))
      errors.fffUrl = "Enter a full link (starting with http)";
    if (data.medical.length > 1000) errors.medical = "Too long";
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
    guardianFirst: clip(data.guardianFirst),
    guardianLast: clip(data.guardianLast),
    guardianEmail: clip(data.guardianEmail),
    guardianPhone: clip(data.guardianPhone),
    emergencyFirst: clip(data.emergencyFirst),
    emergencyLast: clip(data.emergencyLast),
    emergencyPhone: clip(data.emergencyPhone),
    waiverSignature: clip(data.waiverSignature),
    waiverSignedAt: new Date().toISOString(),
  };
}
