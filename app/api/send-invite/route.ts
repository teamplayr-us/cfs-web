// Org-level invitation sender, triggered from Airtable.
//
// Flow: on an Opportunities record, check "Send Invitation" (with an
// Invite Flyer attached) and tap the "Send Invitation Link" formula field.
// GET renders a confirmation page (recipient, teams, flyer); the SEND
// button POSTs back here, which emails the branded invitation via
// MailerSend with the flyer attached, then stamps every included Team
// Invitation (Status = Invited, Invitation Sent At) and clears the
// checkbox + stamps Invitations Sent At on the Opportunity.
//
// Guards (both verbs re-check all of them): valid INVITE_SEND_KEY, the
// checkbox is on, Invitations Sent At is empty, a flyer is attached, the
// Event has a Registration URL, a contact email resolves, and at least
// one Approved, unsent Team Invitation is linked. Any failure sends
// nothing and reports why.

import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/email";

export const runtime = "nodejs";

const API = "https://api.airtable.com/v0";

// Field IDs (rename-proof). Base app0mk0cTZLDeVahe.
const OPPS_TABLE = "tblkq5JvMFHkYbWyO";
const OPP = {
  orgName: "fldp6pmD5p5xPXXBc",
  emailOverride: "fldLuRLN0Abz9dwEl",
  emailSynced: "fldiYNhnIE0hG6PEB", // lookup → array
  primaryContact: "fldhvydUk23EMiuqZ",
  event: "fldkbOR7PhxjgPIdb", // link
  teamInvitations: "fldd5AVlxHaw4Ef7P", // link
  sendInvitation: "fld4VFtFcvT5MlafM", // checkbox
  inviteFlyer: "fldCOprLx7LGtVl1F", // attachments
  invitationsSentAt: "fldoBVdxmUjPyN4hN",
  inviteCc: "fldEqwOUtHaKJkrNm", // comma-separated CC addresses
} as const;

const INVITES_TABLE = "tblnlaU4slRvXi7eH";
const INV = {
  label: "fld6KYmxLsjg7K2NL",
  fffTeam: "fldgaiubxCRaeNhpa", // link
  status: "fldHIZ6IeWwEpHvSJ", // single select
  division: "fldez45PmMByMjo5D", // single select
  sentAt: "fldindQa5G5p6y8hY",
  track: "fldicz1cnd9QkXKln", // single select: Showcase (default) | ISI Only
} as const;

const EVENTS_TABLE = "tblT1j5boFCv6xMaj";
const EVT = {
  name: "fldqIrPZMQzo0VwKQ",
  registrationUrl: "fldwUbPox76kPcTVR",
} as const;

const TEMPLATE_URL =
  "https://www.collegeflagshowcase.com/email-templates/team-invite.html";
// Mixed orgs (any Team Invitation with Track = ISI Only) lead with the
// International Superflag Invitational and send from 5v5 Sports.
const MIXED_TEMPLATE_URL =
  "https://www.collegeflagshowcase.com/email-templates/team-invite-mixed.html";
const FAQ_URL = "https://www.collegeflagshowcase.com/invites/team-faq.pdf";
const ISI_FAQ_URL =
  "https://www.collegeflagshowcase.com/invites/isi-team-faq.pdf";
// Invitations are personal mail, not notifications: send FROM the real
// inbox (the body says "just reply"), never the site's no-reply default.
const FROM_EMAIL = "info@collegeflagshowcase.com";
const FROM_NAME = "College Flag Showcase Series";
// 5v5sports.com must be a verified sending domain in MailerSend before
// mixed sends will be accepted.
const ISI_FROM_EMAIL = "allen@5v5sports.com";
const ISI_FROM_NAME = "5v5 Sports";

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

function cfg() {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const sendKey = process.env.INVITE_SEND_KEY;
  const mailKey = process.env.MAILERSEND_API_TOKEN;
  return { key, baseId, sendKey, mailKey };
}

async function getRecord(
  baseId: string,
  apiKey: string,
  table: string,
  id: string,
): Promise<AirtableRecord | null> {
  const res = await fetch(
    `${API}/${baseId}/${table}/${id}?returnFieldsByFieldId=true`,
    { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Airtable read failed: ${res.status}`);
  return res.json();
}

// REST returns linked-record fields as arrays of "rec..." strings; some
// surfaces return {id} objects. Accept both.
const linkIds = (v: unknown): string[] =>
  Array.isArray(v)
    ? v
        .map((r) =>
          typeof r === "string" ? r : (r as { id?: string })?.id ?? "",
        )
        .filter((id) => id.startsWith("rec"))
    : [];
// REST returns single-select values as plain strings; some surfaces return
// {name} objects. Accept both.
const selectName = (v: unknown): string | undefined =>
  typeof v === "string"
    ? v
    : v && typeof v === "object"
      ? (v as { name?: string }).name
      : undefined;

/** Everything the send needs, gathered and fully guarded. */
async function loadSend(oppId: string) {
  const { key, baseId } = cfg();
  if (!key || !baseId) throw new Error("Airtable is not configured.");

  const opp = await getRecord(baseId, key, OPPS_TABLE, oppId);
  if (!opp) throw new Error("Opportunity not found.");
  const f = opp.fields;

  if (f[OPP.invitationsSentAt])
    throw new Error(
      "This organization's invitation was already sent. Clear Invitations Sent At to deliberately re-send.",
    );
  if (!f[OPP.sendInvitation])
    throw new Error("Send Invitation isn't checked on this Opportunity.");

  const flyers =
    (f[OPP.inviteFlyer] as { url: string; filename?: string }[] | undefined) ??
    [];
  if (flyers.length === 0)
    throw new Error("No Invite Flyer attached to the Opportunity.");

  let toEmail = f[OPP.emailOverride] as string | undefined;
  if (!toEmail) {
    const synced = f[OPP.emailSynced];
    const first = Array.isArray(synced) ? synced[0] : undefined;
    toEmail =
      first && typeof first === "object"
        ? (first as { value?: string }).value
        : (first as string | undefined);
  }
  if (!toEmail)
    throw new Error(
      "No contact email — set Email Override or link the FFF organization.",
    );

  const orgName = f[OPP.orgName] as string | undefined;
  if (!orgName) throw new Error("Organization Name is empty.");

  const eventId = linkIds(f[OPP.event])[0];
  if (!eventId) throw new Error("No Event linked on the Opportunity.");
  const event = await getRecord(baseId, key, EVENTS_TABLE, eventId);
  const regLink = event?.fields[EVT.registrationUrl] as string | undefined;
  if (!regLink)
    throw new Error("Registration URL is empty on the Event record.");
  const eventName = event?.fields[EVT.name] as string | undefined;

  const inviteIds = linkIds(f[OPP.teamInvitations]);
  const inviteRecords = (
    await Promise.all(
      inviteIds.map((id) => getRecord(baseId, key, INVITES_TABLE, id)),
    )
  ).filter((r): r is AirtableRecord => r !== null);
  const batch = inviteRecords.filter(
    (r) =>
      selectName(r.fields[INV.status]) === "Approved" && !r.fields[INV.sentAt],
  );
  if (batch.length === 0)
    throw new Error(
      "No unsent Approved Team Invitations are linked to this Opportunity.",
    );

  // Team display names: resolve the linked FFF team record's name when one
  // is linked (REST link fields carry only IDs); fall back to the row label.
  const FFF_TEAMS_TABLE = "tblR4d2NJkUTK5IX4";
  const FFF_NAME = "fld35n5q9cOhgvzFD";
  const lines = await Promise.all(
    batch.map(async (r) => {
      // Labels follow the "Team — Event 01 — …" CRM convention; only the
      // team half belongs in the email.
      let team = ((r.fields[INV.label] as string) || "").replace(
        /\s+—\s+Event.*$/,
        "",
      );
      const fffId = linkIds(r.fields[INV.fffTeam])[0];
      if (fffId) {
        const fff = await getRecord(baseId, key, FFF_TEAMS_TABLE, fffId);
        const fffName = fff?.fields[FFF_NAME] as string | undefined;
        if (fffName) team = fffName;
      }
      const div = selectName(r.fields[INV.division]);
      const name = div && !team.includes(div) ? `${team} ${div}` : team;
      // Empty Track means Showcase (the field predates ISI-only rows).
      const isiOnly = selectName(r.fields[INV.track]) === "ISI Only";
      return { name, isiOnly };
    }),
  );
  // CRM rows arrive in creation order; list girls then boys, youngest first.
  const ageOf = (n: string) => Number(n.match(/(\d+)U\b/)?.[1] ?? 99);
  const isBoys = (n: string) => (/\bboys\b/i.test(n) ? 1 : 0);
  lines.sort(
    (a, b) => isBoys(a.name) - isBoys(b.name) || ageOf(a.name) - ageOf(b.name),
  );
  const teamLines = lines.map((l) => l.name);
  const cfsTeamLines = lines.filter((l) => !l.isiOnly).map((l) => l.name);
  // Any ISI-only team makes this a mixed send: ISI-led template, sent
  // from 5v5 Sports, with both FAQs attached.
  const mixed = cfsTeamLines.length < lines.length;

  const ccEmails = ((f[OPP.inviteCc] as string | undefined) ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

  return {
    opp,
    orgName,
    toEmail,
    ccEmails,
    primaryContact: f[OPP.primaryContact] as string | undefined,
    flyers,
    regLink,
    eventName,
    batch,
    teamLines,
    cfsTeamLines,
    mixed,
  };
}

function page(title: string, bodyHtml: string, status = 200) {
  return new NextResponse(
    `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#0A0A0B;font-family:Arial,Helvetica,sans-serif;color:#F7F5F6;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#FF2D8E;text-transform:uppercase;">College Flag Showcase Series</div>
    <h1 style="font-size:26px;text-transform:uppercase;margin:10px 0 22px;">${escapeHtml(title)}</h1>
    ${bodyHtml}
  </div>
</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

function checkKey(req: Request): { oppId: string } | NextResponse {
  const { sendKey } = cfg();
  const url = new URL(req.url);
  const oppId = url.searchParams.get("opp") ?? "";
  const key = url.searchParams.get("key") ?? "";
  if (!sendKey)
    return page("Not Configured", `<p>INVITE_SEND_KEY isn't set in Vercel.</p>`, 500);
  if (key !== sendKey || !/^rec[A-Za-z0-9]{14}$/.test(oppId))
    return page("Not Authorized", `<p>This link isn't valid.</p>`, 403);
  return { oppId };
}

/** Confirmation page — never sends anything. */
export async function GET(req: Request) {
  const checked = checkKey(req);
  if (checked instanceof NextResponse) return checked;
  try {
    const s = await loadSend(checked.oppId);
    const url = new URL(req.url);
    return page(
      "Confirm Invitation",
      `<p style="color:#C9C4C9;line-height:1.6;">Ready to send the official invitation for <b style="color:#F7F5F6;">${escapeHtml(s.orgName)}</b> to <b style="color:#F7F5F6;">${escapeHtml(s.toEmail)}</b>${s.eventName ? ` — ${escapeHtml(s.eventName)}` : ""}.</p>
       ${s.mixed ? `<p style="color:#C9C4C9;">Mixed invitation — International Superflag Invitational leads, sent from <b style="color:#F7F5F6;">${escapeHtml(ISI_FROM_EMAIL)}</b>. Showcase teams: ${escapeHtml(s.cfsTeamLines.join(", ") || "none")}.</p>` : ""}
       <ul style="color:#F7F5F6;line-height:1.8;">${s.teamLines.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
       ${s.ccEmails.length > 0 ? `<p style="color:#C9C4C9;">CC: ${escapeHtml(s.ccEmails.join(", "))}</p>` : ""}
       <p style="color:#C9C4C9;">Attached: ${escapeHtml(s.flyers.map((fl) => fl.filename ?? "invitation.png").join(", "))}${s.mixed ? " + both FAQs" : " + FAQ"}</p>
       <form method="post" action="${escapeHtml(url.pathname + url.search)}">
         <button type="submit" style="background:#FF2D8E;color:#fff;border:0;padding:14px 34px;font-size:16px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">Send Invitation</button>
       </form>`,
    );
  } catch (err) {
    return page("Can't Send Yet", `<p style="color:#C9C4C9;">${escapeHtml((err as Error).message)}</p>`, 400);
  }
}

/** Executes the send. */
export async function POST(req: Request) {
  const checked = checkKey(req);
  if (checked instanceof NextResponse) return checked;
  const { key, baseId, mailKey } = cfg();
  if (!mailKey)
    return page("Not Configured", `<p>MAILERSEND_API_TOKEN isn't set in Vercel.</p>`, 500);

  try {
    const s = await loadSend(checked.oppId);

    const tplRes = await fetch(s.mixed ? MIXED_TEMPLATE_URL : TEMPLATE_URL, {
      cache: "no-store",
    });
    if (!tplRes.ok) throw new Error(`Template fetch failed: ${tplRes.status}`);
    const row = (t: string) =>
      `<tr><td style="padding:7px 0;border-bottom:1px solid #E6E2E5;font-size:15px;color:#0A0A0B;font-weight:bold;">${escapeHtml(t)}</td></tr>`;
    const html = (await tplRes.text())
      .split("{{ORG_NAME}}").join(escapeHtml(s.orgName))
      .split("{{TEAM_ROWS}}").join(s.teamLines.map(row).join(""))
      .split("{{CFS_TEAM_ROWS}}").join(s.cfsTeamLines.map(row).join(""))
      .split("{{REG_LINK}}").join(s.regLink)
      .split("{{SIGNATURE}}").join("Allen Hamilton");

    const attachments: { content: string; filename: string; disposition: string }[] = [];
    for (const flyer of s.flyers) {
      const flyerRes = await fetch(flyer.url);
      if (!flyerRes.ok)
        throw new Error(`Flyer download failed: ${flyerRes.status}`);
      attachments.push({
        content: Buffer.from(await flyerRes.arrayBuffer()).toString("base64"),
        filename: flyer.filename ?? "official-invitation.png",
        disposition: "attachment",
      });
    }

    const faqUrls = s.mixed ? [FAQ_URL, ISI_FAQ_URL] : [FAQ_URL];
    for (const faqUrl of faqUrls) {
      const faqRes = await fetch(faqUrl, { cache: "no-store" });
      if (!faqRes.ok) throw new Error(`FAQ download failed: ${faqRes.status}`);
      attachments.push({
        content: Buffer.from(await faqRes.arrayBuffer()).toString("base64"),
        filename: faqUrl.includes("isi-")
          ? "isi-team-invitation-faq.pdf"
          : "team-invitation-faq.pdf",
        disposition: "attachment",
      });
    }

    const fromEmail = s.mixed ? ISI_FROM_EMAIL : FROM_EMAIL;
    const fromName = s.mixed ? ISI_FROM_NAME : FROM_NAME;

    const send = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mailKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: fromEmail, name: fromName },
        to: [{ email: s.toEmail, name: s.primaryContact || s.orgName }],
        ...(s.ccEmails.length > 0
          ? { cc: s.ccEmails.map((email) => ({ email })) }
          : {}),
        reply_to: { email: fromEmail, name: fromName },
        bcc: [{ email: fromEmail }],
        subject: s.mixed
          ? `Official Invitation — International Superflag Invitational & College Flag Showcase — Dallas, TX`
          : `Official Invitation — College Flag Showcase${s.eventName ? `, ${s.eventName}` : ""}`,
        html,
        attachments,
      }),
    });
    if (!send.ok)
      throw new Error(
        `MailerSend rejected the send (${send.status}): ${await send.text()}`,
      );

    // Stamp everything only after MailerSend accepts, so a failed send can
    // simply be retried from the same link.
    const now = new Date().toISOString();
    const patch = async (table: string, records: unknown[]) => {
      for (let i = 0; i < records.length; i += 10) {
        const res = await fetch(`${API}/${baseId}/${table}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records: records.slice(i, i + 10),
            typecast: true,
          }),
        });
        if (!res.ok)
          throw new Error(
            `Sent, but stamping records failed (${res.status}) — mark ${table} sent manually so it can't double-send.`,
          );
      }
    };
    await patch(
      INVITES_TABLE,
      s.batch.map((r) => ({
        id: r.id,
        fields: { [INV.status]: "Invited", [INV.sentAt]: now },
      })),
    );
    await patch(OPPS_TABLE, [
      {
        id: s.opp.id,
        fields: {
          [OPP.sendInvitation]: false,
          [OPP.invitationsSentAt]: now,
        },
      },
    ]);

    return page(
      "Invitation Sent",
      `<p style="color:#C9C4C9;line-height:1.6;">Sent to <b style="color:#F7F5F6;">${escapeHtml(s.toEmail)}</b> for <b style="color:#F7F5F6;">${escapeHtml(s.orgName)}</b> from <b style="color:#F7F5F6;">${escapeHtml(fromEmail)}</b> — ${s.batch.length} team${s.batch.length === 1 ? "" : "s"}, ${attachments.length} attachment${attachments.length === 1 ? "" : "s"}. The teams are stamped Invited in Airtable.</p>
       <p style="color:#8A848C;">A copy was BCC'd to ${escapeHtml(fromEmail)}.</p>`,
    );
  } catch (err) {
    return page("Send Failed", `<p style="color:#C9C4C9;">${escapeHtml((err as Error).message)}</p>`, 400);
  }
}
