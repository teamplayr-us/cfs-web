import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AthleteInterestForm from "@/components/AthleteInterestForm";
import { EVENTS } from "@/data/events";

const DESCRIPTION =
  "Not ready to register? Tell us about your athlete and we'll keep you posted on dates, deadlines, and new College Flag Showcase Series events.";

export const metadata: Metadata = {
  title: "Get on the List | College Flag Showcase Series",
  description: DESCRIPTION,
  openGraph: {
    title: "Get on the List | College Flag Showcase Series",
    description: DESCRIPTION,
    url: "/interest",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function InterestPage() {
  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Athletes &amp; Families</span>
            <h1 className="reg-title">Get on the List</h1>
            <p>
              Not ready to register? Tell us who you are and where you play,
              and we&apos;ll keep you posted on dates, deadlines, and new
              events. No obligation.
            </p>
          </div>

          <AthleteInterestForm
            events={EVENTS.map((e) => ({ slug: e.slug, label: e.city }))}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
