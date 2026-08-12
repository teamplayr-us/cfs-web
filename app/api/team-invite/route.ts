import { NextResponse } from "next/server";
import { getEvent, stopLabel } from "@/data/events";
import { createTeamInvite, TEAM_FIELD } from "@/lib/airtable";
import { TeamInviteData, validateTeamInvite } from "@/lib/teamInvite";
import {
  detailRows,
  emailLayout,
  escapeHtml,
  NOTIFY_EMAIL,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let data: TeamInviteData;
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

  const errors = validateTeamInvite(data);
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
    await createTeamInvite({
      [TEAM_FIELD.team]: clip(data.teamName, 120),
      [TEAM_FIELD.coachFirst]: clip(data.coachFirst, 80),
      [TEAM_FIELD.coachLast]: clip(data.coachLast, 80),
      [TEAM_FIELD.email]: clip(data.email, 120),
      [TEAM_FIELD.phone]: clip(data.phone, 40),
      [TEAM_FIELD.location]: clip(data.location, 120),
      [TEAM_FIELD.ageGroups]: clip(data.ageGroups, 120),
      [TEAM_FIELD.about]: clip(data.about, 1000) || undefined,
      [TEAM_FIELD.link]: clip(data.link, 300) || undefined,
      [TEAM_FIELD.events]: eventLabels,
      [TEAM_FIELD.status]: "New",
      [TEAM_FIELD.submittedAt]: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Team invite write failed", err);
    return NextResponse.json(
      { error: "Couldn't save your request. Please try again." },
      { status: 500 },
    );
  }

  // Best-effort emails after the write succeeds — never fail the response.
  await sendEmail({
    to: NOTIFY_EMAIL,
    subject: `New team invite request — ${data.teamName.trim()}`,
    html: emailLayout(
      "New Team Invite Request",
      detailRows([
        ["Team", data.teamName],
        ["Coach", `${data.coachFirst} ${data.coachLast}`],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Location", data.location],
        ["Age groups", data.ageGroups],
        ["Events", eventLabels],
        ["About", data.about],
        ["Link", data.link],
      ]),
    ),
    replyTo: data.email.trim(),
  });
  await sendEmail({
    to: data.email.trim(),
    subject: "Showcase Tournament — invite request received",
    html: emailLayout(
      "Invite Request Received",
      `<p>Hi ${escapeHtml(data.coachFirst.trim())},</p>
       <p>We&rsquo;ve got your Showcase Tournament invite request for <b>${escapeHtml(data.teamName.trim())}</b> (${escapeHtml(eventLabels)}).</p>
       <p>The tournament field is invite-only and curated &mdash; we review every program and we&rsquo;ll get back to you either way. If your team is selected, your invite and registration link come straight to this inbox.</p>
       <p>Questions in the meantime? Just reply to this email.</p>`,
    ),
  });

  return NextResponse.json({ ok: true });
}
