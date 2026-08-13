import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SponsorInterestForm from "@/components/SponsorInterestForm";
import { EVENTS, stopLabel } from "@/data/events";
import { PACKAGE_PARAM } from "@/lib/sponsorInterest";

export const metadata: Metadata = {
  title: "Become a Sponsor | College Flag Showcase Series",
  description:
    "Tell us about your brand and the markets you care about — we'll put a sponsorship package together for the College Flag Showcase Series.",
  openGraph: {
    title: "Become a Sponsor | College Flag Showcase Series",
    description: "Tell us about your brand and the markets you care about — we'll put a sponsorship package together for the College Flag Showcase Series.",
    url: "/sponsors/interest",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  robots: { index: false },
};

interface Props {
  searchParams: { package?: string };
}

export default function SponsorInterestPage({ searchParams }: Props) {
  const defaultPackage = searchParams.package
    ? PACKAGE_PARAM[searchParams.package]
    : undefined;

  return (
    <>
      <Nav />
      <section className="section reg-section">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Series Partners</span>
            <h1 className="reg-title">Become a Sponsor</h1>
            <p>
              Tell us about your brand and the markets you care about —
              we&apos;ll follow up with a package and next steps within two
              business days.
            </p>
          </div>

          <SponsorInterestForm
            events={EVENTS.map((e) => ({
              slug: e.slug,
              label: `${stopLabel(e)} — ${e.city}`,
            }))}
            defaultPackage={defaultPackage}
          />
        </div>
      </section>
      <Footer />
    </>
  );
}
