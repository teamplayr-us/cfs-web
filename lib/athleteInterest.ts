// Shared types + validation for the athlete "Get on the List" interest
// form (/interest). Used by the client form and the API route so they
// can't drift. Writes to the Airtable "Athlete Interest" table.

import { GRAD_YEARS, POSITIONS } from "@/lib/registration";

export const CONTACT_ROLES = [
  "Parent / Guardian",
  "Athlete",
  "Club Coach",
  "Other",
] as const;

export type ContactRole = (typeof CONTACT_ROLES)[number];

export interface AthleteInterestData {
  athleteFirst: string;
  athleteLast: string;
  gradYear: string;
  positions: string[];
  club: string;
  hometown: string;
  contactName: string;
  contactRole: ContactRole | "";
  email: string;
  phone: string;
  /** Event slugs they're interested in (optional) */
  events: string[];
  message: string;
  /** Honeypot — humans never fill this; bots do */
  website: string;
}

export const EMPTY_ATHLETE_INTEREST: AthleteInterestData = {
  athleteFirst: "",
  athleteLast: "",
  gradYear: "",
  positions: [],
  club: "",
  hometown: "",
  contactName: "",
  contactRole: "",
  email: "",
  phone: "",
  events: [],
  message: "",
  website: "",
};

export type AthleteInterestErrors = Partial<
  Record<keyof AthleteInterestData, string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, max = 80): string | undefined {
  if (!value.trim()) return "Required";
  if (value.trim().length > max) return "Too long";
  return undefined;
}

export function validateAthleteInterest(
  data: AthleteInterestData,
): AthleteInterestErrors {
  const errors: AthleteInterestErrors = {};
  errors.athleteFirst = required(data.athleteFirst);
  errors.athleteLast = required(data.athleteLast);
  if (!data.gradYear) errors.gradYear = "Select a year";
  else if (!GRAD_YEARS.includes(Number(data.gradYear)))
    errors.gradYear = "Select a year";
  if (
    data.positions.some(
      (p) => !(POSITIONS as readonly string[]).includes(p),
    )
  )
    errors.positions = "Pick from the list";
  if (data.club.trim().length > 120) errors.club = "Too long";
  errors.hometown = required(data.hometown, 120);
  errors.contactName = required(data.contactName, 120);
  if (!data.contactRole || !CONTACT_ROLES.includes(data.contactRole))
    errors.contactRole = "Pick one";
  if (!data.email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "Enter a valid email";
  if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number";
  if (data.message.length > 1000) errors.message = "Too long";

  for (const key of Object.keys(errors) as (keyof AthleteInterestData)[]) {
    if (errors[key] === undefined) delete errors[key];
  }
  return errors;
}
