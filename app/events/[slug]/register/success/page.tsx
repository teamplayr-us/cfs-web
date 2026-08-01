import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { EVENTS, getEvent, stopLabel } from "@/data/events";
import { CONTACT_EMAIL } from "@/data/links";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const event = getEvent(params.slug);
  if (!event) return {};
  return {
    title: `You're In — ${event.city} | College Flag Showcase Series`,
    robots: { index: false },
  };
}

export default function RegisterSuccessPage({ params }: Props) {
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
            <h1 className="reg-title">You&apos;re In.</h1>
            <p>
              Registration confirmed for the Showcase Combine &amp; Camp at{" "}
              {event.venue},{" "}
              {event.athleteReg?.combineDate ??
                event.details?.dates ??
                event.date}
              .
            </p>
          </div>
          <div className="reg-card">
            <p className="reg-step-kicker">What happens next</p>
            <ul className="reg-next">
              <li>
                A payment receipt from Stripe is on its way to your email.
              </li>
              <li>
                Check-in details and the event-day schedule arrive by email as
                the event gets closer.
              </li>
              <li>
                Verified combine results are recorded on site — bring your game.
              </li>
            </ul>
            <p className="reg-fineprint">
              Questions in the meantime? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
