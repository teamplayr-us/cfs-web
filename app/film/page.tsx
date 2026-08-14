import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/data/links";

export const metadata: Metadata = {
  title: "Athlete Film Package | College Flag Showcase Series",
  description:
    "Every game filmed by high-quality AI cameras in the full-field view college coaches want — plus combine film and recruiting-ready highlights.",
  openGraph: {
    title: "Athlete Film Package | College Flag Showcase Series",
    description:
      "Every game filmed by high-quality AI cameras in the full-field view college coaches want.",
    url: "/film",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const NOTIFY_HREF = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Athlete Film Package — Notify Me at Launch",
)}`;

// TODO: replace this landing page's notify CTA with the real portal
// (purchase / login / watch) when it ships.
export default function MediaPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">Athlete Film Package</span>
            <h1 className="event-title">
              Your Film.
              <br />
              <em>Your Story.</em>
            </h1>
            <p className="hero-tag">
              <strong>
                Every game filmed. High-quality AI cameras. The exact
                full-field view college coaches want.
              </strong>{" "}
              All of your tournament games are captured automatically — every
              route, every read, every snap — and cut into recruiting-ready
              film you own.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href={NOTIFY_HREF}>
                Get Notified at Launch
              </a>
              <a className="btn btn-ghost-light" href="/#tour">
                See the Events
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ WHAT'S IN THE PACKAGE ============ */}
      <hr className="yard" data-yd="THE PACKAGE — 20 YD" />
      <section className="section" id="package">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What&apos;s in the Package</span>
            <h2>
              Every Rep,
              <br />
              Captured.
            </h2>
            <p>
              Verified numbers open the door — film closes it. The film
              package pairs your combine data with the footage to back it up.
            </p>
          </div>

          <div className="why-grid">
            <div className="why">
              <span className="why-num">01</span>
              <h3>Every Game Filmed</h3>
              <p>
                High-quality AI cameras capture all of your tournament games
                in the exact full-field view college coaches want — every
                route and every read, not just the ball.
              </p>
            </div>
            <div className="why">
              <span className="why-num">02</span>
              <h3>Combine Film</h3>
              <p>
                Your verified testing runs on camera — the same speed,
                agility, and explosiveness numbers coaches see, with the
                footage behind them.
              </p>
            </div>
            <div className="why">
              <span className="why-num">03</span>
              <h3>Highlights</h3>
              <p>
                A recruiting-ready highlight cut of your weekend — built to
                send to college programs and share on your platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THE PORTAL ============ */}
      <hr className="yard" data-yd="THE PORTAL — 30 YD" />
      <section className="section" id="portal">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">The Athlete Portal</span>
            <h2>
              Purchase. Log In.
              <br />
              Watch.
            </h2>
            <p>
              The film portal is in development. Buy your package, log in to
              stream and download your film, and share it straight to the
              coaches recruiting you — all in one place, launching ahead of
              the first event in Dallas.
            </p>
          </div>

          <div className="sponsor-cta">
            <div>
              <h3>Be First In</h3>
              <p>
                Drop your email and we&apos;ll notify you the moment the
                portal opens — pricing and package details announced at
                launch.
              </p>
            </div>
            <a className="btn btn-red" href={NOTIFY_HREF}>
              Get Notified at Launch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
