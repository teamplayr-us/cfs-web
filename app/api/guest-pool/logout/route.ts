import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/guestPool";

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL("/guest-pool", req.url));
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
