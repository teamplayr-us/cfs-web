import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getEvent, stopLabel } from "@/data/events";
import {
  buildRegistrationFields,
  createRegistration,
  registrationExists,
} from "@/lib/airtable";
import {
  detailRows,
  emailLayout,
  escapeHtml,
  NOTIFY_CC,
  NOTIFY_EMAIL,
  sendEmail,
} from "@/lib/email";

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

  // Best-effort emails after the registration is stored. sendEmail never
  // throws, so the webhook always returns 200 once the write succeeded.
  const eventLabel = tourEvent
    ? `${stopLabel(tourEvent)} — ${tourEvent.city}`
    : (m.eventSlug ?? "");
  const athleteName = `${m.athleteFirst ?? ""} ${m.athleteLast ?? ""}`.trim();
  const amount = ((session.amount_total ?? 0) / 100).toFixed(2);
  const combineDate =
    tourEvent?.athleteReg?.combineDate ?? tourEvent?.details?.dates;

  await sendEmail({
    to: NOTIFY_EMAIL,
    cc: NOTIFY_CC,
    subject: `New athlete registration — ${athleteName} (${eventLabel})`,
    html: emailLayout(
      "New Athlete Registration",
      detailRows([
        ["Athlete", athleteName],
        ["Event", eventLabel],
        ["Grad year", m.gradYear],
        ["Positions", m.positions],
        ["Guardian", `${m.guardianFirst ?? ""} ${m.guardianLast ?? ""}`.trim()],
        ["Guardian email", m.guardianEmail],
        ["Guardian phone", m.guardianPhone],
        ["Paid", `$${amount}`],
      ]),
    ),
    replyTo: m.guardianEmail,
  });
  if (m.guardianEmail) {
    await sendEmail({
      to: m.guardianEmail,
      subject: `Registration confirmed — ${eventLabel}`,
      html: emailLayout(
        "Registration Confirmed",
        `<p>Hi ${escapeHtml(m.guardianFirst ?? "there")},</p>
         <p><b>${escapeHtml(athleteName)}</b> is registered for the Showcase Combine &amp; Camp at <b>${escapeHtml(eventLabel)}</b>${combineDate ? ` (${escapeHtml(combineDate)})` : ""}. Payment of $${amount} is confirmed &mdash; your Stripe receipt arrives separately.</p>
         <p>What&rsquo;s next: we&rsquo;ll email the full event-weekend schedule and check-in details before the event.</p>
         <p>Questions in the meantime? Just reply to this email.</p>`,
      ),
    });
  }

  return NextResponse.json({ received: true });
}
