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
  TRAIL_BCC,
} from "@/lib/email";
import { REFUND_POLICY } from "@/lib/policy";

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

  // Card payments complete immediately; delayed methods (if ever enabled)
  // arrive later as async_payment_succeeded. Only a paid session is stored.
  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, pending: true });
  }
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
  const reg = tourEvent?.athleteReg;
  const combineDate = reg?.combineDate ?? tourEvent?.details?.dates;
  const combineTime =
    reg?.combineStartTime && reg?.combineEndTime
      ? `${reg.combineStartTime} – ${reg.combineEndTime}`
      : undefined;
  const guestPool = m.guestPool === "yes";

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
        ["Jersey size", m.jerseySize],
        ["Hometown", [m.hometown, m.zip].filter(Boolean).join(" ")],
        ["Club team", m.clubTeam || "None"],
        ["Guest pool", guestPool ? "Yes — opted in" : "No"],
        ["Guardian", `${m.guardianFirst ?? ""} ${m.guardianLast ?? ""}`.trim()],
        ["Guardian email", m.guardianEmail],
        ["Guardian phone", m.guardianPhone],
        ["Paid", `$${amount}`],
        ["Discount code", m.discountCode],
      ]),
    ),
    replyTo: m.guardianEmail,
  });
  if (m.guardianEmail) {
    await sendEmail({
      to: m.guardianEmail,
      bcc: TRAIL_BCC,
      subject: `Registration confirmed — ${eventLabel}`,
      html: emailLayout(
        "Registration Confirmed",
        `<p>Hi ${escapeHtml(m.guardianFirst ?? "there")},</p>
         <p><b>${escapeHtml(athleteName)}</b> is registered for the Showcase Combine &amp; Camp at <b>${escapeHtml(eventLabel)}</b>. Payment of $${amount} is confirmed &mdash; your Stripe receipt arrives separately.</p>
         ${detailRows([
           ["Date", combineDate],
           ["Time", combineTime],
           ["Venue", tourEvent?.venue],
         ])}
         <p>What&rsquo;s next: we&rsquo;ll email the full event-weekend schedule and check-in details before the event. Before then, get her Flag Football Finder profile current at <a href="https://www.flagfootballfinder.com">flagfootballfinder.com</a>.</p>
         ${guestPool ? `<p>She&rsquo;s in the guest player pool. If a registered team&rsquo;s club coach requests her, we&rsquo;ll review the request and contact you before sharing her details.</p>` : ""}
         <p>The participant waiver you signed is at <a href="https://www.collegeflagshowcase.com/waiver">collegeflagshowcase.com/waiver</a>.</p>
         <p style="font-size:13px;color:#5C5A5E;"><b>Cancellations:</b> ${escapeHtml(REFUND_POLICY)}</p>
         <p>Questions in the meantime? Email us at <a href="mailto:${NOTIFY_EMAIL}">${NOTIFY_EMAIL}</a>.</p>`,
      ),
    });
  }

  return NextResponse.json({ received: true });
}
