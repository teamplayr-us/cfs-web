"use client";

import { useState } from "react";
import {
  EMPTY_SPONSOR_INTEREST,
  PACKAGE_OPTIONS,
  PackageOption,
  SponsorInterestData,
  SponsorInterestErrors,
  validateSponsorInterest,
} from "@/lib/sponsorInterest";

interface EventOption {
  slug: string;
  label: string;
}

interface Props {
  /** All selectable events (label like "Event 01 — McKinney, TX") */
  events: EventOption[];
  /** Pre-selected package (from the tier card the visitor clicked) */
  defaultPackage?: PackageOption;
}

export default function SponsorInterestForm({ events, defaultPackage }: Props) {
  const [data, setData] = useState<SponsorInterestData>({
    ...EMPTY_SPONSOR_INTEREST,
    pkg: defaultPackage ?? "",
  });
  const [errors, setErrors] = useState<SponsorInterestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function set<K extends keyof SponsorInterestData>(
    key: K,
    value: SponsorInterestData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit() {
    const fieldErrors = validateSponsorInterest(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/sponsor-interest", {
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

  const err = (key: keyof SponsorInterestData) =>
    errors[key] ? <span className="reg-err">{errors[key]}</span> : null;

  if (done) {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">Request received</p>
        <ul className="reg-next">
          <li>We&apos;ll review your brand and the markets you flagged.</li>
          <li>
            You&apos;ll hear from us within two business days with a package
            and next steps.
          </li>
        </ul>
        <p className="reg-fineprint">
          Want to move faster? Email{" "}
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
      <p className="reg-step-kicker">Tell us about your brand</p>
      <fieldset className="reg-fields">
        <legend className="reg-legend">Sponsor interest</legend>
        <label>
          Company / brand{err("company")}
          <input
            type="text"
            autoComplete="organization"
            value={data.company}
            onChange={(e) => set("company", e.target.value)}
          />
        </label>
        <div className="reg-grid">
          <label>
            First name{err("contactFirst")}
            <input
              type="text"
              autoComplete="given-name"
              value={data.contactFirst}
              onChange={(e) => set("contactFirst", e.target.value)}
            />
          </label>
          <label>
            Last name{err("contactLast")}
            <input
              type="text"
              autoComplete="family-name"
              value={data.contactLast}
              onChange={(e) => set("contactLast", e.target.value)}
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
            Phone (optional){err("phone")}
            <input
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </label>
        </div>
        <label>
          Company website (optional){err("siteUrl")}
          <input
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={data.siteUrl}
            onChange={(e) => set("siteUrl", e.target.value)}
          />
        </label>
        <label>
          Package you&apos;re interested in{err("pkg")}
          <select
            value={data.pkg}
            onChange={(e) => set("pkg", e.target.value as PackageOption | "")}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {PACKAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div className="reg-positions">
          <span className="reg-sublabel">
            Markets you care about (optional)
          </span>
          <div className="reg-checks">
            {events.map((event) => (
              <label key={event.slug} className="reg-check">
                <input
                  type="checkbox"
                  checked={data.markets.includes(event.slug)}
                  onChange={(e) =>
                    set(
                      "markets",
                      e.target.checked
                        ? [...data.markets, event.slug]
                        : data.markets.filter((s) => s !== event.slug),
                    )
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
            placeholder="Goals, timing, what activation looks like for you"
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
          {submitting ? "One moment…" : "Send It"}
        </button>
      </fieldset>
    </div>
  );
}
