import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CoachRegistrationForm from "@/components/CoachRegistrationForm";
import { EVENTS, stopLabel } from "@/data/events";

export const metadata: Metadata = {
  title: "Coach Credentials | College Flag Showcase Series",
  description:
    "Free sideline credentials for college flag football coaches — expected participant counts and combine data access at every event.",
  robots: { index: false },
};

export default function CoachRegisterPage() {
  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">College Coaches</span>
            <h1 className="reg-title">Get Sideline Credentials</h1>
            <p>
              Credentials are free for college programs. Pick your events and
              we&apos;ll confirm credentials, participant counts, and combine
              data access by email.
            </p>
          </div>

          <CoachRegistrationForm
            events={EVENTS.map((e) => ({
              slug: e.slug,
              label: `${stopLabel(e)} — ${e.city}`,
            }))}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
