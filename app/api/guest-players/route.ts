import { NextResponse } from "next/server";
import { getEvent, stopLabel } from "@/data/events";
import {
  createGuestPlayer,
  EMPTY_GUEST_PLAYER,
  GUEST_CONSENT_VERSION,
  GuestPlayerData,
  guestPlayerFields,
  hometownOf,
  validateGuestPlayer,
} from "@/lib/guestPlayer";
import { countryName } from "@/lib/states";
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
  let raw: Record<string, unknown>;
  try {
    raw = (await req.json()).data;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!raw || typeof raw !== "object")
    return NextResponse.json({ error: "Missing form data." }, { status: 400 });

  // Coerce to the expected shape so malformed input can't crash validation.
  const d = { ...EMPTY_GUEST_PLAYER } as GuestPlayerData;
  for (const k of Object.keys(EMPTY_GUEST_PLAYER) as (keyof GuestPlayerData)[]) {
    const v = raw[k];
    const base = EMPTY_GUEST_PLAYER[k];
    if (Array.isArray(base))
      (d[k] as string[]) = Array.isArray(v) ? v.map(String).slice(0, 10) : [];
    else if (typeof base === "boolean") (d[k] as boolean) = v === true;
    else (d[k] as string) = typeof v === "string" ? v.slice(0, 500) : "";
  }

  // Honeypot: pretend success so bots move on.
  if (d.website) return NextResponse.json({ ok: true });

  const event = d.eventSlug ? getEvent(d.eventSlug) : undefined;
  const errors = validateGuestPlayer(d);
  if (!event?.airtableEventId) errors.eventSlug = "Select an event";
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Some fields need attention.", fields: errors },
      { status: 400 },
    );
  }

  const eventLabel = `${stopLabel(event!)} — ${event!.city}`;
  const m: Record<string, string> = {
    eventSlug: event!.slug,
    athleteFirst: d.athleteFirst,
    athleteLast: d.athleteLast,
    dob: d.dob,
    gradYear: d.gradYear,
    positions: d.positions.join(", "),
    country: countryName(d.country),
    city: d.city,
    state: d.state,
    zip: d.zip,
    hometown: hometownOf(d.country, d.city, d.state),
    clubTeam: d.clubTeam,
    fffUrl: d.fffUrl,
    guardianFirst: d.guardianFirst,
    guardianLast: d.guardianLast,
    guardianEmail: d.guardianEmail.trim(),
    guardianPhone: d.guardianPhone,
  };

  try {
    await createGuestPlayer(
      guestPlayerFields(m, {
        source: "Guest Pool Form",
        eventLabel,
        consentSignature: d.consentSignature.trim(),
        consentVersion: GUEST_CONSENT_VERSION,
      }),
    );
  } catch (err) {
    console.error("Guest player sign-up failed", err);
    return NextResponse.json(
      {
        error:
          "We couldn't save your sign-up. Please try again in a minute, or email info@collegeflagshowcase.com.",
      },
      { status: 502 },
    );
  }

  const athlete = `${d.athleteFirst} ${d.athleteLast}`.trim();
  await sendEmail({
    to: NOTIFY_EMAIL,
    cc: NOTIFY_CC,
    subject: `New guest player — ${athlete} (${eventLabel})`,
    html: emailLayout(
      "New Guest Player",
      detailRows([
        ["Athlete", athlete],
        ["Event", eventLabel],
        ["Grad year", d.gradYear],
        ["Positions", m.positions],
        ["Hometown", [m.hometown, d.zip].filter(Boolean).join(" ")],
        ["Club team", d.clubTeam || "None"],
        ["Guardian", `${d.guardianFirst} ${d.guardianLast}`],
        ["Guardian email", m.guardianEmail],
        ["Guardian phone", d.guardianPhone],
      ]),
    ),
    replyTo: m.guardianEmail,
  });
  await sendEmail({
    to: m.guardianEmail,
    bcc: TRAIL_BCC,
    subject: `${athlete} is in the guest player pool — ${eventLabel}`,
    html: emailLayout(
      "You're in the Pool",
      `<p>Hi ${escapeHtml(d.guardianFirst)},</p>
       <p><b>${escapeHtml(athlete)}</b> is now in the guest player pool for the Showcase Tournament at <b>${escapeHtml(eventLabel)}</b>. Club coaches of registered teams can see the profile and may contact you directly about a roster spot.</p>
       <p>Joining is free. A team that selects a guest player may ask the family to contribute toward its tournament registration fee.</p>
       <p>Want college coaches to evaluate your athlete in skill work and testing too? The Showcase Combine &amp; Camp is open for registration at <a href="https://www.collegeflagshowcase.com/events/${event!.slug}/register">collegeflagshowcase.com</a>.</p>
       <p>To leave the pool or update anything, email <a href="mailto:${NOTIFY_EMAIL}">${NOTIFY_EMAIL}</a>.</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
