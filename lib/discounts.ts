// Discount codes for athlete registration, managed in the Airtable
// "Discount Codes" table (one row per code). Checked by /api/checkout
// (authoritative) and /api/discount (live price on the Review step).
//
// Rules: Active ✓, not past Expires (end of that day, Central), Uses under
// Max Uses (if set), Event Slug blank or matching. Amount Off ($) or
// Percent Off. If Airtable can't be reached, the TOURNAMENT_DISCOUNT_CODE
// env var still works as a $50 fallback so the team code never breaks.

import { TOURNAMENT_DISCOUNT_CENTS } from "@/data/events";

const TABLE = "tblon9K1v8xt7z0dR";
const F = {
  code: "fldP6BsPLCa5pm86p",
  active: "fldycjNPWHKeGtWqp",
  amountOff: "fldnw5DbVcwrldckQ",
  percentOff: "fldZo4ExKOU8x6tAX",
  maxUses: "fldvvJa9ecstPW8W8",
  expires: "fldRF8iCJ1Otc0O0k",
  eventSlug: "fldNZ0LATMAr0wOfV",
  uses: "fldb6ToXiHiJW8n2f",
} as const;

export type DiscountResult =
  | {
      ok: true;
      /** Discount Codes record ID; undefined for the env fallback */
      id?: string;
      code: string;
      offCents: number;
      finalCents: number;
    }
  | { ok: false; error: string };

const INVALID: DiscountResult = { ok: false, error: "That discount code isn't valid." };

/** Today's date (YYYY-MM-DD) in Central time, for "Expires" comparisons. */
function todayCentral(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function envFallback(code: string, priceCents: number): DiscountResult {
  const envCode = process.env.TOURNAMENT_DISCOUNT_CODE;
  if (!envCode || code.toLowerCase() !== envCode.toLowerCase()) return INVALID;
  const offCents = Math.min(TOURNAMENT_DISCOUNT_CENTS, priceCents);
  return { ok: true, code: envCode, offCents, finalCents: priceCents - offCents };
}

export async function findDiscount(
  rawCode: string,
  eventSlug: string,
  priceCents: number,
): Promise<DiscountResult> {
  const code = rawCode.trim();
  if (!code || code.length > 40) return INVALID;

  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!key || !baseId) return envFallback(code, priceCents);

  let rec: { id: string; fields: Record<string, unknown> } | undefined;
  try {
    const safe = code.toLowerCase().replace(/\\/g, "").replace(/'/g, "\\'");
    const params = new URLSearchParams({
      filterByFormula: `LOWER(TRIM({Code})) = '${safe}'`,
      returnFieldsByFieldId: "true",
      maxRecords: "5",
    });
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${TABLE}?${params}`,
      { headers: { Authorization: `Bearer ${key}` }, cache: "no-store" },
    );
    if (!res.ok) throw new Error(`Airtable discount lookup: ${res.status}`);
    const page = (await res.json()) as {
      records: { id: string; fields: Record<string, unknown> }[];
    };
    // Prefer an active row if the same code appears more than once.
    rec =
      page.records.find((r) => r.fields[F.active] === true) ?? page.records[0];
  } catch (err) {
    console.error("Discount lookup failed; using env fallback", err);
    return envFallback(code, priceCents);
  }

  if (!rec) return envFallback(code, priceCents);
  const f = rec.fields;
  if (f[F.active] !== true)
    return { ok: false, error: "That discount code is no longer active." };

  const expires = typeof f[F.expires] === "string" ? (f[F.expires] as string) : "";
  if (expires && todayCentral() > expires)
    return { ok: false, error: "That discount code has expired." };

  const onlyEvent =
    typeof f[F.eventSlug] === "string" ? (f[F.eventSlug] as string).trim() : "";
  if (onlyEvent && onlyEvent !== eventSlug)
    return { ok: false, error: "That discount code isn't valid for this event." };

  const maxUses = typeof f[F.maxUses] === "number" ? (f[F.maxUses] as number) : 0;
  const uses = typeof f[F.uses] === "number" ? (f[F.uses] as number) : 0;
  if (maxUses > 0 && uses >= maxUses)
    return { ok: false, error: "That discount code has reached its limit." };

  const amountOff = typeof f[F.amountOff] === "number" ? (f[F.amountOff] as number) : 0;
  const percentOff =
    typeof f[F.percentOff] === "number" ? (f[F.percentOff] as number) : 0;
  let offCents = 0;
  if (amountOff > 0) offCents = Math.round(amountOff * 100);
  else if (percentOff > 0) offCents = Math.round(priceCents * Math.min(percentOff, 1));
  if (offCents <= 0) return INVALID;
  offCents = Math.min(offCents, priceCents);

  return {
    ok: true,
    id: rec.id,
    code: typeof f[F.code] === "string" ? (f[F.code] as string).trim() : code,
    offCents,
    finalCents: priceCents - offCents,
  };
}
