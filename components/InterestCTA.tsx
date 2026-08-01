import { INTEREST_MAILTO } from "@/data/links";

export default function InterestCTA() {
  return (
    <section className="interest section" id="interest">
      <div className="wrap">
        <h2>Interested? Get on the List.</h2>
        <p>
          Not ready to register? Tell us who you are and where you play, and
          we&apos;ll keep you posted on dates, deadlines, and new events. No
          obligation.
        </p>
        <a className="btn" href={INTEREST_MAILTO}>
          Submit Interest
        </a>
      </div>
    </section>
  );
}
