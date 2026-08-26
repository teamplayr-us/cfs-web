import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import CommittedColleges from "@/components/CommittedColleges";
import CompetingPrograms from "@/components/CompetingPrograms";
import TourStops from "@/components/TourStops";
import InterestCTA from "@/components/InterestCTA";
import Footer from "@/components/Footer";
import {
  ATHLETE_REG_LIVE,
  EVENTS,
  getEvent,
  stopLabel,
  TourEvent,
  TOURNAMENT_DISCOUNT_CENTS,
} from "@/data/events";
import { collegesForEvent } from "@/data/colleges";
import { orgsForEvent } from "@/data/organizations";
import { formatPrice } from "@/lib/format";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const event = getEvent(params.slug);
  if (!event) return {};
  const title = `${event.city} — ${stopLabel(event)} | College Flag Showcase Series`;
  const when = event.details?.dates ?? event.date;
  const description = `${stopLabel(event)} of the College Flag Showcase Series — ${event.venue}, ${when}. Verified combine and college showcase tournament for girls flag football.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/events/${event.slug}`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: { title, description, images: ["/og.png"] },
  };
}

function venueMapUrl(event: TourEvent): string | null {
  if (event.venue.toLowerCase().includes("announcing")) return null;
  const query = encodeURIComponent(`${event.venue}, ${event.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default function EventPage({ params }: Props) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const regOpen = Boolean(event.athleteReg?.open);
  const registerUrl = `/events/${event.slug}/register`;
  const inviteUrl = `/events/${event.slug}/invite`;
  const mapUrl = venueMapUrl(event);
  const combineWhen =
    event.athleteReg?.combineDate ?? event.details?.dates ?? event.date;
  const combineTime =
    event.athleteReg?.combineStartTime && event.athleteReg?.combineEndTime
      ? `${event.athleteReg.combineStartTime} – ${event.athleteReg.combineEndTime}`
      : "TBD";

  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">
              {stopLabel(event)} — 2026–27 Season
            </span>
            <h1 className="event-title">
              Flag Football
              <br />
              College Showcase
              <br />
              <em>in {event.city}</em>
            </h1>
            <p className="hero-tag">
              <strong>
                Verified combine testing and live tournament competition
                {mapUrl ? ` at ${event.venue}` : ` in ${event.city}`},{" "}
                {event.details?.dates ?? event.date}
              </strong>{" "}
              — evaluated in person by college flag football coaches.
            </p>
            {event.anchorEvent && (
              <p className="anchor-proof">
                In partnership with the {event.anchorEvent.name} —{" "}
                {event.anchorEvent.stat}
              </p>
            )}
            <div className="hero-ctas">
              <div className="cta-stack">
                <span className="cta-kicker">Showcase Combine &amp; Camp</span>
                {regOpen && ATHLETE_REG_LIVE ? (
                  <a className="btn btn-red" href={registerUrl}>
                    Register as an Athlete
                  </a>
                ) : regOpen ? (
                  <span className="btn btn-soon">
                    Registration Coming Soon
                  </span>
                ) : (
                  <a className="btn btn-red" href="/#interest">
                    Get Notified
                  </a>
                )}
              </div>
              <div className="cta-stack">
                <span className="cta-kicker">Showcase Tournament</span>
                <a className="btn btn-ghost-light" href={inviteUrl}>
                  Request a Team Invite
                </a>
              </div>
            </div>
          </div>

          <aside className="stop-card" aria-label="Event details">
            <div className="stop-card-top">
              <span>Series Event</span>
              <span>{stopLabel(event)}</span>
            </div>
            <div className="stop-card-body">
              <div className="stop-city">{event.city.replace(/ /g, "\u00A0")}</div>
              <p className="stop-venue">
                {mapUrl ? (
                  <a href={mapUrl} target="_blank" rel="noreferrer">
                    {event.venue}
                  </a>
                ) : (
                  event.venue
                )}
              </p>
              {event.details ? (
                <dl className="stop-grid">
                  <div className="stop-cell">
                    <dt>Dates</dt>
                    <dd>{event.details.dates}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Divisions</dt>
                    <dd>{event.details.divisions}</dd>
                  </div>
                  {event.athleteReg && (
                    <div className="stop-cell">
                      <dt>Athlete Entry</dt>
                      {/* tournament-team discount floor — full price without a code */}
                      <dd>
                        Starting at{" "}
                        {formatPrice(
                          event.athleteReg.priceCents -
                            TOURNAMENT_DISCOUNT_CENTS,
                        )}
                      </dd>
                    </div>
                  )}
                  <div className="stop-cell">
                    <dt>Team Entry</dt>
                    <dd>{event.details.teamEntry}</dd>
                  </div>
                  {!event.athleteReg && (
                    <div className="stop-cell">
                      <dt>Reg. Deadline</dt>
                      <dd>{event.details.regDeadline}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <dl className="stop-grid">
                  <div className="stop-cell">
                    <dt>Dates</dt>
                    <dd>{event.date}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Status</dt>
                    <dd>{event.tag}</dd>
                  </div>
                </dl>
              )}
            </div>
          </aside>
        </div>
      </header>

      {/* ============ THE WEEKEND ============ */}
      <hr className="yard" data-yd="THE WEEKEND — 20 YD" />
      <section className="section" id="weekend">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">
              {stopLabel(event)} — {event.city}
            </span>
            <h2>The Weekend</h2>
            <p>
              The Showcase Combine &amp; Camp opens the weekend; the Showcase
              Tournament follows
              {mapUrl ? <> — both at {event.venue}.</> : <>. Venue announcing soon.</>}
            </p>
          </div>

          <div className="offer-grid">
            <article className="offer offer-combine">
              <div className="offer-head">
                <h3>Showcase Combine &amp; Camp</h3>
                <span className="offer-num">01</span>
              </div>
              <div className="offer-body">
                <dl className="stop-grid schedule-grid">
                  <div className="stop-cell">
                    <dt>Date</dt>
                    <dd>{combineWhen}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Time</dt>
                    <dd>{combineTime}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Athlete Entry</dt>
                    <dd>
                      {event.athleteReg
                        ? `Starting at ${formatPrice(
                            event.athleteReg.priceCents -
                              TOURNAMENT_DISCOUNT_CENTS,
                          )}`
                        : "Announcing"}
                    </dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Divisions</dt>
                    <dd>{event.details?.divisions ?? "Announcing"}</dd>
                  </div>
                </dl>
                {regOpen && ATHLETE_REG_LIVE ? (
                  <a className="btn btn-red schedule-cta" href={registerUrl}>
                    Register as an Athlete
                  </a>
                ) : regOpen ? (
                  <span className="btn btn-soon schedule-cta">
                    Registration Coming Soon
                  </span>
                ) : (
                  <a className="btn btn-red schedule-cta" href="/#interest">
                    Get Notified
                  </a>
                )}
                <p className="offer-meta">
                  Registration: <b>Individual</b> — No team required
                </p>
              </div>
            </article>

            <article className="offer">
              <div className="offer-head">
                <h3>Showcase Tournament</h3>
                <span className="offer-num">02</span>
              </div>
              <div className="offer-body">
                <dl className="stop-grid schedule-grid">
                  <div className="stop-cell">
                    <dt>Dates</dt>
                    <dd>
                      {event.details?.tournamentDates ??
                        event.details?.dates ??
                        event.date}
                    </dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Team Entry</dt>
                    <dd>{event.details?.teamEntry ?? "Announcing"}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Divisions</dt>
                    <dd>{event.details?.divisions ?? "Announcing"}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Reg. Deadline</dt>
                    <dd>{event.details?.regDeadline ?? "Announcing"}</dd>
                  </div>
                </dl>
                <a className="btn btn-ghost schedule-cta" href={inviteUrl}>
                  Request a Team Invite
                </a>
                <p className="offer-meta">
                  Registration: <b>Team</b> — Invite Only
                </p>
                {event.anchorEvent && (
                  <p className="offer-meta">
                    Held in partnership with the {event.anchorEvent.name} —
                    invited teams complete registration through{" "}
                    {event.anchorEvent.abbr}.
                  </p>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <CompetingPrograms
        slots={orgsForEvent(event.slug)}
        inviteHref={inviteUrl}
      />
      <CommittedColleges slots={collegesForEvent(event.slug)} />
      <TourStops excludeSlug={event.slug} />
      <InterestCTA />
      <Footer />
    </>
  );
}
