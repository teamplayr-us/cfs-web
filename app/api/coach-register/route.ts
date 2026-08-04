import { NextResponse } from "next/server";
import { getEvent, stopLabel } from "@/data/events";
import { COACH_FIELD, createCoachRegistration } from "@/lib/airtable";
import {
  CoachRegistrationData,
  validateCoachRegistration,
} from "@/lib/coachRegistration";

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

  return NextResponse.json({ ok: true });
}
