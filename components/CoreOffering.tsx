export default function CoreOffering() {
  return (
    <>
      <hr className="yard" data-yd="THE EVENT — 20 YD" />
      <section className="section" id="offering">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Core Offering</span>
            <h2>
              One Weekend.
              <br />
              Two Ways to Prove It.
            </h2>
            <p>
              Every stop on the series pairs individual testing with team
              competition — so coaches see your measurables and how you play the
              game.
            </p>
          </div>

          <div className="offer-grid">
            {/* 1. Combine & Camp */}
            <article className="offer offer-combine">
              <div className="offer-head">
                <h3>Showcase Combine &amp; Camp</h3>
                <span className="offer-num">01</span>
              </div>
              <div className="offer-body">
                <p className="offer-lede">
                  Camp-style individual evaluation run by trained staff — show
                  coaches what you can do, with verified testing on the record.
                </p>
                <ul>
                  <li>
                    <span className="tick">✓</span>Show off your individual
                    skill and technique — positional drills, route running,
                    1v1s, and camp-style instruction with real coaching
                  </li>
                  <li>
                    <span className="tick">✓</span>Get verified combine metrics
                    — speed, agility, and explosiveness testing you can put in
                    front of any college program
                  </li>
                </ul>
                <div
                  className="metric-strip"
                  aria-label="Example verified combine metrics"
                >
                  <div className="metric">
                    <div className="m-label">40-YD</div>
                    <div className="m-val">
                      5.12<sup>✓</sup>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="m-label">Shuttle</div>
                    <div className="m-val">
                      4.48<sup>✓</sup>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="m-label">Vertical</div>
                    <div className="m-val">
                      24.5&quot;<sup>✓</sup>
                    </div>
                  </div>
                  <div className="metric">
                    <div className="m-label">Broad</div>
                    <div className="m-val">
                      7&apos;9&quot;<sup>✓</sup>
                    </div>
                  </div>
                </div>
                <p className="offer-meta">
                  Registration: <b>Individual</b> — No team required
                </p>
              </div>
            </article>

            {/* 2. Showcase Tournament */}
            <article className="offer">
              <div className="offer-head">
                <h3>Showcase Tournament</h3>
                <span className="offer-num">02</span>
              </div>
              <div className="offer-body">
                <p className="offer-lede">
                  Bracketed 5v5 team competition — real games, real stakes,
                  evaluated live from the sideline.
                </p>
                <ul>
                  <li>
                    <span className="tick">▶</span>Compete with your team
                    against top competition in front of college coaches
                  </li>
                  <li>
                    <span className="tick">▶</span>Multiple divisions so every
                    team plays at its level — from first-time tournament squads
                    to nationally competitive programs
                  </li>
                  <li>
                    <span className="tick">▶</span>Combine athletes can be
                    placed as guest players — no team, still compete
                  </li>
                </ul>
                <p className="offer-meta">
                  Registration: <b>Team</b> — Guest player placement available
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
