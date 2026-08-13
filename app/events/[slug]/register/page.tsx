import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import RegistrationForm from "@/components/RegistrationForm";
import { EVENTS, getEvent, stopLabel } from "@/data/events";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const event = getEvent(params.slug);
  if (!event) return {};
  const title = `Athlete Registration — ${event.city} | College Flag Showcase Series`;
  const description = `Register an athlete for the Showcase Combine & Camp at ${event.city} (${stopLabel(event)}).`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/events/${event.slug}/register`,
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    robots: { index: false },
  };
}

export default function RegisterPage({ params }: Props) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">
              {stopLabel(event)} — {event.city}
            </span>
            <h1 className="reg-title">Athlete Registration</h1>
            <p>
              Showcase Combine &amp; Camp — individual registration, no team
              required. Takes about two minutes.
            </p>
          </div>

          {event.athleteReg?.open ? (
            <RegistrationForm
              eventSlug={event.slug}
              city={event.city}
              stopLabel={stopLabel(event)}
              venue={event.venue}
              dates={
                event.athleteReg.combineDate ??
                event.details?.dates ??
                event.date
              }
              time={
                event.athleteReg.combineStartTime &&
                event.athleteReg.combineEndTime
                  ? `${event.athleteReg.combineStartTime} – ${event.athleteReg.combineEndTime}`
                  : "TBD"
              }
              priceCents={event.athleteReg.priceCents}
            />
          ) : (
            <div className="reg-card">
              <p className="reg-step-kicker">Registration opens soon</p>
              <p className="reg-fineprint">
                Athlete registration for this stop isn&apos;t open yet. Want a
                heads-up when it is?{" "}
                <a href="/#interest">Get on the list</a>.
              </p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
