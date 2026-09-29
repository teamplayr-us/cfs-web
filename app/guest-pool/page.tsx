import type { Metadata } from "next";
import { cookies } from "next/headers";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GuestPoolSignIn from "@/components/GuestPoolSignIn";
import { stopLabel } from "@/data/events";
import { CONTACT_EMAIL } from "@/data/links";
import {
  coachAccess,
  GuestPlayer,
  guestPool,
  SESSION_COOKIE,
  verifyToken,
} from "@/lib/guestPool";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Guest Player Pool | College Flag Showcase Series",
  robots: { index: false },
};

interface Props {
  searchParams: { expired?: string };
}

function contactHref(p: GuestPlayer, orgs: string[], city: string) {
  const subject = `Guest player spot for ${p.name} — ${city} tournament`;
  const body = `Hi ${p.guardianName.split(" ")[0] || "there"},\n\nI coach ${orgs.join(" / ")} and found ${p.name} in the College Flag Showcase guest player pool for ${city}. We'd like to talk about adding ${p.name.split(" ")[0]} to our roster as a guest player.\n\n`;
  return `mailto:${p.guardianEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default async function GuestPoolPage({ searchParams }: Props) {
  const email = verifyToken(cookies().get(SESSION_COOKIE)?.value);
  const access = email ? await coachAccess(email).catch(() => null) : null;

  if (!access) {
    return (
      <>
        <Nav />
        <section className="section reg-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">For Registered Team Coaches</span>
              <h1 className="reg-title">Guest Player Pool</h1>
              <p>
                Athletes without a tournament team join the guest player pool
                for free. Club coaches of registered tournament teams
                can browse the pool here and contact families directly.
                Families: <a href="/guest-players">join the pool here</a>.
              </p>
            </div>
            <GuestPoolSignIn expired={searchParams.expired === "1"} />
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const pools = await Promise.all(
    access.events.map(async (event) => ({
      event,
      players: await guestPool(event.slug).catch(() => [] as GuestPlayer[]),
    })),
  );

  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">{access.orgs.join(" · ")}</span>
            <h1 className="reg-title">Guest Player Pool</h1>
            <p>
              Athletes without a tournament team who joined the pool.
              Reach out to the family directly to talk about a roster spot.
              Listing is free; if you select a guest player, you may ask the
              family to contribute toward your tournament registration fee.
            </p>
          </div>

          {pools.length === 0 && (
            <div className="reg-card">
              <p className="reg-fineprint">
                Your team isn&apos;t linked to an event yet. Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
                we&apos;ll sort it out.
              </p>
            </div>
          )}

          {pools.map(({ event, players }) => (
            <div key={event.slug} className="pool-event">
              <p className="reg-step-kicker">
                {stopLabel(event)} — {event.city} · {players.length} guest
                player{players.length === 1 ? "" : "s"}
              </p>
              {players.length === 0 ? (
                <div className="reg-card">
                  <p className="reg-fineprint">
                    No guest players yet. New athletes appear here as they
                    register and opt in, so check back.
                  </p>
                </div>
              ) : (
                <div className="pool-grid">
                  {players.map((p) => (
                    <article key={p.id} className="pool-card">
                      <div className="pool-card-top">
                        <span>{p.division}</span>
                        {p.gradYear && <span>Class of {p.gradYear}</span>}
                      </div>
                      {p.campRegistered && (
                        <span className="pool-badge">
                          Registered for the Combine &amp; Camp
                        </span>
                      )}
                      <h2 className="pool-name">{p.name}</h2>
                      <dl className="pool-facts">
                        {p.positions && (
                          <div>
                            <dt>Positions</dt>
                            <dd>{p.positions}</dd>
                          </div>
                        )}
                        {p.hometown && (
                          <div>
                            <dt>Hometown</dt>
                            <dd>{p.hometown}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Club</dt>
                          <dd>{p.club || "None listed"}</dd>
                        </div>
                        <div>
                          <dt>Parent / guardian</dt>
                          <dd>
                            {p.guardianName}
                            {p.guardianPhone && (
                              <>
                                <br />
                                <a href={`tel:${p.guardianPhone}`}>
                                  {p.guardianPhone}
                                </a>
                              </>
                            )}
                            {p.guardianEmail && (
                              <>
                                <br />
                                <a href={`mailto:${p.guardianEmail}`}>
                                  {p.guardianEmail}
                                </a>
                              </>
                            )}
                          </dd>
                        </div>
                      </dl>
                      <div className="pool-actions">
                        {p.guardianEmail && (
                          <a
                            className="btn btn-red"
                            href={contactHref(p, access.orgs, event.city.split(",")[0])}
                          >
                            Contact Family
                          </a>
                        )}
                        {p.fffProfile && (
                          <a
                            className="btn btn-ghost"
                            href={p.fffProfile}
                            target="_blank"
                            rel="noopener"
                          >
                            FFF Profile
                          </a>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          ))}

          <p className="reg-fineprint pool-foot">
            Signed in as {access.email}.{" "}
            <a href="/api/guest-pool/logout">Sign out</a>. Please use this
            information only to recruit guest players for your tournament
            roster. Questions or concerns: {CONTACT_EMAIL}.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
