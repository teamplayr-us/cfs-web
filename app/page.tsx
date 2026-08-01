import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CoreOffering from "@/components/CoreOffering";
import WhyDifferent from "@/components/WhyDifferent";
import TourStops from "@/components/TourStops";
import Sponsors from "@/components/Sponsors";
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
      <Sponsors />
      <InterestCTA />
      <Footer />
    </>
  );
}
