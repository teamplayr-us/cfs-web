import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaiverText from "@/components/WaiverText";
import { WAIVER_TITLE } from "@/lib/waiver";
import { CONTACT_EMAIL } from "@/data/links";

export const metadata: Metadata = {
  title: "Participant Waiver | College Flag Showcase Series",
  description:
    "The participant waiver, release of liability, assumption of risk, and media release signed at Showcase Combine & Camp registration.",
  robots: { index: false },
};

export default function WaiverPage() {
  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Showcase Combine &amp; Camp</span>
            <h1 className="reg-title">Participant Waiver</h1>
            <p>{WAIVER_TITLE}. A parent or legal guardian signs this at registration.</p>
          </div>
          <div className="reg-card">
            <WaiverText />
            <p className="reg-fineprint">
              Questions about this waiver? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
