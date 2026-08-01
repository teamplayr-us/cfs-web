import { SPONSOR_SLOTS } from "@/data/sponsors";

export default function Sponsors() {
  return (
    <>
      <hr className="yard" data-yd="PARTNERS — 50 YD" />
      <section className="section" id="sponsors">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Series Partners</span>
            <h2>Sponsors</h2>
            <p>
              Brands backing the fastest-growing girls sport in America —
              on-site at every stop, in front of athletes, families, and college
              programs nationwide.
            </p>
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
              <h3>Put Your Brand on the Field</h3>
              <p>
                Season-long and single-stop packages available — venue signage,
                athlete touchpoints, digital placement, and activation space at
                every event.
              </p>
            </div>
            <a className="btn btn-red" href="/sponsors">
              Become a Sponsor
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
