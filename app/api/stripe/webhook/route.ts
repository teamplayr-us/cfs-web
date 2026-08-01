import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEvent, stopLabel } from "@/data/events";
import {
  buildRegistrationFields,
  createRegistration,
  registrationExists,
} from "@/lib/airtable";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      await req.text(),
      signature,
      webhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const m = session.metadata ?? {};
  const tourEvent = m.eventSlug ? getEvent(m.eventSlug) : undefined;

  if (await registrationExists(session.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  // A failed write returns 500 so Stripe retries — a registration must never
  // be paid in Stripe but missing from Airtable.
  try {
    await createRegistration(
      buildRegistrationFields(
        m,
        (session.amount_total ?? 0) / 100,
        session.id,
        tourEvent
          ? `${stopLabel(tourEvent)} — ${tourEvent.city}`
          : (m.eventSlug ?? ""),
      ),
    );
  } catch (err) {
    console.error("Airtable write failed for session", session.id, err);
    return NextResponse.json({ error: "Storage failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
