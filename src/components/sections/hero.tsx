import type { CSSProperties } from "react";
import Icon from "@/components/common/icon";
import Container from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";
import Countdown from "./countdown";
import HeroStage from "./hero-stage";
import RegisterButton from "./register-button";

const enter = (ms: number): CSSProperties => ({
  animationDelay: `calc(var(--intro) + ${ms}ms)`,
});

const outlineCta = cn(
  buttonVariants({
    variant: "outline",
    className:
      "h-12 bg-transparent px-6 font-heading text-sm font-semibold tracking-wide uppercase hover:bg-transparent hover:text-lime sm:h-14 sm:px-8 sm:text-base dark:bg-transparent dark:hover:bg-transparent",
  }),
);

export default function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-24"
      style={{ "--intro": "1.9s" } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] overflow-hidden [mask-image:linear-gradient(to_top,#000_10%,transparent)] [perspective:520px]"
      >
        <div className="absolute inset-x-[-60%] top-0 h-[220%] origin-top [transform:rotateX(68deg)]">
          <div
            className="h-[calc(100%+64px)] animate-grid-flow"
            style={{
              backgroundImage:
                "linear-gradient(rgb(from var(--color-lime) r g b / 0.22) 1px, transparent 1px), linear-gradient(90deg, rgb(from var(--color-lime) r g b / 0.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[34%] -z-10 h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-lime/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-[22%] -z-10 h-[130%] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-purple/60 to-transparent"
      />

      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
          <div>
            <h1 className="mt-6 font-display text-[clamp(6rem,17vw,12.5rem)] leading-[0.78] font-extrabold tracking-tight uppercase">
              <span className="block animate-rise" style={enter(120)}>
                Jump
              </span>
              <span
                className="block animate-rise text-lime drop-shadow-[0_0_28px_rgb(from_var(--color-lime)_r_g_b_/_0.4)]"
                style={enter(240)}
              >
                <span
                  className="inline-block animate-shine bg-[linear-gradient(110deg,var(--color-lime)_42%,#ffffff_50%,var(--color-lime)_58%)] bg-size-[250%_100%] bg-clip-text pr-[0.04em] text-transparent"
                  style={{ animationDelay: "calc(var(--intro) + 1000ms)" }}
                >
                  In.
                </span>
              </span>
            </h1>

            <p
              className="mt-5 flex animate-rise items-center gap-4 font-heading text-sm font-semibold tracking-[0.4em] text-white uppercase sm:text-base"
              style={enter(360)}
            >
              <span className="h-px w-10 bg-lime" aria-hidden="true" />
              Karachi is waiting.
            </p>

            <p
              className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-text-muted"
              style={enter(460)}
            >
              {siteConfig.description}
            </p>

            <div className="mt-9 animate-rise" style={enter(560)}>
              <Countdown target={siteConfig.launchDate} />
            </div>

            <div
              id="join"
              className="mt-9 flex animate-rise flex-col gap-3 sm:flex-row"
              style={enter(680)}
            >
              <RegisterButton />
              <a href="#features" className={outlineCta}>
                See what&apos;s coming
              </a>
            </div>
          </div>

          <HeroStage />
        </div>
      </Container>

      <a
        href="#features"
        aria-label="Scroll to the next section"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition-colors hover:text-lime lg:flex"
      >
        <Icon name="mouse" className="size-6 animate-cue" />
        <span className="font-heading text-[10px] tracking-[0.4em] uppercase">
          Scroll
        </span>
      </a>
    </section>
  );
}
