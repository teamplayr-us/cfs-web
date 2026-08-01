// Shared types + validation for the team invite request flow.
// Used by the client form and the API route so they can't drift.

export interface TeamInviteData {
  teamName: string;
  coachFirst: string;
  coachLast: string;
  email: string;
  phone: string;
  location: string;
  ageGroups: string;
  about: string;
  link: string;
  /** Event slugs the team wants to play */
  events: string[];
  /** Honeypot — humans never fill this; bots do */
  website: string;
}

export const EMPTY_TEAM_INVITE: TeamInviteData = {
  teamName: "",
  coachFirst: "",
  coachLast: "",
  email: "",
  phone: "",
  location: "",
  ageGroups: "",
  about: "",
  link: "",
  events: [],
  website: "",
};

export type TeamInviteErrors = Partial<Record<keyof TeamInviteData, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, max = 120): string | undefined {
  if (!value.trim()) return "Required";
  if (value.trim().length > max) return "Too long";
  return undefined;
}

export function validateTeamInvite(data: TeamInviteData): TeamInviteErrors {
  const errors: TeamInviteErrors = {};
  errors.teamName = required(data.teamName);
  errors.coachFirst = required(data.coachFirst, 80);
  errors.coachLast = required(data.coachLast, 80);
  if (!data.email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(data.email.trim())) errors.email = "Enter a valid email";
  if (!data.phone.trim()) errors.phone = "Required";
  else if (data.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number";
  errors.location = required(data.location);
  errors.ageGroups = required(data.ageGroups);
  if (data.about.length > 1000) errors.about = "Too long";
  if (data.link.trim() && !/^https?:\/\/\S+$/.test(data.link.trim()))
    errors.link = "Enter a full link (starting with http)";
  if (data.events.length === 0) errors.events = "Pick at least one event";

  for (const key of Object.keys(errors) as (keyof TeamInviteData)[]) {
    if (errors[key] === undefined) delete errors[key];
  }
  return errors;
}
