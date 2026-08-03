import { OrgSlot } from "@/data/organizations";

interface Props {
  slots: OrgSlot[];
  /** Where "Request a Team Invite" points, e.g. /events/mckinney-tx/invite */
  inviteHref: string;
}

export default function CompetingPrograms({ slots, inviteHref }: Props) {
  return (
    <section className="colleges section" id="programs">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>
            On the Field
          </span>
          <h2>Competing Programs</h2>
          <p>
            The travel programs and organizations confirmed for the Showcase
            Tournament. This board updates as teams accept their invites.
          </p>
        </div>

        <div className="college-grid" aria-label="Competing programs">
          {slots.map((slot, i) => (
            <div
              className={
                slot.filled
                  ? slot.logo
                    ? slot.location
                      ? "college-slot filled has-logo has-loc"
                      : "college-slot filled has-logo"
                    : "college-slot filled"
                  : "college-slot"
              }
              key={i}
            >
              {slot.filled ? (
                slot.logo ? (
                  <>
                    {/* plain img: logo dimensions vary per program */}
                    <img src={slot.logo} alt={`${slot.name} logo`} />
                    <span className="college-name">{slot.name}</span>
                    {slot.location && (
                      <span className="college-loc">{slot.location}</span>
                    )}
                  </>
                ) : (
                  <span>{slot.name}</span>
                )
              ) : (
                <span>Announcing soon</span>
              )}
            </div>
          ))}
        </div>

        <div className="colleges-note">
          <p>
            Think your program belongs on this board? The Showcase Tournament
            is invite-only — tell us about your team.
          </p>
          <a className="btn btn-ghost-light" href={inviteHref}>
            Request a Team Invite
          </a>
        </div>
      </div>
    </section>
  );
}
