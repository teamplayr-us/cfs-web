import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEvent, stopLabel } from "@/data/events";
import { findDiscount } from "@/lib/discounts";
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
    // If Airtable can't be reached, don't block the sale on a count.
    const count = await countRegistrations(event.slug).catch((err) => {
      console.error("Capacity check failed", err);
      return null;
    });
    if (count !== null && count >= event.athleteReg.capacity) {
      return NextResponse.json(
        { error: "This event is sold out." },
        { status: 409 },
      );
    }
  }

  // Discount codes live in the Airtable "Discount Codes" table (lib/
  // discounts.ts) and are validated here only — never in the client bundle.
  const price = event.athleteReg.priceCents;
  const enteredCode = (body.data.discountCode ?? "").trim();
  const discount = enteredCode
    ? await findDiscount(enteredCode, event.slug, price)
    : null;
  if (discount && !discount.ok) {
    return NextResponse.json(
      { error: discount.error, fields: { discountCode: discount.error } },
      { status: 400 },
    );
  }

  const stripe = new Stripe(stripeKey);
  const origin = new URL(req.url).origin;
  const metadata = toStripeMetadata(body.data, event.slug);
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;

  try {
    if (discount?.ok && discount.offCents > 0) {
      // A single-use Stripe coupon shows the code as a line on the Stripe
      // page and receipt, and lets a 100%-off code complete at $0.
      const coupon = await stripe.coupons.create({
        amount_off: discount.offCents,
        currency: "usd",
        duration: "once",
        max_redemptions: 1,
        name: discount.code.toUpperCase().slice(0, 40),
      });
      discounts = [{ coupon: coupon.id }];
      metadata.discountCode = discount.code;
      if (discount.id) metadata.discountCodeId = discount.id;
    }
  } catch (err) {
    console.error("Stripe coupon failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't apply that discount. Please try again in a minute, or email info@collegeflagshowcase.com.",
      },
      { status: 502 },
    );
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: `Athlete Registration — ${event.city} (${stopLabel(event)})`,
              description:
                "College Flag Showcase Series — Showcase Combine & Camp",
            },
          },
        },
      ],
      ...(discounts ? { discounts } : {}),
      customer_email: body.data.guardianEmail.trim(),
      metadata,
      success_url: `${origin}/events/${event.slug}/register/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${event.slug}/register?canceled=1`,
    });
  } catch (err) {
    console.error("Stripe checkout session failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't start checkout. Please try again in a minute, or email info@collegeflagshowcase.com.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: session.url });
}
