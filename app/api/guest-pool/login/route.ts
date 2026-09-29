import { NextResponse } from "next/server";
import { coachAccess, linkToken } from "@/lib/guestPool";
import {
  emailLayout,
  escapeHtml,
  NOTIFY_EMAIL,
  sendEmail,
} from "@/lib/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Always answers the same way so the form can't be used to probe which
// emails have access. Only qualifying coaches actually get a link.
export async function POST(req: Request) {
  let email = "";
  try {
    email = String((await req.json()).email ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const access = await coachAccess(email).catch((err) => {
    console.error("Guest pool access lookup failed", err);
    return null;
  });
  const token = access ? linkToken(access.email) : null;

  if (access && token) {
    const origin = new URL(req.url).origin;
    const link = `${origin}/api/guest-pool/session?t=${encodeURIComponent(token)}`;
    await sendEmail({
      to: access.email,
      subject: "Your guest player pool sign-in link",
      html: emailLayout(
        "Guest Player Pool",
        `<p>Use the button below to open the guest player pool for ${escapeHtml(access.orgs.join(", "))}. The link works for 24 hours; after you sign in, this device stays signed in for 30 days.</p>
         <p style="margin:22px 0;"><a href="${link}" style="display:inline-block;background:#FF2D8E;color:#FFFFFF;padding:14px 28px;font-weight:bold;text-decoration:none;text-transform:uppercase;letter-spacing:1px;">Open the Guest Player Pool</a></p>
         <p style="font-size:13px;color:#5C5A5E;">Didn&rsquo;t ask for this? You can ignore this email.</p>`,
      ),
    });
    await sendEmail({
      to: NOTIFY_EMAIL,
      subject: `Guest pool sign-in — ${access.email}`,
      html: emailLayout(
        "Guest Pool Sign-In",
        `<p><b>${escapeHtml(access.email)}</b> (${escapeHtml(access.orgs.join(", "))}) requested a guest player pool sign-in link.</p>`,
      ),
    });
  }

  return NextResponse.json({ ok: true });
}
