import Contact from "@/components/sections/contact";
import Features from "@/components/sections/features";
import Hero from "@/components/sections/hero";
import HowItWorks from "@/components/sections/how-it-works";
import Marquee from "@/components/sections/marquee";
import Squad from "@/components/sections/squad";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <Squad />
      <Contact />
    </>
  );
}
