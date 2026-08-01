import NextStopCard from "./NextStopCard";
import { ATHLETE_REG_URL, teamInviteMailto } from "@/data/links";
import { NEXT_STOP } from "@/data/events";

export default function Hero() {
  return (
    <header className="hero" id="top">
      <div className="wrap hero-inner">
        <div>
          <span className="hero-badge">Girls National Recruiting Tour</span>
          <h1>
            Show Your Game.
            <br />
            Get Seen.
            <br />
            <em>Get Recruited.</em>
          </h1>
          <p className="hero-tag">
            <strong>
              Individual skill display and live tournament competition in one
              weekend
            </strong>{" "}
            — evaluated in person by college flag football coaches at premier
            venues across the country, with verified testing to back it up.
          </p>
          <div className="hero-ctas">
            <div className="cta-stack">
              <span className="cta-kicker">Showcase Combine &amp; Camp</span>
              <a className="btn btn-red" href={ATHLETE_REG_URL}>
                Register as an Athlete
              </a>
            </div>
            <div className="cta-stack">
              <span className="cta-kicker">Showcase Tournament · Invite Only</span>
              <a
                className="btn btn-ghost-light"
                href={teamInviteMailto(NEXT_STOP)}
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
