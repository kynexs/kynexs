"use client";

import Icon from "@/components/common/icon";
import SectionHeading from "@/components/common/section-heading";
import Container from "@/components/layout/container";
import { steps } from "@/constants/content";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

export default function HowItWorks() {
  const { ref, inView } = useInView<HTMLOListElement>({ threshold: 0.25 });

  return (
    <section id="how" className="relative scroll-mt-20 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              Five steps to <span className="text-lime">the drop</span>
            </>
          }
          description="From sign-up to leaderboard. No paperwork, no waiting around."
        />

        <ol
          ref={ref}
          className="relative mt-16 grid gap-10 lg:grid-cols-5 lg:gap-6"
        >
          <span
            aria-hidden="true"
            className="absolute top-7 left-[27px] h-[calc(100%-56px)] w-px bg-white/10 lg:top-7 lg:right-7 lg:left-7 lg:h-px lg:w-auto"
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-7 left-[27px] h-[calc(100%-56px)] w-px origin-top bg-gradient-to-b from-purple to-lime shadow-glow-lime transition-transform duration-[1800ms] ease-[cubic-bezier(0.65,0,0.35,1)]",
              "lg:top-7 lg:right-7 lg:left-7 lg:h-px lg:w-auto lg:origin-left lg:bg-gradient-to-r",
              inView
                ? "scale-y-100 lg:scale-x-100 lg:scale-y-100"
                : "scale-y-0 lg:scale-x-0 lg:scale-y-100",
            )}
          />

          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex gap-5 lg:flex-col lg:gap-6"
            >
              <span
                className={cn(
                  "relative z-10 flex size-14 shrink-0 items-center justify-center border bg-background transition-all duration-500",
                  inView
                    ? "border-lime text-lime shadow-glow-lime"
                    : "border-white/15 text-white/40",
                )}
                style={{
                  transitionDelay: inView ? `${300 + i * 330}ms` : "0ms",
                }}
              >
                <Icon name={step.icon} className="size-6" />
              </span>
              <div
                className={cn(
                  "transition-all duration-700 ease-out",
                  inView
                    ? "translate-y-0 opacity-100"
                    : "translate-y-5 opacity-0",
                )}
                style={{
                  transitionDelay: inView ? `${300 + i * 330}ms` : "0ms",
                }}
              >
                <p className="text-outline font-display text-5xl leading-none font-extrabold opacity-40 [-webkit-text-stroke-width:1px]">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-wide uppercase">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
