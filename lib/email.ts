// Transactional email via MailerSend. Every send is best-effort: if the
// API token is missing or the request fails, we log and move on — a lost
// email must never fail a form submission or a Stripe webhook.

import { CONTACT_EMAIL } from "@/data/links";

const FROM_EMAIL = process.env.EMAIL_FROM ?? "no-reply@collegeflagshowcase.com";
const FROM_NAME = "College Flag Showcase Series";

/** Internal notifications go to the shared inbox... */
export const NOTIFY_EMAIL = CONTACT_EMAIL;
/** ...with the wider founding team cc'd. */
export const NOTIFY_CC = ["monty.holloway@5v5sports.com"];
/** Submitter-facing sends are bcc'd here as a delivery trail. */
export const TRAIL_BCC = [CONTACT_EMAIL];

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
}

/** Sends one email; resolves (never rejects) regardless of outcome. */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
  cc,
  bcc,
}: SendArgs): Promise<void> {
  const token = process.env.MAILERSEND_API_TOKEN;
  if (!token) return; // email not configured yet — forms still work

  try {
    const res = await fetch("https://api.mailersend.com/v1/email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email: to }],
        ...(cc && cc.length > 0
          ? { cc: cc.map((email) => ({ email })) }
          : {}),
        ...(bcc && bcc.length > 0
          ? { bcc: bcc.map((email) => ({ email })) }
          : {}),
        subject,
        html,
        reply_to: { email: replyTo ?? CONTACT_EMAIL },
      }),
    });
    if (!res.ok) {
      console.error("MailerSend send failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("MailerSend request error", err);
  }
}

/** Branded shell for every email: dark header, pink rule, chalk body. */
export function emailLayout(heading: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F7F5F6;font-family:Arial,Helvetica,sans-serif;color:#0A0A0B;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#0A0A0B;padding:22px 26px;border-bottom:4px solid #FF2D8E;">
      <div style="font-size:11px;font-weight:bold;letter-spacing:2px;color:#FF2D8E;text-transform:uppercase;">College Flag Showcase Series</div>
      <div style="font-size:24px;font-weight:bold;color:#F7F5F6;text-transform:uppercase;margin-top:6px;">${heading}</div>
    </div>
    <div style="background:#FFFFFF;padding:24px 26px;border:1px solid #E6E2E5;border-top:0;font-size:15px;line-height:1.6;">
      ${bodyHtml}
    </div>
    <div style="padding:16px 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#5C5A5E;text-align:center;">
      collegeflagshowcase.com &nbsp;·&nbsp; ${CONTACT_EMAIL}
    </div>
  </div>
</body>
</html>`;
}

/** Mono-label detail rows for internal notification emails. */
export function detailRows(rows: Array<[string, string | undefined]>): string {
  const cells = rows
    .filter(([, value]) => value && value.trim())
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:6px 14px 6px 0;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#5C5A5E;white-space:nowrap;vertical-align:top;">${label}</td>
          <td style="padding:6px 0;font-size:14px;color:#0A0A0B;">${escapeHtml(value as string)}</td>
        </tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;">${cells}</table>`;
}

export function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
