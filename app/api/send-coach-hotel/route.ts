// Dallas college-coach hotel + weekend email, sent via MailerSend from
// info@collegeflagshowcase.com — one email per coach (To: the coach).
//
// Flow: open /api/send-coach-hotel?key=INVITE_SEND_KEY. GET lists every
// Dallas coach registration that hasn't been sent yet (deduped by email,
// Declined skipped) and never sends. The SEND button POSTs back here,
// which sends one email per coach and stamps "Dallas Hotel Email Sent At"
// on each of that coach's registration rows right after its send is
// accepted. Re-opening the link later only lists coaches not yet sent —
// so new registrants can be caught up the same way, and a partial failure
// retries just the remainder. Clear the field on a row to re-send to it.

import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/email";
import { CONTACT_EMAIL } from "@/data/links";

export const runtime = "nodejs";
export const maxDuration = 60;

const API = "https://api.airtable.com/v0";
const COACH_TABLE = "tblCZuBfVMjkEo5c5";
const F = {
  program: "fld6cOxBJa4pxIYwt",
  first: "fldNjZFox9FVxi5cZ",
  last: "fldoe7n1csAhlHNo6",
  email: "fld4L5p35saiU7wPw",
  events: "fldsQJxM4a1XoPhTE", // multiline text, e.g. "Event 01 — Dallas, TX, …"
  status: "fldEKThYRZujXW7Ow", // New | Credentialed | Declined
  sentAt: "fldz2iSD9yQ6rj2Ov", // Dallas Hotel Email Sent At
} as const;

const TEMPLATE_URL =
  "https://www.collegeflagshowcase.com/email-templates/coach-hotel-dallas.html";
const SUBJECT = "College Coach Hotel for Dallas — Sheraton McKinney Group Rate";
const FROM = { email: CONTACT_EMAIL, name: "College Flag Showcase Series" };

interface Coach {
  email: string;
  name: string;
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
async function pendingCoaches(): Promise<Coach[]> {
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
      .filter((r) => r.fields[F.sentAt])
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
    byEmail.set(lc, {
      email,
      name: `${str(r.fields[F.first])} ${str(r.fields[F.last])}`.trim(),
      program: str(r.fields[F.program]),
      recordIds: [r.id],
    });
  }
  return Array.from(byEmail.values()).sort((a, b) =>
    a.program.localeCompare(b.program),
  );
}

/** Confirmation page — never sends anything. */
export async function GET(req: Request) {
  const denied = authorized(req);
  if (denied) return denied;
  try {
    const coaches = await pendingCoaches();
    if (coaches.length === 0)
      return page(
        "All Caught Up",
        `<p style="color:#C9C4C9;line-height:1.6;">Every Dallas college coach registration has already been sent the hotel email.</p>`,
      );
    const url = new URL(req.url);
    return page(
      "Confirm Coach Hotel Email",
      `<p style="color:#C9C4C9;line-height:1.6;">Ready to send <b style="color:#F7F5F6;">${escapeHtml(SUBJECT)}</b> from <b style="color:#F7F5F6;">${escapeHtml(FROM.email)}</b> to <b style="color:#F7F5F6;">${coaches.length} college coach${coaches.length === 1 ? "" : "es"}</b> — one email each, so no coach sees another's address.</p>
       <ul style="color:#F7F5F6;line-height:1.7;padding-left:18px;">${coaches
         .map(
           (c) =>
             `<li>${escapeHtml(c.name || c.email)} <span style="color:#8A848C;">— ${escapeHtml(c.program)} · ${escapeHtml(c.email)}</span></li>`,
         )
         .join("")}</ul>
       <p style="color:#C9C4C9;"><a href="${TEMPLATE_URL}" style="color:#FF2D8E;">Preview the email</a> · a copy goes to ${escapeHtml(CONTACT_EMAIL)}.</p>
       <form method="post" action="${escapeHtml(url.pathname + url.search)}">
         <button type="submit" style="background:#FF2D8E;color:#fff;border:0;padding:14px 34px;font-size:16px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">Send to ${coaches.length} Coach${coaches.length === 1 ? "" : "es"}</button>
       </form>`,
    );
  } catch (err) {
    return page("Can't Send Yet", `<p style="color:#C9C4C9;">${escapeHtml((err as Error).message)}</p>`, 400);
  }
}

/** Executes the send — one MailerSend email per coach. */
export async function POST(req: Request) {
  const denied = authorized(req);
  if (denied) return denied;
  const mailKey = process.env.MAILERSEND_API_TOKEN;
  const key = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!mailKey)
    return page("Not Configured", `<p>MAILERSEND_API_TOKEN isn't set in Vercel.</p>`, 500);

  try {
    const coaches = await pendingCoaches();
    if (coaches.length === 0)
      return page("All Caught Up", `<p style="color:#C9C4C9;">Nothing left to send.</p>`);
    const tpl = await fetch(TEMPLATE_URL, { cache: "no-store" });
    if (!tpl.ok) throw new Error(`Template fetch failed: ${tpl.status}`);
    const html = await tpl.text();

    const sentTo: Coach[] = [];
    const failed: { coach: Coach; why: string }[] = [];
    for (let i = 0; i < coaches.length; i++) {
      const c = coaches[i];
      const res = await fetch("https://api.mailersend.com/v1/email", {
        method: "POST",
        headers: { Authorization: `Bearer ${mailKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: FROM,
          to: [{ email: c.email, ...(c.name ? { name: c.name } : {}) }],
          reply_to: FROM,
          // One delivery-trail copy to the inbox, not one per coach.
          ...(i === 0 ? { bcc: [{ email: CONTACT_EMAIL }] } : {}),
          subject: SUBJECT,
          html,
        }),
      });
      if (!res.ok) {
        failed.push({ coach: c, why: `${res.status} ${(await res.text()).slice(0, 160)}` });
        continue;
      }
      // Stamp right away so a later failure never causes a double-send.
      const stamp = await fetch(`${API}/${baseId}/${COACH_TABLE}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          records: c.recordIds.map((id) => ({
            id,
            fields: { [F.sentAt]: new Date().toISOString() },
          })),
        }),
      });
      if (!stamp.ok)
        failed.push({
          coach: c,
          why: `SENT, but stamping Airtable failed (${stamp.status}) — fill in "Dallas Hotel Email Sent At" by hand so it can't send twice.`,
        });
      else sentTo.push(c);
    }

    const list = (cs: Coach[]) =>
      cs.map((c) => `<li>${escapeHtml(c.name || c.email)} <span style="color:#8A848C;">— ${escapeHtml(c.program)}</span></li>`).join("");
    return page(
      failed.length ? "Sent — With Issues" : "Coach Hotel Email Sent",
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
