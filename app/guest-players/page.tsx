import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GuestPlayerForm from "@/components/GuestPlayerForm";
import { EVENTS, stopLabel } from "@/data/events";
import { CONTACT_EMAIL } from "@/data/links";

export const metadata: Metadata = {
  title: "Guest Player Pool | College Flag Showcase Series",
  description:
    "No tournament team? Join the free guest player pool and get found by club coaches of registered tournament teams.",
  openGraph: {
    title: "Guest Player Pool | College Flag Showcase Series",
    description:
      "No tournament team? Join the free guest player pool and get found by club coaches of registered tournament teams.",
    url: "/guest-players",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

// Events whose tournament is taking guest players.
const POOL_EVENTS = EVENTS.filter((e) => e.airtableEventId);

export default function GuestPlayersPage() {
  const events = POOL_EVENTS.map((e) => ({
    slug: e.slug,
    label: `${stopLabel(e)} — ${e.city}${e.details?.dates ? ` · ${e.details.dates}` : ""}`,
  }));
  const first = POOL_EVENTS[0];

  return (
    <>
      <Nav />
      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">Guest Player Pool</span>
            <h1 className="event-title">
              No Team?
              <br />
              <em>Get Picked Up.</em>
            </h1>
            <p className="hero-tag">
              <strong>
                The guest player pool connects athletes without a tournament
                team to club coaches who need players.
              </strong>{" "}
              Joining is free and takes about two minutes.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href="#join">
                Join the Pool
              </a>
              <a className="btn btn-ghost-light" href="/guest-pool">
                Coaches: Browse the Pool
              </a>
            </div>
          </div>
        </div>
      </header>

      <hr className="yard" data-yd="HOW IT WORKS — 20 YD" />
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2>Three Steps to a Roster Spot.</h2>
          </div>
          <div className="why-grid">
            <div className="why">
              <span className="why-num">01</span>
              <h3>Join the Pool</h3>
              <p>
                A parent or guardian adds the athlete&apos;s profile: division,
                grad year, positions, hometown, and a Flag Football Finder link
                if the athlete has one. It&apos;s free.
              </p>
            </div>
            <div className="why">
              <span className="why-num">02</span>
              <h3>Coaches Browse</h3>
              <p>
                Club coaches of registered tournament teams browse the
                pool by division and position when they need to fill a roster.
              </p>
            </div>
            <div className="why">
              <span className="why-num">03</span>
              <h3>They Reach Out</h3>
              <p>
                Interested coaches contact the family directly. Roster
                additions then run through the tournament&apos;s registration,
                like any other player.
              </p>
            </div>
          </div>
        </div>
      </section>

      <hr className="yard" data-yd="THE DETAILS — 30 YD" />
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The Details</span>
            <h2>Good to Know.</h2>
          </div>
          <ul className="pkg-includes">
            <li>All age groups, 8U–18U (age as of August 1, 2026)</li>
            <li>
              {first
                ? `${stopLabel(first)} — ${first.city}${first.details?.dates ? `, ${first.details.dates}` : ""}`
                : "Tournament events"}
            </li>
            <li>Free to join — no fee to be listed</li>
            <li>
              A team that selects a guest player may ask the family to
              contribute toward its tournament registration fee
            </li>
            <li>Only coaches of registered teams can see the pool</li>
            <li>Leave the pool any time by emailing {CONTACT_EMAIL}</li>
          </ul>
          {first && (
            <p className="reg-fineprint">
              Girls 12U–18U: want college coaches to evaluate your athlete in
              skill work and testing too? The{" "}
              <a href={`/events/${first.slug}/register`}>
                Showcase Combine &amp; Camp
              </a>{" "}
              is a separate registration — camp athletes can join the pool from
              that form as well.
            </p>
          )}
        </div>
      </section>

      <hr className="yard" data-yd="JOIN — 40 YD" />
      <section className="section reg-section" id="join">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Join the Pool</span>
            <h2>Add Your Athlete.</h2>
            <p>A parent or legal guardian completes this form.</p>
          </div>
          <GuestPlayerForm events={events} />
        </div>
      </section>
      <Footer />
    </>
  );
}
