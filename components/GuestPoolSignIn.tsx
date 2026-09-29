"use client";

import { useState } from "react";

export default function GuestPoolSignIn({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    try {
      const res = await fetch("/api/guest-pool/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("sent");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setState("idle");
    }
  }

  if (state === "sent") {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">Check your email</p>
        <p className="reg-fineprint">
          If <b>{email}</b> is the contact email on a registered Showcase
          Tournament team, a sign-in link is on its way. It works for 24 hours.
          No email after a few minutes? Check spam, or write to
          info@collegeflagshowcase.com.
        </p>
      </div>
    );
  }

  return (
    <form className="reg-card reg-fields" onSubmit={submit}>
      {expired && (
        <p className="reg-notice">
          That sign-in link has expired or isn&apos;t valid. Request a new one
          below.
        </p>
      )}
      <label>
        Your coach email
        {error && <span className="reg-err">{error}</span>}
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <p className="reg-fineprint">
        Use the email your team registered with. We&apos;ll send a sign-in link.
      </p>
      <button className="btn btn-red" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "One moment…" : "Email Me a Sign-In Link"}
      </button>
    </form>
  );
}
