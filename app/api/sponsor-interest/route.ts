import { NextResponse } from "next/server";
import { getEvent, stopLabel } from "@/data/events";
import { createSponsorInterest, SPONSOR_FIELD } from "@/lib/airtable";
import {
  SponsorInterestData,
  validateSponsorInterest,
} from "@/lib/sponsorInterest";
import {
  detailRows,
  emailLayout,
  escapeHtml,
  NOTIFY_EMAIL,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let data: SponsorInterestData;
  try {
    data = (await req.json()).data;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!data) {
    return NextResponse.json({ error: "Missing form data." }, { status: 400 });
  }

  // Honeypot: silently accept but drop bot submissions.
  if (data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  const errors = validateSponsorInterest(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 400 },
    );
  }

  const clip = (s: string, n = 500) => s.trim().slice(0, n);
  const marketLabels = (data.markets ?? [])
    .map((slug) => {
      const event = getEvent(slug);
      return event ? `${stopLabel(event)} — ${event.city}` : slug;
    })
    .join(", ");

  try {
    await createSponsorInterest({
      [SPONSOR_FIELD.company]: clip(data.company, 120),
      [SPONSOR_FIELD.contactFirst]: clip(data.contactFirst, 80),
      [SPONSOR_FIELD.contactLast]: clip(data.contactLast, 80),
      [SPONSOR_FIELD.email]: clip(data.email, 120),
      [SPONSOR_FIELD.phone]: clip(data.phone, 40) || undefined,
      [SPONSOR_FIELD.website]: clip(data.siteUrl, 300) || undefined,
      [SPONSOR_FIELD.pkg]: data.pkg,
      [SPONSOR_FIELD.markets]: marketLabels || undefined,
      [SPONSOR_FIELD.message]: clip(data.message, 1000) || undefined,
      [SPONSOR_FIELD.status]: "New",
      [SPONSOR_FIELD.submittedAt]: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Sponsor interest write failed", err);
    return NextResponse.json(
      { error: "Couldn't save your request. Please try again." },
      { status: 500 },
    );
  }

  // Best-effort emails after the write succeeds — never fail the response.
  await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `New sponsorship inquiry — ${data.company.trim()}`,
    html: emailLayout(
      "New Sponsorship Inquiry",
      detailRows([
        ["Company", data.company],
        ["Contact", `${data.contactFirst} ${data.contactLast}`],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Website", data.siteUrl],
        ["Package", data.pkg],
        ["Markets", marketLabels],
        ["Message", data.message],
      ]),
    ),
    replyTo: data.email.trim(),
  });
  await sendEmail({
    to: data.email.trim(),
    subject: "Sponsorship inquiry received — College Flag Showcase Series",
    html: emailLayout(
      "Inquiry Received",
      `<p>Hi ${escapeHtml(data.contactFirst.trim())},</p>
       <p>Thanks for your interest in putting <b>${escapeHtml(data.company.trim())}</b> on the field with the College Flag Showcase Series.</p>
       <p>We&rsquo;ll review your inquiry and come back to you with a package built around your brand and the markets you care about.</p>
       <p>Questions in the meantime? Just reply to this email.</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
