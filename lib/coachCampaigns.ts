// College-coach email campaigns (Dallas), sent via MailerSend from
// info@collegeflagshowcase.com — one email per coach (To: the coach).
// Each campaign = a template under /email-templates/ with a {{GREETING}}
// placeholder, a subject, and its own "… Sent At" field on Coach
// Registrations. Routes: /api/send-coach-hotel, /api/send-coach-whatsapp.
//
// Flow: open the route with ?key=INVITE_SEND_KEY. GET lists every Dallas
// coach registration that hasn't been sent this campaign yet (deduped by
// email, Declined skipped) and never sends. The SEND button POSTs back,
// which sends one email per coach and stamps the campaign's Sent At field
// on each of that coach's rows right after its send is accepted. Re-open
// the link later to catch up new registrants; clear the field to re-send.

import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/email";
import { CONTACT_EMAIL } from "@/data/links";

const API = "https://api.airtable.com/v0";
const COACH_TABLE = "tblCZuBfVMjkEo5c5";
const F = {
  program: "fld6cOxBJa4pxIYwt",
  first: "fldNjZFox9FVxi5cZ",
  last: "fldoe7n1csAhlHNo6",
  email: "fld4L5p35saiU7wPw",
  events: "fldsQJxM4a1XoPhTE", // multiline text, e.g. "Event 01 — Dallas, TX, …"
  status: "fldEKThYRZujXW7Ow", // New | Credentialed | Declined
} as const;

export interface CoachCampaign {
  /** e.g. "Coach Hotel Email" — used in page titles */
  label: string;
  templateUrl: string;
  subject: string;
  /** dateTime field on Coach Registrations stamped per send */
  sentAtField: string;
  /** Field name as shown in Airtable, for the manual-fix message */
  sentAtName: string;
}

export const CAMPAIGNS = {
  hotel: {
    label: "Coach Hotel Email",
    templateUrl:
      "https://www.collegeflagshowcase.com/email-templates/coach-hotel-dallas.html",
    subject: "College Coach Hotel for Dallas — Sheraton McKinney Group Rate",
    sentAtField: "fldz2iSD9yQ6rj2Ov",
    sentAtName: "Dallas Hotel Email Sent At",
  },
  whatsapp: {
    label: "WhatsApp Group Invite",
    templateUrl:
      "https://www.collegeflagshowcase.com/email-templates/coach-whatsapp-dallas.html",
    subject: "Join the College Coach WhatsApp Group — College Flag Showcase – Dallas",
    sentAtField: "fldVvLH8sECwjH4YN",
    sentAtName: "WhatsApp Invite Sent At",
  },
} satisfies Record<string, CoachCampaign>;

const FROM = { email: CONTACT_EMAIL, name: "College Flag Showcase Series" };

interface Coach {
  email: string;
  name: string;
  /** "Coach Hastings," — the email's greeting */
  greeting: string;
  program: string;
  recordIds: string[];
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

function authorized(req: Request): NextResponse | null {
  const sendKey = process.env.INVITE_SEND_KEY;
  if (!sendKey)
    return page("Not Configured", `<p>INVITE_SEND_KEY isn't set in Vercel.</p>`, 500);
  if (new URL(req.url).searchParams.get("key") !== sendKey)
    return page("Not Authorized", `<p>This link isn't valid.</p>`, 403);
  return null;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const selectName = (v: unknown) =>
  typeof v === "string" ? v : str((v as { name?: unknown })?.name);

/** Dallas coaches not yet sent, deduped by email (case-insensitive). */
async function pendingCoaches(sentAtField: string): Promise<Coach[]> {
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!key || !baseId) throw new Error("Airtable isn't configured in Vercel.");

  const rows: { id: string; fields: Record<string, unknown> }[] = [];
  let offset = "";
  do {
    const params = new URLSearchParams({ returnFieldsByFieldId: "true", pageSize: "100" });
    if (offset) params.set("offset", offset);
    const res = await fetch(`${API}/${baseId}/${COACH_TABLE}?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Airtable read failed: ${res.status}`);
    const body = (await res.json()) as { records: typeof rows; offset?: string };
    rows.push(...body.records);
    offset = body.offset ?? "";
  } while (offset);

  // Anyone already sent (on any of their rows) is done.
  const sent = new Set(
    rows
      .filter((r) => r.fields[sentAtField])
      .map((r) => str(r.fields[F.email]).toLowerCase()),
  );
  const byEmail = new Map<string, Coach>();
  for (const r of rows) {
    const email = str(r.fields[F.email]);
    const lc = email.toLowerCase();
    if (!email || sent.has(lc)) continue;
    if (!str(r.fields[F.events]).includes("Event 01")) continue;
    if (selectName(r.fields[F.status]) === "Declined") continue;
    const c = byEmail.get(lc);
    if (c) {
      c.recordIds.push(r.id);
      continue;
    }
    const last = str(r.fields[F.last]);
    byEmail.set(lc, {
      email,
      name: `${str(r.fields[F.first])} ${last}`.trim(),
      // "Brownfield IV" → "Coach Brownfield"
      greeting: last
        ? `Coach ${last.replace(/[\s,]+(jr\.?|sr\.?|ii|iii|iv|v)$/i, "")},`
        : "Dear College Coach,",
      program: str(r.fields[F.program]),
      recordIds: [r.id],
    });
  }
  return Array.from(byEmail.values()).sort((a, b) =>
    a.program.localeCompare(b.program),
  );
}

export function coachCampaignHandlers(c: CoachCampaign) {
  const TEMPLATE_URL = c.templateUrl;
  const SUBJECT = c.subject;
/** Confirmation page — never sends anything. */
async function GET(req: Request) {
  const denied = authorized(req);
  if (denied) return denied;
  try {
    const coaches = await pendingCoaches(c.sentAtField);
    if (coaches.length === 0)
      return page(
        "All Caught Up",
        `<p style="color:#C9C4C9;line-height:1.6;">Every Dallas college coach registration has already been sent this email.</p>`,
      );
    const url = new URL(req.url);
    return page(
      `Confirm ${c.label}`,
      `<p style="color:#C9C4C9;line-height:1.6;">Ready to send <b style="color:#F7F5F6;">${escapeHtml(SUBJECT)}</b> from <b style="color:#F7F5F6;">${escapeHtml(FROM.email)}</b> to <b style="color:#F7F5F6;">${coaches.length} college coach${coaches.length === 1 ? "" : "es"}</b> — one email each, so no coach sees another's address.</p>
       <ul style="color:#F7F5F6;line-height:1.7;padding-left:18px;">${coaches
         .map(
           (co) =>
             `<li>${escapeHtml(co.name || co.email)} <span style="color:#8A848C;">— ${escapeHtml(co.program)} · ${escapeHtml(co.email)} · greeting “${escapeHtml(co.greeting)}”</span></li>`,
         )
         .join("")}</ul>
       <p style="color:#C9C4C9;"><a href="${TEMPLATE_URL}" style="color:#FF2D8E;">Preview the email</a> ({{GREETING}} becomes each coach's greeting) · a copy goes to ${escapeHtml(CONTACT_EMAIL)}.</p>
       <form method="post" action="${escapeHtml(url.pathname + url.search)}">
         <button type="submit" style="background:#FF2D8E;color:#fff;border:0;padding:14px 34px;font-size:16px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">Send to ${coaches.length} Coach${coaches.length === 1 ? "" : "es"}</button>
       </form>`,
    );
  } catch (err) {
    return page("Can't Send Yet", `<p style="color:#C9C4C9;">${escapeHtml((err as Error).message)}</p>`, 400);
  }
}

/** Executes the send — one MailerSend email per coach. */
async function POST(req: Request) {
  const denied = authorized(req);
  if (denied) return denied;
  const mailKey = process.env.MAILERSEND_API_TOKEN;
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!mailKey)
    return page("Not Configured", `<p>MAILERSEND_API_TOKEN isn't set in Vercel.</p>`, 500);

  try {
    const coaches = await pendingCoaches(c.sentAtField);
    if (coaches.length === 0)
      return page("All Caught Up", `<p style="color:#C9C4C9;">Nothing left to send.</p>`);
    const tpl = await fetch(TEMPLATE_URL, { cache: "no-store" });
    if (!tpl.ok) throw new Error(`Template fetch failed: ${tpl.status}`);
    const html = await tpl.text();
    if (!html.includes("{{GREETING}}"))
      throw new Error("Template is missing its {{GREETING}} placeholder.");

    const sentTo: Coach[] = [];
    const failed: { coach: Coach; why: string }[] = [];
    for (let i = 0; i < coaches.length; i++) {
      const co = coaches[i];
      const res = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: { Authorization: `Bearer ${mailKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [{ email: co.email, ...(co.name ? { name: co.name } : {}) }],
          reply_to: FROM,
          // One delivery-trail copy to the inbox, not one per coach.
          ...(i === 0 ? { bcc: [{ email: CONTACT_EMAIL }] } : {}),
          subject: SUBJECT,
          html: html.split("{{GREETING}}").join(escapeHtml(co.greeting)),
        }),
      });
      if (!res.ok) {
        failed.push({ coach: co, why: `${res.status} ${(await res.text()).slice(0, 160)}` });
        continue;
      }
      // Stamp right away so a later failure never causes a double-send.
      const stamp = await fetch(`${API}/${baseId}/${COACH_TABLE}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          records: co.recordIds.map((id) => ({
            id,
            fields: { [c.sentAtField]: new Date().toISOString() },
          })),
        }),
      });
      if (!stamp.ok)
        failed.push({
          coach: co,
          why: `SENT, but stamping Airtable failed (${stamp.status}) — fill in "${c.sentAtName}" by hand so it can't send twice.`,
        });
      else sentTo.push(co);
    }

    const list = (cs: Coach[]) =>
      cs.map((co) => `<li>${escapeHtml(co.name || co.email)} <span style="color:#8A848C;">— ${escapeHtml(co.program)}</span></li>`).join("");
    return page(
      failed.length ? "Sent — With Issues" : `${c.label} Sent`,
      `<p style="color:#C9C4C9;line-height:1.6;">Sent to <b style="color:#F7F5F6;">${sentTo.length}</b> of ${coaches.length} coaches from ${escapeHtml(FROM.email)}; each is stamped in Airtable.</p>
       <ul style="color:#F7F5F6;line-height:1.7;padding-left:18px;">${list(sentTo)}</ul>
       ${
         failed.length
           ? `<p style="color:#FF2D8E;font-weight:bold;">Not sent:</p><ul style="color:#F7F5F6;line-height:1.7;padding-left:18px;">${failed
               .map((f) => `<li>${escapeHtml(f.coach.name || f.coach.email)} <span style="color:#8A848C;">— ${escapeHtml(f.why)}</span></li>`)
               .join("")}</ul><p style="color:#C9C4C9;">Open the link again to retry only the remaining coaches.</p>`
           : ""
       }`,
    );
  } catch (err) {
    return page("Send Failed", `<p style="color:#C9C4C9;">${escapeHtml((err as Error).message)}</p>`, 400);
  }
}

  return { GET, POST };
}
