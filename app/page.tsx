import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CoreOffering from "@/components/CoreOffering";
import TourStops from "@/components/TourStops";
import CommittedColleges from "@/components/CommittedColleges";
import Sponsors from "@/components/Sponsors";
import InterestCTA from "@/components/InterestCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <CoreOffering />
      <TourStops />
      <CommittedColleges />
      <Sponsors />
      <InterestCTA />
      <Footer />
    </>
  );
}
