import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TeamInviteForm from "@/components/TeamInviteForm";
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
  return {
    title: `Request a Team Invite — ${event.city} | College Flag Showcase Series`,
    description: `The Showcase Tournament is invite-only. Tell us about your program to request an invite for ${event.city} (${stopLabel(event)}).`,
    robots: { index: false },
  };
}

export default function TeamInvitePage({ params }: Props) {
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
            <h1 className="reg-title">Request a Team Invite</h1>
            <p>
              The Showcase Tournament is invite-only — a curated field so
              you&apos;re competing at the highest levels. Tell us about your
              program and we&apos;ll follow up by email.
            </p>
          </div>

          <TeamInviteForm
            events={EVENTS.map((e) => ({
              slug: e.slug,
              label: `${stopLabel(e)} — ${e.city}`,
            }))}
            defaultEventSlug={event.slug}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
