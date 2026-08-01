import { EVENTS } from "@/data/events";

interface Props {
  /** When set (on event pages), hides that stop and renders the compact
   * "More Tour Stops" variant without the series lede. */
  excludeSlug?: string;
}

export default function TourStops({ excludeSlug }: Props) {
  const events = excludeSlug
    ? EVENTS.filter((event) => event.slug !== excludeSlug)
    : EVENTS;

  return (
    <>
      <hr className="yard" data-yd="THE TOUR — 40 YD" />
      <section className="section" id="tour">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">2026–27 Season</span>
            <h2>{excludeSlug ? "More Tour Stops" : "Tour Stops"}</h2>
            {!excludeSlug && (
              <p>
                One series, coast to coast — timed around high school seasons
                so athletes arrive with fresh film and college coaches are free
                to evaluate.
              </p>
            )}
          </div>

          <div className="tour-list">
            {events.map((event) => (
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
