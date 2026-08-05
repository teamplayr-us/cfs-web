// Shared types + validation for the college coach registration flow.
// Used by the client form and the API route so they can't drift.

export const LEVEL_OPTIONS = [
  "NCAA DI",
  "NCAA DII",
  "NCAA DIII",
  "NAIA",
  "NJCAA",
  "Club",
] as const;

export type LevelOption = (typeof LEVEL_OPTIONS)[number];

export const ROLE_OPTIONS = [
  "Head Coach",
  "Assistant Coach",
  "Recruiting Coordinator",
  "Athletic Director",
  "Other",
] as const;

export type RoleOption = (typeof ROLE_OPTIONS)[number];

export interface CoachRegistrationData {
  program: string;
  coachFirst: string;
  coachLast: string;
  role: RoleOption | "";
  email: string;
  phone: string;
  level: LevelOption | "";
  /** Event slugs the coach plans to attend */
  events: string[];
  /** Free tent space in College Row (Fan Zone) */
  collegeRowTent: boolean;
  notes: string;
  /** Honeypot — humans never fill this; bots do */
  website: string;
}

export const EMPTY_COACH_REGISTRATION: CoachRegistrationData = {
  program: "",
  coachFirst: "",
  coachLast: "",
  role: "",
  email: "",
  phone: "",
  level: "",
  events: [],
  collegeRowTent: false,
  notes: "",
  website: "",
};

export type CoachRegistrationErrors = Partial<
  Record<keyof CoachRegistrationData, string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, max = 120): string | undefined {
  if (!value.trim()) return "Required";
  if (value.trim().length > max) return "Too long";
  return undefined;
}

export function validateCoachRegistration(
  data: CoachRegistrationData,
): CoachRegistrationErrors {
  const errors: CoachRegistrationErrors = {};
  errors.program = required(data.program);
  errors.coachFirst = required(data.coachFirst, 80);
  errors.coachLast = required(data.coachLast, 80);
  if (!data.role) errors.role = "Pick one";
  else if (!ROLE_OPTIONS.includes(data.role)) errors.role = "Pick one";
  if (!data.email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "Enter a valid email";
  if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number";
  if (!data.level) errors.level = "Pick one";
  else if (!LEVEL_OPTIONS.includes(data.level)) errors.level = "Pick one";
  if (data.events.length === 0) errors.events = "Pick at least one event";
  if (data.notes.length > 1000) errors.notes = "Too long";

  for (const key of Object.keys(errors) as (keyof CoachRegistrationData)[]) {
    if (errors[key] === undefined) delete errors[key];
  }
  return errors;
}
