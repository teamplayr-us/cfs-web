import type { Metadata } from "next";
import Nav from "@/components/Nav";
import CommittedColleges from "@/components/CommittedColleges";
import Footer from "@/components/Footer";
import { allParticipatingColleges } from "@/data/colleges";

export const metadata: Metadata = {
  title: "College Coaches | College Flag Showcase Series",
  description:
    "Free recruiter credentials for college flag football programs — verified combine data, participant counts, and live elite travel-team competition at every event.",
  openGraph: {
    title: "College Coaches | College Flag Showcase Series",
    description:
      "Evaluate verified, tournament-tested girls flag football athletes in person. Free for college coaches.",
    url: "/colleges",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function CollegesPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">College Coaches</span>
            <h1 className="event-title">
              Recruit From
              <br />
              <em>the Sideline.</em>
            </h1>
            <p className="hero-tag">
              <strong>
                Free recruiter credentials for college flag football programs
              </strong>{" "}
              — verified combine data, expected participant counts, and
              athletes evaluated in live elite competition as top travel
              programs meet in the Showcase Tournament.
            </p>
            <div className="hero-ctas">
              <a className="btn btn-red" href="/colleges/register">
                Get Recruiter Credentials
              </a>
              <a className="btn btn-ghost-light" href="/#tour">
                See the Events
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* ============ WHY ATTEND ============ */}
      <hr className="yard" data-yd="THE PITCH — 20 YD" />
      <section className="section" id="why-attend">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Why Attend</span>
            <h2>
              See the Whole
              <br />
              Athlete.
            </h2>
            <p>
              Every event combines verified testing, individual skill work, and
              live competition — you evaluate the numbers, the technique, and
              the game, all in one weekend.
            </p>
          </div>

          <div className="why-grid">
            <div className="why">
              <span className="why-num">01</span>
              <h3>Verified Data</h3>
              <p>
                Speed, agility, and explosiveness — tested by trained staff and
                on the record, with film to match.
              </p>
            </div>
            <div className="why">
              <span className="why-num">02</span>
              <h3>In-Person Evaluation</h3>
              <p>
                Recruiter credentials put you on the field for positional
                drills, 1v1s, and 5v5 games against curated
                competition.
              </p>
            </div>
            <div className="why">
              <span className="why-num">03</span>
              <h3>Direct Access</h3>
              <p>
                Expected participant counts before you commit, and athletes and
                families in the same building all weekend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHAT'S INCLUDED ============ */}
      <hr className="yard" data-yd="CREDENTIALS — 30 YD" />
      <section className="section" id="coach-registration">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Coach Registration</span>
            <h2>
              Free for College
              <br />
              Programs.
            </h2>
          </div>

          <div className="sponsor-cta">
            <div>
              <h3>Get Credentialed</h3>
              <p>
                Credentials include expected participant counts, the athlete
                recruiting package, full sideline access, and an invitation to
                the Friday-night Coaches Welcome Event — tell us your program
                and which events you plan to attend.
              </p>
            </div>
            <a className="btn btn-red" href="/colleges/register">
              Get Recruiter Credentials
            </a>
          </div>
        </div>
      </section>

      <CommittedColleges
        slots={allParticipatingColleges()}
        title="Participating Colleges"
        lede="Programs already confirmed in the series. This board updates as college coaches register — add yours."
        ctaHref="/colleges/register"
      />

      <Footer />
    </>
  );
}
