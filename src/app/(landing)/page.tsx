import Contact from "@/components/sections/contact";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Marquee from "@/components/sections/marquee";
import Sponsors from "@/components/sections/sponsors";
import Squad from "@/components/sections/squad";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Sponsors />
      <Features />
      <HowItWorks />
      <Squad />
      <Contact />
    </>
  );
}
