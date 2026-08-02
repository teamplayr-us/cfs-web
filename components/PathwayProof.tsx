import { PATHWAY_FACTS } from "@/data/pathway";

export default function PathwayProof() {
  return (
    <section className="pathway" id="pathway">
      <div className="wrap">
        <p className="pathway-head">
          <span className="eyebrow pathway-eyebrow">The Path Is Real</span>
          College flag football is here — and moving fast.
        </p>
        <div className="pathway-grid">
          {PATHWAY_FACTS.map((fact) => (
            <div className="pathway-card" key={fact.stat}>
              <span className="pathway-stat">{fact.stat}</span>
              <span className="pathway-label">{fact.label}</span>
              <span className="pathway-detail">{fact.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
