"use client";

import { useState } from "react";
import {
  CoachRegistrationData,
  CoachRegistrationErrors,
  EMPTY_COACH_REGISTRATION,
  LEVEL_OPTIONS,
  LevelOption,
  ROLE_OPTIONS,
  RoleOption,
  validateCoachRegistration,
} from "@/lib/coachRegistration";

interface EventOption {
  slug: string;
  label: string;
}

interface Props {
  /** All selectable events (label like "Event 01 — McKinney, TX") */
  events: EventOption[];
}

export default function CoachRegistrationForm({ events }: Props) {
  const [data, setData] = useState<CoachRegistrationData>(
    EMPTY_COACH_REGISTRATION,
  );
  const [errors, setErrors] = useState<CoachRegistrationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof CoachRegistrationData>(
    key: K,
    value: CoachRegistrationData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit() {
    const fieldErrors = validateCoachRegistration(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/coach-register", {
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
    } catch {
      setSubmitError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const err = (key: keyof CoachRegistrationData) =>
    errors[key] ? <span className="reg-err">{errors[key]}</span> : null;

  if (done) {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">Registration received</p>
        <ul className="reg-next">
          <li>We&apos;ll confirm your credentials by email.</li>
          <li>
            Before each event you pick, you&apos;ll get expected participant
            counts and combine data access details.
          </li>
          <li>Recruiter credentials are waiting at check-in.</li>
        </ul>
        <p className="reg-fineprint">
          Questions in the meantime? Email{" "}
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
      <p className="reg-step-kicker">Tell us about your program</p>
      <fieldset className="reg-fields">
        <legend className="reg-legend">College coach registration</legend>
        <label>
          College / program{err("program")}
          <input
            type="text"
            autoComplete="organization"
            value={data.program}
            onChange={(e) => set("program", e.target.value)}
          />
        </label>
        <div className="reg-grid">
          <label>
            First name{err("coachFirst")}
            <input
              type="text"
              autoComplete="given-name"
              value={data.coachFirst}
              onChange={(e) => set("coachFirst", e.target.value)}
            />
          </label>
          <label>
            Last name{err("coachLast")}
            <input
              type="text"
              autoComplete="family-name"
              value={data.coachLast}
              onChange={(e) => set("coachLast", e.target.value)}
            />
          </label>
          <label>
            Role{err("role")}
            <select
              value={data.role}
              onChange={(e) => set("role", e.target.value as RoleOption | "")}
            >
              <option value="" disabled>
                Choose one…
              </option>
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Program level{err("level")}
            <select
              value={data.level}
              onChange={(e) => set("level", e.target.value as LevelOption | "")}
            >
              <option value="" disabled>
                Choose one…
              </option>
              {LEVEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            School email{err("email")}
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
          <span className="reg-sublabel">
            Events you plan to attend{err("events")}
          </span>
          <div className="reg-checks">
            {events.map((event) => (
              <label key={event.slug} className="reg-check">
                <input
                  type="checkbox"
                  checked={data.events.includes(event.slug)}
                  onChange={(e) =>
                    set(
                      "events",
                      e.target.checked
                        ? [...data.events, event.slug]
                        : data.events.filter((s) => s !== event.slug),
                    )
                  }
                />
                {event.label}
              </label>
            ))}
          </div>
        </div>
        <label>
          Positions or class years you&apos;re recruiting (optional)
          {err("notes")}
          <textarea
            rows={3}
            placeholder="e.g. QB and DB, 2027–2029 grads"
            value={data.notes}
            onChange={(e) => set("notes", e.target.value)}
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
          {submitting ? "One moment…" : "Get Credentials — It's Free"}
        </button>
      </fieldset>
    </div>
  );
}
