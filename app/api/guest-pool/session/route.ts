import { NextResponse } from "next/server";
import {
  coachAccess,
  SESSION_COOKIE,
  SESSION_TTL_MS,
  sessionToken,
  verifyToken,
} from "@/lib/guestPool";

export const runtime = "nodejs";

/** Sign-in link target: trade a valid link token for a session cookie. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = verifyToken(url.searchParams.get("t") ?? undefined);
  const access = email ? await coachAccess(email).catch(() => null) : null;
  const session = access ? sessionToken(access.email) : null;
  if (!session) {
    return NextResponse.redirect(new URL("/guest-pool?expired=1", url.origin));
  }
  const res = NextResponse.redirect(new URL("/guest-pool", url.origin));
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
  return res;
}
