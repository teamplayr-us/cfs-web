import { NextResponse } from "next/server";
import { getEvent } from "@/data/events";
import {
  ATHLETE_INTEREST_FIELD as F,
  createAthleteInterest,
} from "@/lib/airtable";
import {
  AthleteInterestData,
  validateAthleteInterest,
} from "@/lib/athleteInterest";
import {
  detailRows,
  emailLayout,
  escapeHtml,
  NOTIFY_CC,
  NOTIFY_EMAIL,
  sendEmail,
  TRAIL_BCC,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let data: AthleteInterestData;
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

  const errors = validateAthleteInterest(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 400 },
    );
  }

  const clip = (s: string, n = 120) => s.trim().slice(0, n);
  const athlete = `${clip(data.athleteFirst, 80)} ${clip(data.athleteLast, 80)}`;
  const eventLabels = (data.events ?? [])
    .map((slug) => {
      const event = getEvent(slug);
      return event ? `College Flag Showcase – ${event.city}` : null;
    })
    .filter(Boolean)
    .join(", ");
  const positions = (data.positions ?? []).join(", ");

  try {
    await createAthleteInterest({
      [F.athlete]: athlete,
      [F.athleteFirst]: clip(data.athleteFirst, 80),
      [F.athleteLast]: clip(data.athleteLast, 80),
      [F.gradYear]: Number(data.gradYear),
      [F.positions]: positions || undefined,
      [F.club]: clip(data.club) || undefined,
      [F.hometown]: clip(data.hometown),
      [F.contactName]: clip(data.contactName),
      [F.contactRole]: data.contactRole,
      [F.email]: clip(data.email),
      [F.phone]: clip(data.phone, 40) || undefined,
      [F.events]: eventLabels || undefined,
      [F.message]: data.message.trim().slice(0, 1000) || undefined,
      [F.status]: "New",
      [F.submittedAt]: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Athlete interest write failed", err);
    return NextResponse.json(
      { error: "Couldn't save your info. Please try again." },
      { status: 500 },
    );
  }

  // Best-effort emails after the write succeeds — never fail the response.
  await sendEmail({
    to: NOTIFY_EMAIL,
    cc: NOTIFY_CC,
    subject: `New athlete interest — ${athlete}`,
    html: emailLayout(
      "New Athlete Interest",
      detailRows([
        ["Athlete", athlete],
        ["Grad year", data.gradYear],
        ["Positions", positions],
        ["Club team", data.club],
        ["Hometown", data.hometown],
        ["Contact", `${data.contactName} (${data.contactRole})`],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Events", eventLabels],
        ["Message", data.message],
      ]),
    ),
    replyTo: data.email.trim(),
  });
  await sendEmail({
    to: data.email.trim(),
    bcc: TRAIL_BCC,
    subject: "You're on the list — College Flag Showcase Series",
    html: emailLayout(
      "You're on the List",
      `<p>Hi ${escapeHtml(data.contactName.trim().split(/\s+/)[0])},</p>
       <p>Thanks for your interest in the College Flag Showcase Series. We have <b>${escapeHtml(athlete)}</b> on our list, and we&rsquo;ll keep you posted on dates, deadlines, and new events.</p>
       <p>Registration for the Showcase Combine &amp; Camp in Dallas is open now at <a href="https://www.collegeflagshowcase.com/events/mckinney-tx/register">collegeflagshowcase.com/events/mckinney-tx/register</a>.</p>
       <p>Questions in the meantime? Reply to this email or write us at <a href="mailto:${NOTIFY_EMAIL}">${NOTIFY_EMAIL}</a>.</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
