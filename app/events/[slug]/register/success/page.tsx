import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ClearSavedRegistration from "@/components/ClearSavedRegistration";
import { getEvent, stopLabel } from "@/data/events";
import { CONTACT_EMAIL } from "@/data/links";
import { REFUND_POLICY } from "@/lib/policy";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
  searchParams: { session_id?: string };
}

export function generateMetadata({ params }: Props): Metadata {
  const event = getEvent(params.slug);
  if (!event) return {};
  return {
    title: `You're In — ${event.city} | College Flag Showcase Series`,
    robots: { index: false },
  };
}

/** True only for a real, paid Checkout session for this event. */
async function isPaid(sessionId: string | undefined, slug: string) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !sessionId?.startsWith("cs_")) return false;
  try {
    const s = await new Stripe(key).checkout.sessions.retrieve(sessionId);
    return s.payment_status === "paid" && s.metadata?.eventSlug === slug;
  } catch {
    return false;
  }
}

export default async function RegisterSuccessPage({
  params,
  searchParams,
}: Props) {
  const event = getEvent(params.slug);
  if (!event) notFound();
  const paid = await isPaid(searchParams.session_id, event.slug);
  const reg = event.athleteReg;
  const when = reg?.combineDate ?? event.details?.dates ?? event.date;
  const time =
    reg?.combineStartTime && reg?.combineEndTime
      ? `, ${reg.combineStartTime} – ${reg.combineEndTime}`
      : "";

  if (!paid) {
    return (
      <>
        <Nav />
        <section className="section reg-section">
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">
                {stopLabel(event)} — {event.city}
              </span>
              <h1 className="reg-title">Almost There.</h1>
              <p>
                We couldn&apos;t confirm a payment from this link. If you just
                paid, check your email for the Stripe receipt and our
                confirmation, which arrive within a few minutes.
              </p>
            </div>
            <div className="reg-card">
              <p className="reg-fineprint">
                Nothing in your inbox, or think something went wrong? Email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
                we&apos;ll sort it out. To register, start at the{" "}
                <a href={`/events/${event.slug}/register`}>registration page</a>
                .
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav />
      <ClearSavedRegistration slug={event.slug} />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">
              {stopLabel(event)} — {event.city}
            </span>
            <h1 className="reg-title">You&apos;re In.</h1>
            <p>
              Registration confirmed for the Showcase Combine &amp; Camp at{" "}
              {event.venue}, {when}
              {time}.
            </p>
          </div>
          <div className="reg-card">
            <p className="reg-step-kicker">What happens next</p>
            <ul className="reg-next">
              <li>
                A confirmation email and a Stripe payment receipt are on their
                way to your inbox.
              </li>
              <li>
                Check-in details and the event-day schedule arrive by email as
                the event gets closer.
              </li>
              <li>
                Get her Flag Football Finder profile current before the event
                at{" "}
                <a
                  href="https://www.flagfootballfinder.com"
                  target="_blank"
                  rel="noopener"
                >
                  flagfootballfinder.com
                </a>
                .
              </li>
              <li>
                Verified combine results are recorded on site — bring your game.
              </li>
            </ul>
            <p className="reg-fineprint">
              <b>Cancellations:</b> {REFUND_POLICY}
            </p>
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
