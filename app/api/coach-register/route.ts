import { NextResponse } from "next/server";
import { getEvent, stopLabel } from "@/data/events";
import { COACH_FIELD, createCoachRegistration } from "@/lib/airtable";
import {
  CoachRegistrationData,
  validateCoachRegistration,
} from "@/lib/coachRegistration";
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
  let data: CoachRegistrationData;
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

  const errors = validateCoachRegistration(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 400 },
    );
  }

  const clip = (s: string, n = 500) => s.trim().slice(0, n);
  const eventLabels = data.events
    .map((slug) => {
      const event = getEvent(slug);
      return event ? `${stopLabel(event)} — ${event.city}` : slug;
    })
    .join(", ");

  try {
    await createCoachRegistration({
      [COACH_FIELD.program]: clip(data.program, 120),
      [COACH_FIELD.coachFirst]: clip(data.coachFirst, 80),
      [COACH_FIELD.coachLast]: clip(data.coachLast, 80),
      [COACH_FIELD.role]: clip(data.role, 80),
      [COACH_FIELD.email]: clip(data.email, 120),
      [COACH_FIELD.phone]: clip(data.phone, 40) || undefined,
      [COACH_FIELD.level]: data.level,
      [COACH_FIELD.events]: eventLabels,
      [COACH_FIELD.collegeRowTent]: data.collegeRowTent === true,
      [COACH_FIELD.notes]: clip(data.notes, 1000) || undefined,
      [COACH_FIELD.status]: "New",
      [COACH_FIELD.submittedAt]: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Coach registration write failed", err);
    return NextResponse.json(
      { error: "Couldn't save your registration. Please try again." },
      { status: 500 },
    );
  }

  // Best-effort emails after the write succeeds — never fail the response.
  await sendEmail({
    to: NOTIFY_EMAIL,
    cc: NOTIFY_CC,
    subject: `New coach registration — ${data.program.trim()}`,
    html: emailLayout(
      "New Coach Registration",
      detailRows([
        ["Program", data.program],
        ["Coach", `${data.coachFirst} ${data.coachLast}`],
        ["Role", data.role],
        ["Level", data.level],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Events", eventLabels],
        ["College Row tent", data.collegeRowTent ? "Yes — free tent space requested" : undefined],
        ["Recruiting notes", data.notes],
      ]),
    ),
    replyTo: data.email.trim(),
  });
  await sendEmail({
    to: data.email.trim(),
    bcc: TRAIL_BCC,
    subject: "Recruiter credentials — registration received",
    html: emailLayout(
      "Registration Received",
      `<p>Hi ${escapeHtml(data.coachFirst.trim())},</p>
       <p>We&rsquo;ve got your recruiter registration for <b>${escapeHtml(data.program.trim())}</b>. Here&rsquo;s what happens next:</p>
       <ul style="padding-left:20px;">
         <li>We&rsquo;ll confirm your credentials by email.</li>
         <li>Before each event you picked (${escapeHtml(eventLabels)}), you&rsquo;ll get expected participant counts and your athlete recruiting package.</li>
         <li>We&rsquo;ll confirm the detailed weekend agenda and game schedules closer to the event.</li>
         <li>Your credentials will be waiting at check-in.</li>
         ${data.collegeRowTent ? "<li>Your College Row tent space is noted &mdash; we&rsquo;ll send setup details before each event.</li>" : ""}
       </ul>
       <p>Questions in the meantime? Email us at <a href="mailto:${NOTIFY_EMAIL}">${NOTIFY_EMAIL}</a>.</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
