"use client";

import { useState } from "react";
import { GRAD_YEARS, POSITIONS } from "@/lib/registration";
import {
  EMPTY_GUEST_PLAYER,
  GUEST_CONSENT,
  GuestErrors,
  GuestPlayerData,
  validateGuestPlayer,
} from "@/lib/guestPlayer";
import { COUNTRIES, US, US_STATES } from "@/lib/states";

interface EventOption {
  slug: string;
  label: string;
}

export default function GuestPlayerForm({ events }: { events: EventOption[] }) {
  const [data, setData] = useState<GuestPlayerData>({
    ...EMPTY_GUEST_PLAYER,
    eventSlug: events.length === 1 ? events[0].slug : "",
  });
  const [errors, setErrors] = useState<GuestErrors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof GuestPlayerData>(k: K, v: GuestPlayerData[K]) {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }
  const err = (k: keyof GuestPlayerData) =>
    errors[k] ? <span className="reg-err">{errors[k]}</span> : null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateGuestPlayer(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setSubmitError("Some fields need attention.");
      return;
    }
    setState("sending");
    setSubmitError(null);
    try {
      const res = await fetch("/api/guest-players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error ?? "Something went wrong. Please try again.");
        if (body.fields) setErrors(body.fields);
        setState("idle");
        return;
      }
      setState("done");
      window.scrollTo({ top: 0 });
    } catch {
      setSubmitError(
        "Couldn't reach the server. Check your connection and try again.",
      );
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <div className="reg-card">
        <p className="reg-step-kicker">You&apos;re in the pool</p>
        <p>
          <b>
            {data.athleteFirst} {data.athleteLast}
          </b>{" "}
          is now in the guest player pool. Club coaches of registered teams can
          see the profile and may contact you directly. A confirmation is on
          its way to {data.guardianEmail}.
        </p>
        <p className="reg-fineprint">
          To leave the pool or update anything, email
          info@collegeflagshowcase.com.
        </p>
      </div>
    );
  }

  return (
    <form className="reg-card reg-fields" onSubmit={submit} noValidate>
      <p className="reg-step-kicker">Join the guest player pool — free</p>

      {events.length > 1 && (
        <label>
          Event{err("eventSlug")}
          <select
            value={data.eventSlug}
            onChange={(e) => set("eventSlug", e.target.value)}
          >
            <option value="">Select…</option>
            {events.map((ev) => (
              <option key={ev.slug} value={ev.slug}>
                {ev.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <span className="reg-sublabel">About the athlete</span>
      <div className="reg-grid">
        <label>
          First name{err("athleteFirst")}
          <input
            type="text"
            value={data.athleteFirst}
            onChange={(e) => set("athleteFirst", e.target.value)}
          />
        </label>
        <label>
          Last name{err("athleteLast")}
          <input
            type="text"
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
        <label>
          Country{err("country")}
          <select
            autoComplete="country"
            value={data.country}
            onChange={(e) => {
              set("country", e.target.value);
              set("state", "");
            }}
          >
            {COUNTRIES.map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Home city{err("city")}
          <input
            type="text"
            autoComplete="address-level2"
            value={data.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </label>
        {data.country === US ? (
          <label>
            State{err("state")}
            <select
              autoComplete="address-level1"
              value={data.state}
              onChange={(e) => set("state", e.target.value)}
            >
              <option value="">Select…</option>
              {US_STATES.map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            State / province (optional){err("state")}
            <input
              type="text"
              autoComplete="address-level1"
              value={data.state}
              onChange={(e) => set("state", e.target.value)}
            />
          </label>
        )}
        <label>
          {data.country === US ? "ZIP code" : "Postal code (optional)"}
          {err("zip")}
          <input
            type="text"
            autoComplete="postal-code"
            inputMode={data.country === US ? "numeric" : "text"}
            value={data.zip}
            onChange={(e) => set("zip", e.target.value)}
          />
        </label>
        <label>
          Current club (optional){err("clubTeam")}
          <input
            type="text"
            placeholder="Leave blank if none"
            value={data.clubTeam}
            onChange={(e) => set("clubTeam", e.target.value)}
          />
        </label>
        <label>
          Flag Football Finder profile (optional){err("fffUrl")}
          <input
            type="url"
            inputMode="url"
            placeholder="https://…"
            value={data.fffUrl}
            onChange={(e) => set("fffUrl", e.target.value)}
          />
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

      <span className="reg-sublabel">Parent / guardian</span>
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

      {/* honeypot — hidden from people, tempting to bots */}
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

      <div className="reg-waiver">
        <label className="reg-check">
          <input
            type="checkbox"
            checked={data.eligibilityConfirmed}
            onChange={(e) => set("eligibilityConfirmed", e.target.checked)}
          />
          The athlete is eligible for the girls&apos; Showcase divisions
          (12U–18U, age as of August 1, 2026)
          {err("eligibilityConfirmed")}
        </label>
        <p>{GUEST_CONSENT}</p>
        <label className="reg-check">
          <input
            type="checkbox"
            checked={data.consentAgreed}
            onChange={(e) => set("consentAgreed", e.target.checked)}
          />
          I agree{err("consentAgreed")}
        </label>
        <label>
          Type your full legal name as signature{err("consentSignature")}
          <input
            type="text"
            autoComplete="off"
            value={data.consentSignature}
            onChange={(e) => set("consentSignature", e.target.value)}
          />
        </label>
      </div>

      {submitError && <p className="reg-err reg-err-block">{submitError}</p>}
      <button className="btn btn-red" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "One moment…" : "Join the Guest Player Pool"}
      </button>
    </form>
  );
}
