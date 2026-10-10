import Icon from "@/components/common/icon";
import Reveal from "@/components/common/reveal";
import SectionHeading from "@/components/common/section-heading";
import Container from "@/components/layout/container";
import ChamferCard from "@/components/ui/chamfer-card";
import { type Feature, features } from "@/constants/content";
import { cn } from "@/lib/utils";

function BracketArt() {
  const line =
    "fill-none stroke-lime/50 stroke-[2] [stroke-dasharray:240] [stroke-dashoffset:240] transition-[stroke-dashoffset] duration-[1600ms] ease-out [.reveal-in_&]:[stroke-dashoffset:0]";
  const box = "fill-white/4 stroke-white/20";
  return (
    <svg
      viewBox="0 0 360 200"
      className="h-auto w-full max-w-[420px]"
      aria-hidden="true"
    >
      {[8, 48, 124, 164].map((y) => (
        <rect key={y} x="1" y={y} width="92" height="28" className={box} />
      ))}
      {[28, 144].map((y) => (
        <rect key={y} x="134" y={y} width="92" height="28" className={box} />
      ))}
      <rect
        x="268"
        y="86"
        width="91"
        height="28"
        className="fill-lime stroke-lime"
      />
      <text
        x="313"
        y="105"
        textAnchor="middle"
        className="fill-background font-heading text-[11px] font-bold tracking-[0.2em]"
      >
        WINNER
      </text>
      {[
        "M93 22H113V42H134",
        "M93 62H113V42",
        "M93 138H113V158H134",
        "M93 178H113V158",
        "M226 42H247V100H268",
        "M226 158H247V100",
      ].map((d) => (
        <path key={d} d={d} className={line} />
      ))}
    </svg>
  );
}

function FeatureCard({
  feature,
  index,
  className,
}: {
  feature: Feature;
  index: number;
  className?: string;
}) {
  const large = index === 0;
  return (
    <Reveal delay={index * 90} className={cn("h-full", className)}>
      <ChamferCard
        className="h-full"
        innerClassName={cn(
          "flex flex-col p-6 sm:p-8",
          large && "md:flex-row md:items-center md:gap-10",
        )}
      >
        <span
          aria-hidden="true"
          className="text-outline pointer-events-none absolute top-3 right-5 font-display text-7xl font-extrabold opacity-20 [-webkit-text-stroke-width:1px]"
        >
          0{index + 1}
        </span>
        <div
          className={cn(
            "relative flex flex-1 flex-col",
            large && "md:max-w-md",
          )}
        >
          <span className="inline-flex size-12 items-center justify-center border border-lime/30 bg-lime/10 text-lime transition-all duration-normal group-hover:bg-lime group-hover:text-background group-hover:shadow-glow-lime">
            <Icon name={feature.icon} className="size-6" />
          </span>
          <p className="mt-6 font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">
            {feature.kicker}
          </p>
          <h3
            className={cn(
              "mt-2 font-display leading-[0.95] font-extrabold uppercase",
              large ? "text-5xl sm:text-6xl" : "text-4xl",
            )}
          >
            {feature.title}
          </h3>
          <p className="mt-4 text-text-muted">{feature.text}</p>
        </div>
        {large && (
          <div className="relative mt-8 flex flex-1 items-center justify-center md:mt-0">
            <BracketArt />
          </div>
        )}
      </ChamferCard>
    </Reveal>
  );
}

const spanFor = (i: number) =>
  i === 0 ? "md:col-span-2 lg:col-span-4" : "lg:col-span-2";

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="What's coming"
          title={
            <>
              Everything a <span className="text-lime">champion</span> needs
            </>
          }
          description="One home for the whole competition: find it, enter it, play it, win it."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.kicker}
              feature={feature}
              index={i}
              className={spanFor(i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
