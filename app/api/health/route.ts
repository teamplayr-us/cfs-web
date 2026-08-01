import { NextResponse } from "next/server";
import { buildRegistrationFields, REG_FIELD } from "@/lib/airtable";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Ops diagnostic: reports which integrations are configured and live-probes
// Airtable with the deployed credentials. Booleans and status codes only —
// never secret values. With ?write=1 it additionally replays the webhook's
// exact Airtable sequence (dup-check query, create, then delete the test row).
export async function GET(req: Request) {
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

  if (new URL(req.url).searchParams.get("write") === "1" && key && baseId) {
    const base = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`;
    const headers = {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    };

    // Step 1: the webhook's duplicate-check query
    try {
      const params = new URLSearchParams({
        filterByFormula: `{Stripe Session} = 'cs_healthcheck_probe'`,
        maxRecords: "1",
        "fields[]": REG_FIELD.stripeSession,
      });
      const res = await fetch(`${base}?${params}`, { headers, cache: "no-store" });
      result.dupCheckProbe = res.ok
        ? "OK"
        : `FAILED — HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`;
    } catch (err) {
      result.dupCheckProbe = `FAILED — ${err instanceof Error ? err.message : "?"}`;
    }

    // Step 2: create a record shaped exactly like a real registration
    try {
      const res = await fetch(base, {
        method: "POST",
        headers,
        body: JSON.stringify({
          records: [
            {
              fields: buildRegistrationFields(
                {
                  athleteFirst: "HEALTHCHECK",
                  athleteLast: "safe to delete",
                  dob: "2011-01-01",
                  gradYear: "2029",
                  positions: "WR",
                  medical: "healthcheck probe",
                  guardianFirst: "Health",
                  guardianLast: "Check",
                  guardianEmail: "healthcheck@example.com",
                  guardianPhone: "5550000000",
                  emergencyFirst: "Health",
                  emergencyLast: "Check",
                  emergencyPhone: "5550000000",
                  waiverSignature: "Health Check",
                  waiverSignedAt: new Date().toISOString(),
                  eventSlug: "healthcheck",
                },
                0,
                "cs_healthcheck_probe",
                "healthcheck",
              ),
            },
          ],
          typecast: true,
        }),
      });
      const body = await res.text();
      if (res.ok) {
        result.writeProbe = "OK — created test record";
        const id = JSON.parse(body).records?.[0]?.id;
        if (id) {
          const del = await fetch(`${base}/${id}`, { method: "DELETE", headers });
          result.cleanupProbe = del.ok ? "OK — test record deleted" : `delete failed HTTP ${del.status}`;
        }
      } else {
        result.writeProbe = `FAILED — HTTP ${res.status}: ${body.slice(0, 300)}`;
      }
    } catch (err) {
      result.writeProbe = `FAILED — ${err instanceof Error ? err.message : "?"}`;
    }
  }

  return NextResponse.json(result);
}
