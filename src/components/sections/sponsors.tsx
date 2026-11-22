import Image from "next/image";
import SectionHeading from "@/components/common/section-heading";
import Container from "@/components/layout/container";
import { sponsors } from "@/constants/content";

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative scroll-mt-20 py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Partners"
          title={
            <>
              Our <span className="text-lime">sponsors</span>
            </>
          }
          description="Backed by partners who keep Karachi competing."
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-6">
          {sponsors.map((sponsor) => (
            <li key={sponsor.name}>
              <a
                href={sponsor.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full min-h-36 flex-col items-center justify-center gap-4 border border-white/10 bg-surface-200/50 px-6 py-8 transition-colors hover:border-lime/40 hover:bg-lime/5"
              >
                <Image
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  width={sponsor.width}
                  height={sponsor.height}
                  className="h-16 w-auto max-w-[220px] object-contain"
                />
                <span className="font-heading text-xs font-semibold tracking-[0.25em] text-text-muted uppercase">
                  {sponsor.name}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
