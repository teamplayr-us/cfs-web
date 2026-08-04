import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { EVENTS } from "@/data/events";
import { SPONSOR_SLOTS } from "@/data/sponsors";

export const metadata: Metadata = {
  title: "Sponsor the Tour | College Flag Showcase Series",
  description:
    "Put your brand on the field at every stop of the College Flag Showcase Series — venue signage, athlete touchpoints, targeted digital promotions, and activation space in front of athletes, families, and college programs nationwide.",
  openGraph: {
    title: "Sponsor the Tour | College Flag Showcase Series",
    description:
      "Season-long and single-stop sponsorship packages for the girls flag football recruiting tour.",
    url: "/sponsors",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function SponsorsPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">Series Partners</span>
            <h1 className="event-title">
              Put Your Brand
              <br />
              <em>on the Field.</em>
            </h1>
            <p className="hero-tag">
              <strong>
                Brands backing the fastest-growing girls sport in America
              </strong>{" "}
              — on-site at every event, in front of athletes, families, and
              college programs nationwide.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href="/sponsors/interest">
                Become a Sponsor
              </a>
              <a className="btn btn-ghost-light" href="/#tour">
                See the Tour
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ WHY PARTNER ============ */}
      <hr className="yard" data-yd="THE PITCH — 20 YD" />
      <section className="section" id="why-partner">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Partner</span>
            <h2>
              In Front of the
              <br />
              Right Crowd.
            </h2>
            <p>
              Every event puts your brand in the middle of a full recruiting
              weekend — athletes competing, families in the stands, and college
              coaches on the sideline.
            </p>
          </div>

          <div className="reach-grid" aria-label="Series reach">
            <div className="reach-cell">
              <span className="reach-num">{EVENTS.length}</span>
              <span className="reach-label">Events, coast to coast</span>
            </div>
            <div className="reach-cell">
              <span className="reach-num">800+</span>
              <span className="reach-label">
                Flag football athletes &amp; families per event
              </span>
            </div>
            <div className="reach-cell">
              <span className="reach-num">10K+</span>
              <span className="reach-label">
                Digital community via Flag Football Finder
              </span>
            </div>
            <div className="reach-cell">
              <span className="reach-num">Live</span>
              <span className="reach-label">
                College coaches on the sideline
              </span>
            </div>
          </div>

          <div className="why-grid">
            <div className="why">
              <span className="why-num">01</span>
              <h3>The Audience</h3>
              <p>
                Athletes, parents, and college coaches together all weekend —
                the families driving the fastest-growing girls sport in
                America.
              </p>
            </div>
            <div className="why">
              <span className="why-num">02</span>
              <h3>The Footprint</h3>
              <p>
                {EVENTS.length} events, coast to coast, across the 2026–27
                season — one series carrying your brand from market to market.
              </p>
            </div>
            <div className="why">
              <span className="why-num">03</span>
              <h3>The Activation</h3>
              <p>
                Venue signage, athlete touchpoints, targeted digital
                promotions, and activation space — plus presence in event film
                and recap content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PACKAGES ============ */}
      <hr className="yard" data-yd="PACKAGES — 30 YD" />
      <section className="section" id="packages">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Packages</span>
            <h2>
              Three Ways
              <br />
              to Take the Field.
            </h2>
            <p>
              Every package includes the full event-weekend activation — the
              tiers set how far your brand travels.
            </p>
          </div>

          <ul className="pkg-includes" aria-label="Every package includes">
            <li>Venue signage all event weekend</li>
            <li>Athlete touchpoints on site</li>
            <li>Digital + web sponsor board placement</li>
            <li>Activation space at the venue</li>
            <li>Presence in event film &amp; recap content</li>
            <li>Direct access to athletes, families &amp; college programs</li>
            <li>Targeted digital promotions</li>
          </ul>

          <div className="offer-grid three">
            <article className="offer offer-combine">
              <div className="offer-head">
                <h3>Presenting Sponsor</h3>
                <span className="offer-num">01</span>
              </div>
              <div className="offer-body">
                <p className="offer-lede">
                  &quot;Presented by&quot; naming across all {EVENTS.length}{" "}
                  events — premier signage placement, first-choice activation
                  space, and featured presence in film and digital.
                </p>
                <a
                  className="btn btn-red schedule-cta"
                  href="/sponsors/interest?package=presenting"
                >
                  Become a Sponsor
                </a>
                <p className="offer-meta">
                  Coverage: <b>All {EVENTS.length} events</b> — 1 available
                </p>
              </div>
            </article>

            <article className="offer">
              <div className="offer-head">
                <h3>Season Partner</h3>
                <span className="offer-num">02</span>
              </div>
              <div className="offer-body">
                <p className="offer-lede">
                  Every event, all season — your brand travels with the series,
                  from the first whistle in McKinney to the last event of the
                  tour.
                </p>
                <a
                  className="btn btn-ghost schedule-cta"
                  href="/sponsors/interest?package=season"
                >
                  Become a Sponsor
                </a>
                <p className="offer-meta">
                  Coverage: <b>All {EVENTS.length} events</b> — 2026–27 season
                </p>
              </div>
            </article>

            <article className="offer">
              <div className="offer-head">
                <h3>Single Event</h3>
                <span className="offer-num">03</span>
              </div>
              <div className="offer-body">
                <p className="offer-lede">
                  Pick your market — full event-weekend activation in the market
                  that fits your brand and your region.
                </p>
                <a
                  className="btn btn-ghost schedule-cta"
                  href="/sponsors/interest?package=single"
                >
                  Start the Conversation
                </a>
                <p className="offer-meta">
                  Coverage: <b>One event</b> — your market
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ============ CURRENT PARTNERS ============ */}
      <hr className="yard" data-yd="PARTNERS — 50 YD" />
      <section className="section" id="sponsors">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Series Partners</span>
            <h2>Sponsors</h2>
            <p>This board updates as partners join the series.</p>
          </div>

          <div className="sponsor-grid" aria-label="Series sponsors">
            {SPONSOR_SLOTS.map((slot, i) => (
              <div className="sponsor-slot" key={i}>
                <span>{slot.filled ? slot.name : "Sponsor logo"}</span>
              </div>
            ))}
          </div>

          <div className="sponsor-cta">
            <div>
              <h3>Ready to Take the Field?</h3>
              <p>
                Tell us about your brand and the markets you care about —
                we&apos;ll put a package together.
              </p>
            </div>
            <a className="btn btn-red" href="/sponsors/interest">
              Become a Sponsor
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
