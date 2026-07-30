import { NEXT_STOP } from "@/data/tourStops";

export default function NextStopCard() {
  return (
    <aside className="stop-card" aria-label="Next tour stop">
      <div className="stop-card-top">
        <span>Next Stop</span>
        <span>{NEXT_STOP.stopLabel}</span>
      </div>
      <div className="stop-card-body">
        <div className="stop-city">{NEXT_STOP.city.replace(/ /g, "\u00A0")}</div>
        <p className="stop-venue">{NEXT_STOP.venue}</p>
        <dl className="stop-grid">
          <div className="stop-cell">
            <dt>Dates</dt>
            <dd>{NEXT_STOP.dates}</dd>
          </div>
          <div className="stop-cell">
            <dt>Divisions</dt>
            <dd>{NEXT_STOP.divisions}</dd>
          </div>
          <div className="stop-cell">
            <dt>Team Entry</dt>
            <dd>{NEXT_STOP.teamEntry}</dd>
          </div>
          <div className="stop-cell">
            <dt>Reg. Deadline</dt>
            <dd>{NEXT_STOP.regDeadline}</dd>
          </div>
        </dl>
        <a className="btn btn-red" href="#interest">
          Event Details
        </a>
      </div>
    </aside>
  );
}
