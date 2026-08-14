import NextStopCard from "./NextStopCard";
import { ATHLETE_REG_URL } from "@/data/links";
import { NEXT_STOP } from "@/data/events";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-inner">
        <div>
          <span className="hero-badge">Girls National Recruiting Series</span>
          <h1>
            Ball Out.
            <br />
            Get Seen.
            <br />
            <em>Get Recruited.</em>
          </h1>
          <p className="hero-tag">
            <strong>
              College coaches are recruiting girls flag football players —
              this series puts you in front of them.
            </strong>{" "}
            Show off your skills in a combine, compete with your travel team
            in a tournament, and leave with verified results and film coaches
            can trust.
          </p>
          <div className="hero-ctas">
            <div className="cta-stack">
              <span className="cta-kicker">Showcase Combine &amp; Camp</span>
              <a className="btn btn-red" href={ATHLETE_REG_URL}>
                Register as an Athlete
              </a>
            </div>
            <div className="cta-stack">
              <span className="cta-kicker">Showcase Tournament</span>
              <a
                className="btn btn-ghost-light"
                href={`/events/${NEXT_STOP.slug}/invite`}
              >
                Request a Team Invite
              </a>
            </div>
          </div>
        </div>

        <NextStopCard />
      </div>
    </header>
  );
}
