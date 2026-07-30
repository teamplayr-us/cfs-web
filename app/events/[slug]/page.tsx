import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import CoreOffering from "@/components/CoreOffering";
import TourStops from "@/components/TourStops";
import InterestCTA from "@/components/InterestCTA";
import Footer from "@/components/Footer";
import { EVENTS, getEvent, stopLabel } from "@/data/events";
import { ATHLETE_REG_URL, TEAM_REG_URL } from "@/data/links";

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
    openGraph: { title, description, url: `/events/${event.slug}` },
    twitter: { title, description },
  };
}

export default function EventPage({ params }: Props) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const teamRegUrl = event.zortsUrl ?? TEAM_REG_URL;

  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">
              {stopLabel(event)} — 2026–27 Season
            </span>
            <h1 className="event-title">{event.city}</h1>
            <p className="hero-tag">
              <strong>
                Individual skill display and live tournament competition in one
                weekend
              </strong>{" "}
              — evaluated in person by college flag football coaches, with
              verified testing to back it up.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href={ATHLETE_REG_URL}>
                Register as an Athlete
              </a>
              <a className="btn btn-ghost-light" href={teamRegUrl}>
                Register Your Team
              </a>
            </div>
          </div>

          <aside className="stop-card" aria-label="Event details">
            <div className="stop-card-top">
              <span>Tour Stop</span>
              <span>{stopLabel(event)}</span>
            </div>
            <div className="stop-card-body">
              <div className="stop-city">{event.city.replace(/ /g, "\u00A0")}</div>
              <p className="stop-venue">{event.venue}</p>
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
                  <div className="stop-cell">
                    <dt>Team Entry</dt>
                    <dd>{event.details.teamEntry}</dd>
                  </div>
                  <div className="stop-cell">
                    <dt>Reg. Deadline</dt>
                    <dd>{event.details.regDeadline}</dd>
                  </div>
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
              <a className="btn btn-red" href="/#interest">
                Get on the List
              </a>
            </div>
          </aside>
        </div>
      </header>

      <CoreOffering />
      <TourStops />
      <InterestCTA />
      <Footer />
    </>
  );
}
