import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PathwayProof from "@/components/PathwayProof";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/data/links";

export const metadata: Metadata = {
  title: "About | College Flag Showcase Series",
  description:
    "Why the College Flag Showcase Series exists, the team behind it, and how every event is run.",
  openGraph: {
    title: "About | College Flag Showcase Series",
    description:
      "Why the College Flag Showcase Series exists, the team behind it, and how every event is run.",
    url: "/about",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

const TEAM = [
  {
    name: "Allen Hamilton",
    role: "Co-Founder. Founder of a youth sports technology platform; lifelong athlete and coach.",
  },
  {
    name: "Monty Holloway",
    role: "Co-Founder. Founder of 5v5 Sports, operator of the International Superflag Invitational.",
  },
  {
    name: "Amanda Newman",
    role: "Co-Founder. Founder of 5v5 Sports, operator of the International Superflag Invitational.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">About the Series</span>
            <h1 className="event-title">
              Why We
              <br />
              <em>Built This.</em>
            </h1>
            <p className="hero-tag">
              <strong>
                Girls flag football is the fastest-growing sport in America —
                and the college path is real.
              </strong>{" "}
              What was missing was the bridge: a place where verified numbers,
              real competition, and college coaches meet on the same field.
            </p>
          </div>
        </div>
      </header>

      {/* ============ MISSION ============ */}
      <hr className="yard" data-yd="THE MISSION — 20 YD" />
      <section className="section" id="mission">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Our Mission</span>
            <h2>
              The Path Is Real.
              <br />
              The Bridge Wasn&apos;t.
            </h2>
            <p>
              Flag football is an Olympic sport, an NCAA emerging sport, and a
              scholarship sport — but a girl balling out for her travel team
              still had no reliable way to get in front of the college coaches
              recruiting her sport. The College Flag Showcase Series exists to
              close that gap: verified combine testing, individual skill work,
              and elite tournament competition — with college coaches
              credentialed on the sideline, in one weekend.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE TEAM ============ */}
      <hr className="yard" data-yd="THE TEAM — 30 YD" />
      <section className="section" id="team">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Who&apos;s Behind It</span>
            <h2>The Team.</h2>
            <p>
              The series was founded by <b>Allen Hamilton</b>,{" "}
              <b>Monty Holloway</b>, and <b>Amanda Newman</b>. Allen is the
              founder of a youth sports technology platform and a lifelong
              athlete and coach; Monty and Amanda are the founders of{" "}
              <b>5v5 Sports</b>, the operator behind the International
              Superflag Invitational, which drew 80 teams from across three
              countries in 2025. The tour&apos;s first stop layers on top of
              Superflag in McKinney, with Flag Football Finder as the
              tour&apos;s official athlete platform.
            </p>
          </div>

          <div className="why-grid">
            {TEAM.map((member, i) => (
              <div className="why" key={member.name}>
                <span className="why-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW WE OPERATE ============ */}
      <hr className="yard" data-yd="THE STANDARD — 40 YD" />
      <section className="section" id="standard">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">How We Operate</span>
            <h2>
              Every Event,
              <br />
              the Same Standard.
            </h2>
          </div>

          <div className="why-grid">
            <div className="why">
              <span className="why-num">01</span>
              <h3>Verified Testing</h3>
              <p>
                Combine numbers measured by trained staff and on the record —
                data coaches can trust, with film to match.
              </p>
            </div>
            <div className="why">
              <span className="why-num">02</span>
              <h3>Curated Competition</h3>
              <p>
                The Showcase Tournament is invite-only, so athletes are seen
                competing at the highest levels — not padding stats.
              </p>
            </div>
            <div className="why">
              <span className="why-num">03</span>
              <h3>Built for Her</h3>
              <p>
                Every event is designed around girls flag athletes and their
                families — from check-in to the final whistle.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PathwayProof />

      {/* ============ CONTACT ============ */}
      <section className="section" id="contact">
        <div className="wrap">
          <div className="sponsor-cta">
            <div>
              <h3>Talk to Us</h3>
              <p>
                Athletes, teams, colleges, sponsors, or press — we answer
                everything from one inbox.
              </p>
            </div>
            <a className="btn btn-red" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
          </div>
          <p className="about-phone">
            Or call <a href={`tel:${CONTACT_PHONE}`}>{CONTACT_PHONE}</a>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
