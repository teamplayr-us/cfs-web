"use client";

import { useEffect, useState } from "react";
import {
  EMPTY_REGISTRATION,
  FieldErrors,
  GRAD_YEARS,
  POSITIONS,
  RegistrationData,
  validateRegistration,
  WAIVER_SUMMARY,
} from "@/lib/registration";

interface Props {
  eventSlug: string;
  city: string;
  stopLabel: string;
  venue: string;
  dates: string;
  /** Combine start–end time range, or "TBD" */
  time: string;
  priceCents: number;
}

const STEP_TITLES = ["About the Athlete", "Parent / Guardian", "Review & Pay"];

function formatPrice(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  })}`;
}

export default function RegistrationForm(props: Props) {
  const storageKey = `cfs-reg-${props.eventSlug}`;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<RegistrationData>(EMPTY_REGISTRATION);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);

  // Restore a half-finished form (e.g. after a Stripe cancel/back).
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) setData({ ...EMPTY_REGISTRATION, ...JSON.parse(saved) });
    } catch {
      // ignore corrupt storage
    }
    if (new URLSearchParams(window.location.search).has("canceled")) {
      setCanceled(true);
      setStep(2);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      // storage full/unavailable — the form still works, just won't persist
    }
  }, [data, storageKey]);

  function set<K extends keyof RegistrationData>(
    key: K,
    value: RegistrationData[K],
  ) {
    setData((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function next() {
    const stepErrors = validateRegistration(data, (step + 1) as 1 | 2);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0 });
    }
  }

  async function pay() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventSlug: props.eventSlug, data }),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error ?? "Something went wrong. Please try again.");
        if (body.fields) setErrors(body.fields);
        setSubmitting(false);
        return;
      }
      window.location.href = body.url;
    } catch {
      setSubmitError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const err = (key: keyof RegistrationData) =>
    errors[key] ? <span className="reg-err">{errors[key]}</span> : null;

  return (
    <div className="reg-card">
      <p className="reg-step-kicker">
        Step {step + 1} of 3 — {STEP_TITLES[step]}
      </p>

      {canceled && step === 2 && (
        <p className="reg-notice">
          Payment was canceled — your details are still saved below.
        </p>
      )}

      {step === 0 && (
        <fieldset className="reg-fields">
          <legend className="reg-legend">About the Athlete</legend>
          <div className="reg-grid">
            <label>
              First name{err("athleteFirst")}
              <input
                type="text"
                autoComplete="given-name"
                value={data.athleteFirst}
                onChange={(e) => set("athleteFirst", e.target.value)}
              />
            </label>
            <label>
              Last name{err("athleteLast")}
              <input
                type="text"
                autoComplete="family-name"
                value={data.athleteLast}
                onChange={(e) => set("athleteLast", e.target.value)}
              />
            </label>
            <label>
              Date of birth{err("dob")}
              <input
                type="date"
                value={data.dob}
                onChange={(e) => set("dob", e.target.value)}
              />
            </label>
            <label>
              Graduation year{err("gradYear")}
              <select
                value={data.gradYear}
                onChange={(e) => set("gradYear", e.target.value)}
              >
                <option value="">Select…</option>
                {GRAD_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="reg-positions">
            <span className="reg-sublabel">
              Positions (pick all that apply){err("positions")}
            </span>
            <div className="reg-checks">
              {POSITIONS.map((p) => (
                <label key={p} className="reg-check">
                  <input
                    type="checkbox"
                    checked={data.positions.includes(p)}
                    onChange={(e) =>
                      set(
                        "positions",
                        e.target.checked
                          ? [...data.positions, p]
                          : data.positions.filter((x) => x !== p),
                      )
                    }
                  />
                  {p}
                </label>
              ))}
            </div>
          </div>
          <label>
            Flag Football Finder profile link (optional){err("fffUrl")}
            <input
              type="url"
              inputMode="url"
              placeholder="https://…"
              value={data.fffUrl}
              onChange={(e) => set("fffUrl", e.target.value)}
            />
          </label>
          <label>
            Allergies / medical notes (optional){err("medical")}
            <textarea
              rows={3}
              placeholder="Anything our staff should know on event day"
              value={data.medical}
              onChange={(e) => set("medical", e.target.value)}
            />
          </label>
          <button type="button" className="btn btn-red" onClick={next}>
            Continue
          </button>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="reg-fields">
          <legend className="reg-legend">Parent / Guardian</legend>
          <div className="reg-grid">
            <label>
              First name{err("guardianFirst")}
              <input
                type="text"
                autoComplete="given-name"
                value={data.guardianFirst}
                onChange={(e) => set("guardianFirst", e.target.value)}
              />
            </label>
            <label>
              Last name{err("guardianLast")}
              <input
                type="text"
                autoComplete="family-name"
                value={data.guardianLast}
                onChange={(e) => set("guardianLast", e.target.value)}
              />
            </label>
            <label>
              Email{err("guardianEmail")}
              <input
                type="email"
                autoComplete="email"
                value={data.guardianEmail}
                onChange={(e) => set("guardianEmail", e.target.value)}
              />
            </label>
            <label>
              Phone{err("guardianPhone")}
              <input
                type="tel"
                autoComplete="tel"
                value={data.guardianPhone}
                onChange={(e) => set("guardianPhone", e.target.value)}
              />
            </label>
          </div>
          <span className="reg-sublabel">Emergency contact (event day)</span>
          <div className="reg-grid reg-grid-3">
            <label>
              First name{err("emergencyFirst")}
              <input
                type="text"
                value={data.emergencyFirst}
                onChange={(e) => set("emergencyFirst", e.target.value)}
              />
            </label>
            <label>
              Last name{err("emergencyLast")}
              <input
                type="text"
                value={data.emergencyLast}
                onChange={(e) => set("emergencyLast", e.target.value)}
              />
            </label>
            <label>
              Phone{err("emergencyPhone")}
              <input
                type="tel"
                value={data.emergencyPhone}
                onChange={(e) => set("emergencyPhone", e.target.value)}
              />
            </label>
          </div>
          <div className="reg-waiver">
            <p>{WAIVER_SUMMARY}</p>
            <label className="reg-check">
              <input
                type="checkbox"
                checked={data.waiverAgreed}
                onChange={(e) => set("waiverAgreed", e.target.checked)}
              />
              I agree on behalf of the athlete{err("waiverAgreed")}
            </label>
            <label>
              Type your full legal name as signature{err("waiverSignature")}
              <input
                type="text"
                autoComplete="off"
                value={data.waiverSignature}
                onChange={(e) => set("waiverSignature", e.target.value)}
              />
            </label>
          </div>
          <div className="reg-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(0)}
            >
              Back
            </button>
            <button type="button" className="btn btn-red" onClick={next}>
              Continue
            </button>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <div className="reg-fields">
          <div className="stop-card reg-review" aria-label="Order summary">
            <div className="stop-card-top">
              <span>Registration</span>
              <span>{props.stopLabel}</span>
            </div>
            <div className="stop-card-body">
              <div className="stop-city">
                {data.athleteFirst} {data.athleteLast}
              </div>
              <p className="stop-venue">
                Showcase Combine &amp; Camp — {props.city}
              </p>
              <dl className="stop-grid">
                <div className="stop-cell">
                  <dt>Date</dt>
                  <dd>{props.dates}</dd>
                </div>
                <div className="stop-cell">
                  <dt>Time</dt>
                  <dd>{props.time}</dd>
                </div>
                <div className="stop-cell">
                  <dt>Venue</dt>
                  <dd>{props.venue}</dd>
                </div>
                <div className="stop-cell">
                  <dt>Total</dt>
                  <dd>{formatPrice(props.priceCents)}</dd>
                </div>
              </dl>
            </div>
          </div>
          {submitError && <p className="reg-err reg-err-block">{submitError}</p>}
          <p className="reg-fineprint">
            You&apos;ll be taken to Stripe&apos;s secure checkout to complete
            payment. A receipt goes to {data.guardianEmail || "your email"}.
          </p>
          <div className="reg-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-red"
              onClick={pay}
              disabled={submitting}
            >
              {submitting ? "One moment…" : "Continue to Secure Payment"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
