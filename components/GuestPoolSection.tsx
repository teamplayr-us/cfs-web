/** Event-page callout for the guest player pool (athletes without a
 * tournament team ↔ club coaches of registered teams). */
export default function GuestPoolSection({ city }: { city: string }) {
  return (
    <>
      <hr className="yard" data-yd="GUEST PLAYERS — 25 YD" />
      <section className="section" id="guest-players">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Guest Player Pool</span>
            <h2>
              No Team?
              <br />
              Get Picked Up.
            </h2>
            <p>
              Girls 12U–18U without a tournament team can join the free guest
              player pool for {city}. Club coaches of registered Showcase
              Tournament teams browse the pool and contact families directly
              about a roster spot.
            </p>
          </div>
          <div className="sponsor-cta">
            <div>
              <h3>Free to Join</h3>
              <p>
                No fee to be listed. A team that selects a guest player may ask
                the family to contribute toward its tournament registration
                fee. Coaches of registered teams can browse the pool now.
              </p>
            </div>
            <div className="guest-cta-btns">
              <a className="btn btn-red" href="/guest-players#join">
                Join the Pool
              </a>
              <a className="btn btn-ghost" href="/guest-pool">
                Coaches: Browse
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
