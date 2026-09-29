import { WAIVER_SECTIONS, WAIVER_VERSION } from "@/lib/waiver";

/** Renders the full waiver; paragraphs wrapped in ** ** print bold. */
export default function WaiverText() {
  return (
    <div className="waiver-text">
      {WAIVER_SECTIONS.map((s) => (
        <section key={s.heading}>
          <h3>{s.heading}</h3>
          {s.body.map((p, i) =>
            p.startsWith("**") && p.endsWith("**") ? (
              <p key={i}>
                <strong>{p.slice(2, -2)}</strong>
              </p>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </section>
      ))}
      <p className="waiver-version">Version {WAIVER_VERSION}</p>
    </div>
  );
}
