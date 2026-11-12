import { NextResponse } from "next/server";
import {
  findCoachByToken,
  RSVP_EVENTS,
  RsvpAnswers,
  saveRsvp,
} from "@/lib/coachRsvp";
import {
  detailRows,
  emailLayout,
  NOTIFY_CC,
  NOTIFY_EMAIL,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string; answers?: Partial<RsvpAnswers> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const token = String(body.token ?? "");
  const a = body.answers ?? {};
  const answers: RsvpAnswers = {
    combine: a.combine === true,
    welcome: a.welcome === true,
    saturday: a.saturday === true,
    sunday: a.sunday === true,
    tent: a.tent === true,
  };

  let coach;
  try {
    coach = await findCoachByToken(token);
  } catch (err) {
    console.error("RSVP lookup failed", err);
    return NextResponse.json(
      { error: "Couldn't reach our system. Please try again." },
      { status: 500 },
    );
  }
  if (!coach) {
    return NextResponse.json(
      { error: "This RSVP link isn't valid. Email info@collegeflagshowcase.com and we'll send a new one." },
      { status: 404 },
    );
  }

  try {
    await saveRsvp(coach.id, answers);
  } catch (err) {
    console.error("RSVP save failed", err);
    return NextResponse.json(
      { error: "Couldn't save your RSVP. Please try again." },
      { status: 500 },
    );
  }

  const name = `${coach.first} ${coach.last}`.trim();
  const yesNo = (v: boolean) => (v ? "Yes" : "No");
  await sendEmail({
    to: NOTIFY_EMAIL,
    cc: NOTIFY_CC,
    subject: `Coach RSVP — ${name} (${coach.program})`,
    html: emailLayout(
      "College Coach RSVP",
      detailRows([
        ["Coach", name],
        ["Program", coach.program],
        ...RSVP_EVENTS.map(
          (e) => [e.label, yesNo(answers[e.key])] as [string, string],
        ),
        ["College Row tent", yesNo(answers.tent)],
        ["Updated", coach.rsvpAt ? "Yes — changed an earlier RSVP" : "First RSVP"],
      ]),
    ),
    replyTo: coach.email || undefined,
  });

  return NextResponse.json({ ok: true });
}
