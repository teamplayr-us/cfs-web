import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/data/links";

export const metadata: Metadata = {
  title: "FAQ | College Flag Showcase Series",
  description:
    "How the College Flag Showcase Series works — answers for athletes and families, teams and clubs, and college coaches. Divisions, pricing, invites, refunds, and more.",
  openGraph: {
    title: "FAQ | College Flag Showcase Series",
    description:
      "How the College Flag Showcase Series works — answers for athletes and families, teams and clubs, and college coaches.",
    url: "/faq",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

interface QA {
  q: string;
  a: string;
}

const GENERAL: QA[] = [
  {
    q: "What is the College Flag Showcase Series?",
    a: "The Girls National Recruiting Series — a verified combine plus a college showcase tournament in one weekend, evaluated in person by college flag football coaches. Ten events across the 2026–27 season, coast to coast.",
  },
  {
    q: "Is the format 5v5 or 7v7?",
    a: "While we understand the college game is 7v7, our competition is 5v5 — that currently aligns with the most common youth travel competition formats and roster structures.",
  },
  {
    q: "Where and when is the first event?",
    a: "Dallas — December 11–13, 2026, at Craig Ranch Sports Complex in McKinney. Combine day is Friday, December 11; the tournament runs Saturday–Sunday. Registration closes November 29.",
  },
  {
    q: "Is college flag football actually real?",
    a: "Very. Flag football debuts at the 2028 Olympics in LA, it's an NCAA Emerging Sport for Women with scholarships live today, Nebraska becomes the first Power Four school with varsity flag in 2028, and 60+ college programs are playing with more added every season.",
  },
  {
    q: "Who runs the series?",
    a: "The series was founded by a team with decades of experience operating premier youth tournaments, delivering elite event weekends, and building sports technology. The first event runs alongside the International Superflag Invitational, which drew 80 teams from three countries in 2025.",
  },
  {
    q: "Can parents and fans attend?",
    a: "Yes — spectators are welcome. A gate fee applies, set by each venue, and posted with each event's details.",
  },
  {
    q: "What's the refund policy?",
    a: "Showcase Tournament (team entry): refund requests must be made at least 21 days before the event; requests inside that window are reviewed case by case. Showcase Combine & Camp (athlete registration): cancellation requests must be made at least 7 days before the event; requests inside that window are reviewed case by case. Events canceled due to circumstances beyond our control receive credit toward future events.",
  },
  {
    q: "Who do I contact with questions?",
    a: `${CONTACT_EMAIL} — athletes, teams, colleges, sponsors, and press all reach us there.`,
  },
];

const FAMILIES: QA[] = [
  {
    q: "Does my daughter need a team to participate?",
    a: "No. The Showcase Combine & Camp is individual, open registration — it's her chance to show what she can do on her own: position drills, skill work, and 1v1s in front of college coaches, with verified combine numbers to back it up. The team tournament is separate and invite-only.",
  },
  {
    q: "What does registration cost?",
    a: "Combine & Camp registration is $175. Athletes whose team is competing in the Showcase Tournament receive $50 off ($125) — your coach's tournament invite includes the discount code.",
  },
  {
    q: 'What does "verified" mean?',
    a: "Her combine numbers are measured by trained staff and on the record — data college coaches can trust, not self-reported times.",
  },
  {
    q: "What ages can participate?",
    a: "Showcase divisions are 12U, 14U, and HS. For recruiting purposes, grad year matters most — coaches at the event are recruiting current and upcoming classes.",
  },
  {
    q: "Will college coaches actually see her?",
    a: "Yes — coaches are credentialed on-site all weekend, watching her compete in skill work and 1v1s at the Combine & Camp and on the sideline for games. Her verified results go into the recruiting package those coaches receive.",
  },
  {
    q: "Does she get her film?",
    a: "Every game is filmed by AI cameras in the full-field view college coaches use to evaluate. Athlete film packages will be available — details and pricing at collegeflagshowcase.com/film.",
  },
];

const TEAMS: QA[] = [
  {
    q: "How does my team get into the Showcase Tournament?",
    a: "The tournament field is invite-only. Request an invite at collegeflagshowcase.com — tell us about your program — and we review every request to keep the field competitive. We reply either way, and selected teams get their invite and private registration link by email.",
  },
  {
    q: "What does team entry include?",
    a: "$550 per team covers your spot in the bracketed Showcase Tournament with a three-game minimum — a curated field, college coaches evaluating from the sideline, and every game filmed for college evaluation.",
  },
  {
    q: "Is the combine included with team entry?",
    a: "The Showcase Combine & Camp is separate, individual registration — each athlete's chance to stand out on her own in front of the coaches. Athletes competing in the Showcase Tournament get $50 off combine registration ($125 instead of $175), and many programs bring their whole roster.",
  },
  {
    q: "What divisions can we enter?",
    a: "Showcase divisions are 12U, 14U, and HS.",
  },
  {
    q: "When will we get the schedule?",
    a: "The weekend runs combine first, tournament after. Detailed agendas and game schedules are confirmed closer to the event.",
  },
];

const COACHES: QA[] = [
  {
    q: "What do recruiter credentials cost?",
    a: "Nothing — credentials are free for college programs at every event in the series.",
  },
  {
    q: "What do credentials include?",
    a: "Sideline access all weekend, expected participant counts before each event you attend, and the athlete recruiting package. A free College Row tent space in the Fan Zone is yours if you want it — just check the box when you register.",
  },
  {
    q: "What's in the athlete recruiting package?",
    a: "Verified combine results — speed, agility, and explosiveness measured by trained staff and on the record — plus each athlete's contact information and academic/athletic profile.",
  },
  {
    q: "Can I talk to athletes and families at the event?",
    a: "Coaches are responsible for ensuring compliance with their respective governing bodies' recruiting rules.",
  },
];

const SECTIONS: Array<{ id: string; eyebrow: string; title: string; items: QA[] }> = [
  { id: "general", eyebrow: "The Series", title: "General & Events", items: GENERAL },
  { id: "athletes", eyebrow: "Get Seen", title: "Athletes & Families", items: FAMILIES },
  { id: "teams", eyebrow: "Invite-Only", title: "Teams & Clubs", items: TEAMS },
  { id: "coaches", eyebrow: "Free Credentials", title: "College Coaches", items: COACHES },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <Nav />

      <header className="hero" id="top">
        <div className="wrap hero-inner">
          <div>
            <span className="hero-badge">Questions &amp; Answers</span>
            <h1 className="event-title">
              How It
              <br />
              <em>Works.</em>
            </h1>
            <p className="hero-tag">
              <strong>Everything families, teams, and coaches ask us</strong> —
              the format, the divisions, the pricing, and how invites work. Not
              here? Email{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </div>
      </header>

      {SECTIONS.map((section, i) => (
        <section className="section faq-section" id={section.id} key={section.id}>
          <div className="wrap">
            <div className="section-head">
              <span className="eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
            </div>
            {section.items.map((item) => (
              <details className="faq-item" key={item.q} open={i === 0 && item === section.items[0]}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
    </>
  );
}
