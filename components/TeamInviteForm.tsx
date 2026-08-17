"use client";

import { useState } from "react";
import {
  EMPTY_TEAM_INVITE,
  TeamInviteData,
  TeamInviteErrors,
  validateTeamInvite,
} from "@/lib/teamInvite";

interface EventOption {
  slug: string;
  label: string;
}

interface Props {
  /** All selectable events (label like "Event 01 — Dallas, TX") */
  events: EventOption[];
  /** Slug of the page's event, pre-checked */
  defaultEventSlug: string;
}

export default function TeamInviteForm({ events, defaultEventSlug }: Props) {
  const [data, setData] = useState<TeamInviteData>({
    ...EMPTY_TEAM_INVITE,
    events: [defaultEventSlug],
  });
  const [errors, setErrors] = useState<TeamInviteErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof TeamInviteData>(
    key: K,
    value: TeamInviteData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit() {
    const fieldErrors = validateTeamInvite(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/team-invite", {
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

  const err = (key: keyof TeamInviteData) =>
    errors[key] ? <span className="reg-err">{errors[key]}</span> : null;

  if (done) {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">Request received</p>
        <ul className="reg-next">
          <li>We review every program that requests an invite.</li>
          <li>
            Invited teams get the private tournament registration link by
            email.
          </li>
          <li>Either way, you&apos;ll hear from us.</li>
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
        <legend className="reg-legend">Team invite request</legend>
        <label>
          Team / program name{err("teamName")}
          <input
            type="text"
            value={data.teamName}
            onChange={(e) => set("teamName", e.target.value)}
          />
        </label>
        <div className="reg-grid">
          <label>
            Coach first name{err("coachFirst")}
            <input
              type="text"
              autoComplete="given-name"
              value={data.coachFirst}
              onChange={(e) => set("coachFirst", e.target.value)}
            />
          </label>
          <label>
            Coach last name{err("coachLast")}
            <input
              type="text"
              autoComplete="family-name"
              value={data.coachLast}
              onChange={(e) => set("coachLast", e.target.value)}
            />
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
            Phone{err("phone")}
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
          <label>
            Team location (city, state){err("location")}
            <input
              type="text"
              placeholder="Dallas, TX"
              value={data.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </label>
          <label>
            Age groups you&apos;d bring{err("ageGroups")}
            <input
              type="text"
              placeholder="12U, 14U, 16U, 18U"
              value={data.ageGroups}
              onChange={(e) => set("ageGroups", e.target.value)}
            />
          </label>
        </div>
        <label>
          Competitive background (optional){err("about")}
          <textarea
            rows={3}
            placeholder="Record, tournaments played, level of competition"
            value={data.about}
            onChange={(e) => set("about", e.target.value)}
          />
        </label>
        <label>
          Team link (optional){err("link")}
          <input
            type="url"
            inputMode="url"
            placeholder="https://…  (website, social, or schedule)"
            value={data.link}
            onChange={(e) => set("link", e.target.value)}
          />
        </label>
        <div className="reg-positions">
          <span className="reg-sublabel">
            Events you want to play{err("events")}
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
          {submitting ? "One moment…" : "Request an Invite"}
        </button>
      </fieldset>
    </div>
  );
}
