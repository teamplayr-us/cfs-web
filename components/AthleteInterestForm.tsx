"use client";

import { useState } from "react";
import { GRAD_YEARS, POSITIONS } from "@/lib/registration";
import {
  AthleteInterestData,
  AthleteInterestErrors,
  CONTACT_ROLES,
  ContactRole,
  EMPTY_ATHLETE_INTEREST,
  validateAthleteInterest,
} from "@/lib/athleteInterest";

interface EventOption {
  slug: string;
  label: string;
}

interface Props {
  /** Selectable events (label like "Dallas, TX — Dec 11–13, 2026") */
  events: EventOption[];
}

export default function AthleteInterestForm({ events }: Props) {
  const [data, setData] = useState<AthleteInterestData>(EMPTY_ATHLETE_INTEREST);
  const [errors, setErrors] = useState<AthleteInterestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof AthleteInterestData>(
    key: K,
    value: AthleteInterestData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggle(key: "positions" | "events", value: string, on: boolean) {
    set(
      key,
      on ? [...data[key], value] : data[key].filter((v) => v !== value),
    );
  }

  async function submit() {
    const fieldErrors = validateAthleteInterest(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setSubmitError("Some fields need attention.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/athlete-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error ?? "Something went wrong. Please try again.");
        if (body.fields) setErrors(body.fields);
        setSubmitting(false);
        return;
      }
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const err = (key: keyof AthleteInterestData) =>
    errors[key] ? <span className="reg-err">{errors[key]}</span> : null;

  if (done) {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">You&apos;re on the list</p>
        <ul className="reg-next">
          <li>We&apos;ll keep you posted on dates, deadlines, and new events.</li>
          <li>
            A confirmation is on its way to {data.email.trim()}.
          </li>
          <li>
            Ready now? Registration for the Showcase Combine &amp; Camp in
            Dallas is open:{" "}
            <a href="/events/mckinney-tx/register">register here</a>.
          </li>
        </ul>
        <p className="reg-fineprint">
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
      <p className="reg-step-kicker">Tell us about the athlete</p>
      <fieldset className="reg-fields">
        <legend className="reg-legend">Athlete</legend>
        <div className="reg-grid">
          <label>
            Athlete first name{err("athleteFirst")}
            <input
              type="text"
              value={data.athleteFirst}
              onChange={(e) => set("athleteFirst", e.target.value)}
            />
          </label>
          <label>
            Athlete last name{err("athleteLast")}
            <input
              type="text"
              value={data.athleteLast}
              onChange={(e) => set("athleteLast", e.target.value)}
            />
          </label>
          <label>
            Grad year{err("gradYear")}
            <select
              value={data.gradYear}
              onChange={(e) => set("gradYear", e.target.value)}
            >
              <option value="" disabled>
                Choose one…
              </option>
              {GRAD_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label>
            Hometown{err("hometown")}
            <input
              type="text"
              placeholder="City, State (or Country)"
              value={data.hometown}
              onChange={(e) => set("hometown", e.target.value)}
            />
          </label>
        </div>
        <label>
          Club / travel team (optional){err("club")}
          <input
            type="text"
            value={data.club}
            onChange={(e) => set("club", e.target.value)}
          />
        </label>
        <div className="reg-positions">
          <span className="reg-sublabel">
            Positions (optional){err("positions")}
          </span>
          <div className="reg-checks">
            {POSITIONS.map((p) => (
              <label key={p} className="reg-check">
                <input
                  type="checkbox"
                  checked={data.positions.includes(p)}
                  onChange={(e) => toggle("positions", p, e.target.checked)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <p className="reg-step-kicker" style={{ marginTop: 32 }}>
        Your contact info
      </p>
      <fieldset className="reg-fields">
        <legend className="reg-legend">Your contact info</legend>
        <div className="reg-grid">
          <label>
            Your name{err("contactName")}
            <input
              type="text"
              autoComplete="name"
              value={data.contactName}
              onChange={(e) => set("contactName", e.target.value)}
            />
          </label>
          <label>
            You are the…{err("contactRole")}
            <select
              value={data.contactRole}
              onChange={(e) =>
                set("contactRole", e.target.value as ContactRole | "")
              }
            >
              <option value="" disabled>
                Choose one…
              </option>
              {CONTACT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            Email{err("email")}
            <input
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </label>
          <label>
            Phone (optional){err("phone")}
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
        </div>
        <div className="reg-positions">
          <span className="reg-sublabel">Events you&apos;re interested in (optional)</span>
          <div className="reg-checks">
            {events.map((event) => (
              <label key={event.slug} className="reg-check">
                <input
                  type="checkbox"
                  checked={data.events.includes(event.slug)}
                  onChange={(e) =>
                    toggle("events", event.slug, e.target.checked)
                  }
                />
                {event.label}
              </label>
            ))}
          </div>
        </div>
        <label>
          Anything we should know? (optional){err("message")}
          <textarea
            rows={3}
            placeholder="Questions, achievements, or anything else"
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </label>
        {/* honeypot — hidden from humans, bots fill it */}
        <label className="reg-hp" aria-hidden="true">
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </label>
        {submitError && <p className="reg-err reg-err-block">{submitError}</p>}
        <button
          type="button"
          className="btn btn-red"
          onClick={submit}
          disabled={submitting}
        >
          {submitting ? "One moment…" : "Get on the List"}
        </button>
      </fieldset>
    </div>
  );
}
