"use client";

import { useState } from "react";
import { RSVP_EVENTS, RsvpAnswers } from "@/lib/coachRsvp";

interface Props {
  token: string;
  firstName: string;
  initial: RsvpAnswers;
  responded: boolean;
}

export default function CoachRsvpForm({
  token,
  firstName,
  initial,
  responded,
}: Props) {
  const [answers, setAnswers] = useState<RsvpAnswers>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const set = (key: keyof RsvpAnswers, value: boolean) =>
    setAnswers((a) => ({ ...a, [key]: value }));

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/coach-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, answers }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  if (done) {
    const going = RSVP_EVENTS.filter((e) => answers[e.key]);
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">Thanks, Coach {firstName}</p>
        {going.length > 0 ? (
          <ul className="reg-next">
            {going.map((e) => (
              <li key={e.key}>
                <b>{e.label}</b> — {e.when}
              </li>
            ))}
          </ul>
        ) : (
          <p>We&apos;ve noted that you can&apos;t make it this time.</p>
        )}
        <p className="reg-fineprint">
          Plans change? Use this same link anytime to update your RSVP.
          Questions? Email{" "}
          <a href="mailto:info@collegeflagshowcase.com">
            info@collegeflagshowcase.com
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="reg-card">
      <p className="reg-step-kicker">
        {responded ? "Update your RSVP" : "Which events will you attend?"}
      </p>
      <fieldset className="reg-fields">
        <legend className="reg-legend">Events</legend>
        {RSVP_EVENTS.map((e) => (
          <label key={e.key} className="rsvp-row">
            <input
              type="checkbox"
              checked={answers[e.key]}
              onChange={(ev) => set(e.key, ev.target.checked)}
            />
            <span>
              <b>{e.label}</b>
              <small>
                {e.when} · {e.where}
              </small>
            </span>
          </label>
        ))}
        <label className="rsvp-row rsvp-row-alt">
          <input
            type="checkbox"
            checked={answers.tent}
            onChange={(ev) => set("tent", ev.target.checked)}
          />
          <span>
            <b>I&apos;d like a College Row tent space</b>
            <small>Free space for your program in the Fan Zone</small>
          </span>
        </label>
        {error && <p className="reg-err reg-err-block">{error}</p>}
        <button
          type="button"
          className="btn btn-red"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? "One moment…" : responded ? "Update RSVP" : "Send RSVP"}
        </button>
      </fieldset>
    </div>
  );
}
