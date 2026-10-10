import Reveal from "@/components/common/reveal";
import SectionHeading from "@/components/common/section-heading";
import Container from "@/components/layout/container";
import { fighters } from "@/constants/content";
import FighterCard from "./fighter-card";

export default function Squad() {
  return (
    <section
      id="squad"
      className="relative scroll-mt-20 overflow-hidden py-20 sm:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgb(from var(--color-purple) r g b / 0.22), transparent 65%)",
        }}
      />
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Who's dropping with you"
          title={
            <>
              Squad <span className="text-lime">up.</span>
            </>
          }
          description="Every squad needs its roles. Find yours before registrations open."
        />

        <Reveal delay={150}>
          <div className="-mx-4 mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {fighters.map((fighter, i) => (
              <FighterCard key={fighter.id} fighter={fighter} index={i} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
