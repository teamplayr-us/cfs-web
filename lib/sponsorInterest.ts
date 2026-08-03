// Shared types + validation for the sponsor interest flow.
// Used by the client form and the API route so they can't drift.

export const PACKAGE_OPTIONS = [
  "Presenting Sponsor",
  "Season Partner",
  "Single Event",
  "Not sure yet",
] as const;

export type PackageOption = (typeof PACKAGE_OPTIONS)[number];

/** Maps ?package= query values from the tier CTAs to select options */
export const PACKAGE_PARAM: Record<string, PackageOption> = {
  presenting: "Presenting Sponsor",
  season: "Season Partner",
  single: "Single Event",
};

export interface SponsorInterestData {
  company: string;
  contactFirst: string;
  contactLast: string;
  email: string;
  phone: string;
  siteUrl: string;
  pkg: PackageOption | "";
  /** Event slugs the sponsor cares about (optional) */
  markets: string[];
  message: string;
  /** Honeypot — humans never fill this; bots do */
  website: string;
}

export const EMPTY_SPONSOR_INTEREST: SponsorInterestData = {
  company: "",
  contactFirst: "",
  contactLast: "",
  email: "",
  phone: "",
  siteUrl: "",
  pkg: "",
  markets: [],
  message: "",
  website: "",
};

export type SponsorInterestErrors = Partial<
  Record<keyof SponsorInterestData, string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function required(value: string, max = 120): string | undefined {
  if (!value.trim()) return "Required";
  if (value.trim().length > max) return "Too long";
  return undefined;
}

export function validateSponsorInterest(
  data: SponsorInterestData,
): SponsorInterestErrors {
  const errors: SponsorInterestErrors = {};
  errors.company = required(data.company);
  errors.contactFirst = required(data.contactFirst, 80);
  errors.contactLast = required(data.contactLast, 80);
  if (!data.email.trim()) errors.email = "Required";
  else if (!EMAIL_RE.test(data.email.trim()))
    errors.email = "Enter a valid email";
  if (data.phone.trim() && data.phone.replace(/\D/g, "").length < 7)
    errors.phone = "Enter a valid phone number";
  if (data.siteUrl.trim() && !/^https?:\/\/\S+$/.test(data.siteUrl.trim()))
    errors.siteUrl = "Enter a full link (starting with http)";
  if (!data.pkg) errors.pkg = "Pick one";
  else if (!PACKAGE_OPTIONS.includes(data.pkg)) errors.pkg = "Pick one";
  if (data.message.length > 1000) errors.message = "Too long";

  for (const key of Object.keys(errors) as (keyof SponsorInterestData)[]) {
    if (errors[key] === undefined) delete errors[key];
  }
  return errors;
}
