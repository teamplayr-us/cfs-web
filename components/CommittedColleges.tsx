import { CollegeSlot } from "@/data/colleges";

interface Props {
  slots: CollegeSlot[];
  /** "Committed Colleges" (event pages) or "Participating Colleges" (home) */
  title?: string;
  lede?: string;
  /** Where "Register as a Coach" points; the /colleges page overrides this
   * with the coach mailto */
  ctaHref?: string;
}

export default function CommittedColleges({
  slots,
  title = "Committed Colleges",
  lede = "Programs confirmed to attend and evaluate. This board updates as college coaches register for each event.",
  ctaHref = "/colleges",
}: Props) {
  return (
    <section className="colleges section" id="colleges">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>
            On the Sideline
          </span>
          <h2>{title}</h2>
          <p>{lede}</p>
        </div>

        <div className="college-grid" aria-label="Committed college programs">
          {slots.map((slot, i) => (
            <div
              className={
                slot.filled
                  ? slot.logo
                    ? "college-slot filled has-logo"
                    : "college-slot filled"
                  : "college-slot"
              }
              key={i}
            >
              {slot.filled ? (
                slot.logo ? (
                  <>
                    {/* plain img: logo dimensions vary per school */}
                    <img src={slot.logo} alt={`${slot.name} logo`} />
                    <span className="college-name">{slot.name}</span>
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
            Coaching a college flag football program? Recruiter credentials are
            free for college coaches — with expected participant counts and
            combine data access included.
          </p>
          <a className="btn btn-ghost-light" href={ctaHref}>
            Get Recruiter Credentials
          </a>
        </div>
      </div>
    </section>
  );
}
