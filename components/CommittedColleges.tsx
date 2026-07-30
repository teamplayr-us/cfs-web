import { COLLEGE_SLOTS } from "@/data/colleges";

export default function CommittedColleges() {
  return (
    <section className="colleges section" id="colleges">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>
            On the Sideline
          </span>
          <h2>Committed Colleges</h2>
          <p>
            Programs confirmed to attend and evaluate. This board updates as
            college coaches register for each stop.
          </p>
        </div>

        <div className="college-grid" aria-label="Committed college programs">
          {COLLEGE_SLOTS.map((slot, i) => (
            <div
              className={slot.filled ? "college-slot filled" : "college-slot"}
              key={i}
            >
              {slot.filled ? (
                <span>{slot.name}</span>
              ) : (
                <span>
                  College logo
                  <br />
                  announcing soon
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="colleges-note">
          <p>
            Coaching a college flag football program? Registration is free for
            college coaches — get expected participant counts, combine data
            access, and sideline credentials.
          </p>
          <a className="btn btn-ghost-light" href="#interest">
            Register as a Coach
          </a>
        </div>
      </div>
    </section>
  );
}
