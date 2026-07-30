import { EVENTS } from "@/data/events";

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
            {EVENTS.map((event) => (
              <a
                className="tour-row"
                href={`/events/${event.slug}`}
                key={event.slug}
              >
                <span className="tour-num">{event.number}</span>
                <span className="tour-city">
                  {event.city}
                  <small>{event.venue}</small>
                </span>
                <span className="tour-date">{event.date}</span>
                <span className={event.live ? "tour-tag live" : "tour-tag"}>
                  {event.tag}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
