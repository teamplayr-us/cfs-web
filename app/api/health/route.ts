import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ops diagnostic: reports which integrations are configured and live-probes
// Airtable with the deployed credentials. Booleans and status codes only —
// never secret values.
export async function GET() {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const result: Record<string, unknown> = {
    stripeSecretKey: stripeKey
      ? `set (${stripeKey.slice(0, 8)}…, ${stripeKey.length} chars)`
      : "MISSING",
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET
      ? `set (${process.env.STRIPE_WEBHOOK_SECRET.slice(0, 6)}…)`
      : "MISSING",
    airtableApiKey: process.env.AIRTABLE_API_KEY
      ? `set (${process.env.AIRTABLE_API_KEY.slice(0, 3)}…, ${process.env.AIRTABLE_API_KEY.length} chars)`
      : "MISSING",
    airtableBaseId: process.env.AIRTABLE_BASE_ID ?? "MISSING",
    airtableTable: process.env.AIRTABLE_TABLE ?? "MISSING (defaults to 'Registrations')",
  };

  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE ?? "Registrations";
  if (key && baseId) {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?maxRecords=1`,
        { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
      );
      result.airtableProbe = res.ok
        ? "OK — can read the table"
        : `FAILED — HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`;
    } catch (err) {
      result.airtableProbe = `FAILED — ${err instanceof Error ? err.message : "unknown error"}`;
    }
  } else {
    result.airtableProbe = "SKIPPED — Airtable env vars missing";
  }

  return NextResponse.json(result);
}
