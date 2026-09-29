import { NextResponse } from "next/server";
import { getEvent } from "@/data/events";
import { findDiscount } from "@/lib/discounts";

export const runtime = "nodejs";

/** Price preview for the Review step. Checkout re-validates for real. */
export async function POST(req: Request) {
  let body: { eventSlug?: string; code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const event = body.eventSlug ? getEvent(body.eventSlug) : undefined;
  if (!event?.athleteReg?.open || typeof body.code !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const result = await findDiscount(body.code, event.slug, event.athleteReg.priceCents);
  return result.ok
    ? NextResponse.json({
        ok: true,
        code: result.code,
        offCents: result.offCents,
        finalCents: result.finalCents,
      })
    : NextResponse.json({ ok: false, error: result.error });
}
