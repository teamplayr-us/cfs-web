import { TOUR_STOPS } from "@/data/tourStops";

export default function TourStops() {
  return (
    <>
      <hr className="yard" data-yd="THE TOUR — 30 YD" />
      <section className="section" id="tour">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">2026–27 Season</span>
            <h2>Tour Stops</h2>
            <p>
              One series, coast to coast — timed around high school seasons so
              athletes arrive with fresh film and college coaches are free to
              evaluate.
            </p>
          </div>

          <div className="tour-list">
            {TOUR_STOPS.map((stop) => (
              <a
                className="tour-row"
                href={stop.zortsUrl ?? "#interest"}
                key={stop.number}
              >
                <span className="tour-num">{stop.number}</span>
                <span className="tour-city">
                  {stop.city}
                  <small>{stop.venue}</small>
                </span>
                <span className="tour-date">{stop.date}</span>
                <span className={stop.live ? "tour-tag live" : "tour-tag"}>
                  {stop.tag}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
