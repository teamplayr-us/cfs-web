// Minimal Airtable REST helpers for the registration webhook.
// Configured via env vars (see .env.example); every function degrades
// gracefully when Airtable isn't configured yet.

const API = "https://api.airtable.com/v0";

// Field IDs for the Athlete Registrations table (base app0mk0cTZLDeVahe,
// table tblmp5EHSrHHaxjpD). Records are written by field ID so renaming
// fields in the Airtable UI can't break the webhook. Exception: the
// filterByFormula queries below must reference {Stripe Session} and
// {Event Slug} by NAME (Airtable formulas can't use IDs) — those two field
// names are marked "do not rename" in their Airtable descriptions.
export const REG_FIELD = {
  athlete: "fldBLv82pfsp2b4Jc",
  athleteFirst: "fld0lmFkhOuTuAbs1",
  athleteLast: "fldwCkY7m4O4jykKE",
  dob: "flduSMZdKcmemyMwl",
  gradYear: "fldBq3ZWLas5mLCpb",
  positions: "fldzshsnjy0TZiTic",
  fffProfile: "fldPEZHF9FtfdQUVb",
  medicalNotes: "fldlrQNWFtQdIM0EW",
  guardianFirst: "fldqThLrWw0hTvGgs",
  guardianLast: "fldkmtahzTHX11BD5",
  guardianEmail: "fldaK7Wc9ZTMpwPul",
  guardianPhone: "fldqp481xrlBiHML2",
  emergencyFirst: "fld10xpV6E9UomgqD",
  emergencyLast: "fldMu0pyGwG818Cb5",
  emergencyPhone: "fldDqS009VxlikFj4",
  waiverSignature: "fldzlvABW62rFvM7Y",
  waiverSignedAt: "flda84f0IhxbHQ1H7",
  eventSlug: "fld4IJ9L69PeyW12o",
  eventLabel: "fldDg7u5E7Q5Ce7HI",
  amountPaid: "fldoNmg8VveKzklOa",
  stripeSession: "fld53TALilRE89tuM",
  status: "fld8yD9hKqpillzM3",
} as const;

/** Build the Airtable record for a paid registration from Stripe Checkout
 * metadata. Keys are field IDs (rename-proof). Shared by the webhook and
 * the /api/health write probe so the two can't drift. */
export function buildRegistrationFields(
  m: Record<string, string | undefined>,
  amountPaid: number,
  sessionId: string,
  eventLabel: string,
): Record<string, unknown> {
  return {
    [REG_FIELD.athlete]: `${m.athleteFirst ?? ""} ${m.athleteLast ?? ""}`.trim(),
    [REG_FIELD.athleteFirst]: m.athleteFirst,
    [REG_FIELD.athleteLast]: m.athleteLast,
    [REG_FIELD.dob]: m.dob,
    [REG_FIELD.gradYear]: m.gradYear ? Number(m.gradYear) : undefined,
    [REG_FIELD.positions]: m.positions,
    [REG_FIELD.fffProfile]: m.fffUrl || undefined,
    [REG_FIELD.medicalNotes]: m.medical || undefined,
    [REG_FIELD.guardianFirst]: m.guardianFirst,
    [REG_FIELD.guardianLast]: m.guardianLast,
    [REG_FIELD.guardianEmail]: m.guardianEmail,
    [REG_FIELD.guardianPhone]: m.guardianPhone,
    [REG_FIELD.emergencyFirst]: m.emergencyFirst,
    [REG_FIELD.emergencyLast]: m.emergencyLast,
    [REG_FIELD.emergencyPhone]: m.emergencyPhone,
    [REG_FIELD.waiverSignature]: m.waiverSignature,
    [REG_FIELD.waiverSignedAt]: m.waiverSignedAt,
    [REG_FIELD.eventSlug]: m.eventSlug,
    [REG_FIELD.eventLabel]: eventLabel,
    [REG_FIELD.amountPaid]: amountPaid,
    [REG_FIELD.stripeSession]: sessionId,
    [REG_FIELD.status]: "Paid",
  };
}

function config() {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE ?? "Registrations";
  if (!key || !baseId) return null;
  return { key, baseId, table };
}

async function listRecords(
  params: URLSearchParams,
): Promise<{ records: { id: string }[]; offset?: string } | null> {
  const cfg = config();
  if (!cfg) return null;
  const res = await fetch(
    `${API}/${cfg.baseId}/${encodeURIComponent(cfg.table)}?${params}`,
    { headers: { Authorization: `Bearer ${cfg.key}` }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Airtable list failed: ${res.status}`);
  return res.json();
}

/** Count paid registrations for an event. Returns null when Airtable isn't
 * configured (callers treat that as "can't check, don't block"). */
export async function countRegistrations(
  eventSlug: string,
): Promise<number | null> {
  if (!config()) return null;
  let count = 0;
  let offset: string | undefined;
  do {
    const params = new URLSearchParams({
      filterByFormula: `{Event Slug} = '${eventSlug.replace(/'/g, "\\'")}'`,
      pageSize: "100",
      "fields[]": REG_FIELD.eventSlug,
    });
    if (offset) params.set("offset", offset);
    const page = await listRecords(params);
    if (!page) return null;
    count += page.records.length;
    offset = page.offset;
  } while (offset);
  return count;
}

/** True if a registration for this Stripe session already exists (webhook
 * retries must not create duplicates). */
export async function registrationExists(sessionId: string): Promise<boolean> {
  const params = new URLSearchParams({
    filterByFormula: `{Stripe Session} = '${sessionId.replace(/'/g, "\\'")}'`,
    maxRecords: "1",
    "fields[]": REG_FIELD.stripeSession,
  });
  const page = await listRecords(params);
  return page !== null && page.records.length > 0;
}

export async function createRegistration(
  fields: Record<string, unknown>,
): Promise<void> {
  const cfg = config();
  if (!cfg) throw new Error("Airtable is not configured");
  const res = await fetch(
    `${API}/${cfg.baseId}/${encodeURIComponent(cfg.table)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ records: [{ fields }], typecast: true }),
    },
  );
  if (!res.ok) {
    throw new Error(`Airtable create failed: ${res.status} ${await res.text()}`);
  }
}
