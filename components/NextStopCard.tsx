import { NEXT_STOP, stopLabel } from "@/data/events";

export default function NextStopCard() {
  return (
    <aside className="stop-card" aria-label="Next tour stop">
      <div className="stop-card-top">
        <span>Next Stop</span>
        <span>{stopLabel(NEXT_STOP)}</span>
      </div>
      <div className="stop-card-body">
        {/* non-breaking spaces keep the city + state on one line, matching the source design */}
        <div className="stop-city">{NEXT_STOP.city.replace(/ /g, "\u00A0")}</div>
        <p className="stop-venue">{NEXT_STOP.venue}</p>
        {NEXT_STOP.details && (
          <dl className="stop-grid">
            <div className="stop-cell">
              <dt>Dates</dt>
              <dd>{NEXT_STOP.details.dates}</dd>
            </div>
            <div className="stop-cell">
              <dt>Divisions</dt>
              <dd>{NEXT_STOP.details.divisions}</dd>
            </div>
            <div className="stop-cell">
              <dt>Team Entry</dt>
              <dd>{NEXT_STOP.details.teamEntry}</dd>
            </div>
            <div className="stop-cell">
              <dt>Reg. Deadline</dt>
              <dd>{NEXT_STOP.details.regDeadline}</dd>
            </div>
          </dl>
        )}
        <a className="btn btn-red" href={`/events/${NEXT_STOP.slug}`}>
          Event Details
        </a>
      </div>
    </aside>
  );
}
