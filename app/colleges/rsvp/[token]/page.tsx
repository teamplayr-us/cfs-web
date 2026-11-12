import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CoachRsvpForm from "@/components/CoachRsvpForm";
import { findCoachByToken } from "@/lib/coachRsvp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Coach RSVP | College Flag Showcase Series",
  robots: { index: false, follow: false },
};

interface Props {
  params: { token: string };
}

export default async function CoachRsvpPage({ params }: Props) {
  let coach = null;
  try {
    coach = await findCoachByToken(params.token);
  } catch (err) {
    console.error("RSVP page lookup failed", err);
  }

  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">College Flag Showcase – Dallas · Dec 11–13, 2026</span>
            <h1 className="reg-title">Coach RSVP</h1>
            {coach ? (
              <p>
                Coach {coach.first} {coach.last} · {coach.program}. Check the
                events you plan to attend so we can plan for you. All times
                Central.
              </p>
            ) : (
              <p>
                We couldn&apos;t find this RSVP link. Email{" "}
                <a href="mailto:info@collegeflagshowcase.com">
                  info@collegeflagshowcase.com
                </a>{" "}
                and we&apos;ll send you a new one.
              </p>
            )}
          </div>
          {coach && (
            <CoachRsvpForm
              token={params.token}
              firstName={coach.first}
              responded={coach.rsvpAt !== null}
              initial={{
                combine: coach.combine,
                welcome: coach.welcome,
                saturday: coach.saturday,
                sunday: coach.sunday,
                tent: coach.tent,
              }}
            />
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}
