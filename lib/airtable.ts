// Minimal Airtable REST helpers for the registration webhook.
// Configured via env vars (see .env.example); every function degrades
// gracefully when Airtable isn't configured yet.

const API = "https://api.airtable.com/v0";

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
      "fields[]": "Event Slug",
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
    "fields[]": "Stripe Session",
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
