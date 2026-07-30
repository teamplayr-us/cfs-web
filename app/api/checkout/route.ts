import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEvent, stopLabel } from "@/data/events";
import {
  RegistrationData,
  toStripeMetadata,
  validateRegistration,
} from "@/lib/registration";
import { countRegistrations } from "@/lib/airtable";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Registration isn't open for payment yet. Check back soon." },
      { status: 503 },
    );
  }

  let body: { eventSlug?: string; data?: RegistrationData };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const event = body.eventSlug ? getEvent(body.eventSlug) : undefined;
  if (!event?.athleteReg?.open) {
    return NextResponse.json(
      { error: "Registration is not open for this event." },
      { status: 404 },
    );
  }
  if (!body.data) {
    return NextResponse.json({ error: "Missing form data." }, { status: 400 });
  }

  const errors = validateRegistration(body.data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 400 },
    );
  }

  if (event.athleteReg.capacity) {
    const count = await countRegistrations(event.slug);
    if (count !== null && count >= event.athleteReg.capacity) {
      return NextResponse.json(
        { error: "This event is sold out." },
        { status: 409 },
      );
    }
  }

  const stripe = new Stripe(stripeKey);
  const origin = new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: event.athleteReg.priceCents,
          product_data: {
            name: `Athlete Registration — ${event.city} (${stopLabel(event)})`,
            description: "College Flag Showcase Series — Showcase Combine & Camp",
          },
        },
      },
    ],
    customer_email: body.data.guardianEmail.trim(),
    metadata: toStripeMetadata(body.data, event.slug),
    success_url: `${origin}/events/${event.slug}/register/success`,
    cancel_url: `${origin}/events/${event.slug}/register?canceled=1`,
  });

  return NextResponse.json({ url: session.url });
}
