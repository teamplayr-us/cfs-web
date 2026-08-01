import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CoreOffering from "@/components/CoreOffering";
import WhyDifferent from "@/components/WhyDifferent";
import TourStops from "@/components/TourStops";
import CommittedColleges from "@/components/CommittedColleges";
import Sponsors from "@/components/Sponsors";
import { allParticipatingColleges } from "@/data/colleges";
import InterestCTA from "@/components/InterestCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <CoreOffering />
      <WhyDifferent />
      <TourStops />
      <CommittedColleges
        slots={allParticipatingColleges()}
        title="Participating Colleges"
        lede="Programs confirmed to attend and evaluate on the tour. This board updates as college coaches register for each stop."
      />
      <Sponsors />
      <InterestCTA />
      <Footer />
    </>
  );
}
