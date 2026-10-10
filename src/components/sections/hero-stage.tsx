"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import Icon from "@/components/common/icon";
import { fighterById } from "@/constants/content";
import { useStageParallax } from "@/hooks/useStageParallax";
import { cn } from "@/lib/utils";

type Layer = CSSProperties & Record<`--${string}`, string>;

const layer = (dx: number, dy: number, z: number): Layer => ({
  "--dx": `${dx}px`,
  "--dy": `${dy}px`,
  "--z": `${z}px`,
});

const operator = fighterById("operator");
const trooper = fighterById("trooper");
const scout = fighterById("scout");

const shards = [
  {
    pos: "left-[6%] top-[14%] h-6 w-6",
    color: "bg-lime",
    z: 210,
    dx: 46,
    dy: 30,
    delay: "0s",
    clip: "polygon(50% 0,100% 100%,0 100%)",
  },
  {
    pos: "right-[10%] top-[8%] h-9 w-9",
    color: "bg-purple",
    z: 170,
    dx: -38,
    dy: 26,
    delay: "-2s",
    clip: "polygon(0 0,100% 20%,70% 100%)",
  },
  {
    pos: "right-[4%] top-[48%] h-5 w-5",
    color: "bg-lime",
    z: 230,
    dx: -54,
    dy: -20,
    delay: "-4s",
    clip: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
  },
  {
    pos: "left-[2%] bottom-[34%] h-8 w-8",
    color: "bg-purple",
    z: 190,
    dx: 40,
    dy: -26,
    delay: "-1s",
    clip: "polygon(0 0,100% 0,50% 100%)",
  },
  {
    pos: "left-[44%] top-[2%] h-4 w-4",
    color: "bg-lime",
    z: 250,
    dx: 20,
    dy: 40,
    delay: "-3s",
    clip: "polygon(50% 0,100% 100%,0 100%)",
  },
];

export default function HeroStage() {
  const ref = useStageParallax<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="stage relative mx-auto aspect-[4/5] w-full max-w-[560px] animate-rise sm:aspect-square lg:aspect-[5/6] lg:max-w-none"
      style={{ animationDelay: "calc(var(--intro) + 350ms)" }}
    >
      <div className="stage-tilt absolute inset-0">
        <div className="stage-idle absolute inset-0 [@media(hover:none)]:animate-sway">
          <div
            className="depth-layer absolute inset-[4%] rounded-full border border-white/10"
            style={{
              ...layer(-10, -6, -150),
              background:
                "radial-gradient(circle at 50% 45%, rgb(from var(--color-purple) r g b / 0.65), rgb(from var(--color-purple) r g b / 0.12) 55%, transparent 72%)",
            }}
          />
          <div
            className="depth-layer absolute inset-0 flex items-center justify-center"
            style={layer(-16, -10, -110)}
          >
            <Image
              src="/images/kyneks-icon.webp"
              width={422}
              height={450}
              alt=""
              className="w-[62%] opacity-[0.09]"
            />
          </div>
          <div
            className="depth-layer absolute inset-[-2%]"
            style={layer(-6, -4, -70)}
          >
            <svg
              viewBox="0 0 400 400"
              className="h-full w-full animate-spin-slow"
              aria-hidden="true"
            >
              <circle
                cx="200"
                cy="200"
                r="196"
                fill="none"
                stroke="rgb(from var(--color-lime) r g b / 0.35)"
                strokeWidth="1"
                strokeDasharray="2 10"
              />
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="60 20 6 20"
              />
              <path
                d="M200 4v14M200 382v14M4 200h14M382 200h14"
                stroke="var(--color-lime)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div
            className="depth-layer absolute inset-x-[10%] bottom-[-2%] h-[12%] rounded-[50%] blur-2xl"
            style={{
              ...layer(0, 0, 10),
              background:
                "radial-gradient(ellipse, rgb(from var(--color-lime) r g b / 0.45), transparent 70%)",
            }}
          />

          <div
            className="depth-layer absolute bottom-[3%] left-[-3%] w-[42%]"
            style={layer(-26, -8, 50)}
          >
            <div className="animate-float drop-shadow-[0_0_28px_rgb(from_var(--color-purple)_r_g_b_/_0.7)] [animation-delay:-3s] [animation-duration:7s]">
              <Image
                src={trooper.src}
                width={trooper.width}
                height={trooper.height}
                alt=""
                priority
                sizes="(min-width:1024px) 220px, 40vw"
                className="mask-fade-b h-auto w-full"
              />
            </div>
          </div>
          <div
            className="depth-layer absolute right-[-3%] bottom-[5%] w-[44%]"
            style={layer(30, -10, 70)}
          >
            <div className="animate-float drop-shadow-[0_0_28px_rgb(from_var(--color-lime)_r_g_b_/_0.35)] [animation-delay:-1s] [animation-duration:8s]">
              <Image
                src={scout.src}
                width={scout.width}
                height={scout.height}
                alt=""
                priority
                sizes="(min-width:1024px) 240px, 42vw"
                className="mask-fade-b h-auto w-full"
              />
            </div>
          </div>
          <div
            className="depth-layer absolute bottom-0 left-[19%] w-[62%]"
            style={layer(16, 8, 120)}
          >
            <Image
              src={operator.src}
              width={operator.width}
              height={operator.height}
              alt="KYNEKS operator character skydiving into the arena"
              priority
              sizes="(min-width:1024px) 360px, 60vw"
              className="h-auto w-full animate-float drop-shadow-[0_0_40px_rgb(from_var(--color-lime)_r_g_b_/_0.3)]"
            />
          </div>

          {shards.map((shard) => (
            <div
              key={shard.pos}
              className={cn("depth-layer absolute", shard.pos)}
              style={layer(shard.dx, shard.dy, shard.z)}
            >
              <div
                className={cn(
                  "h-full w-full animate-float opacity-90",
                  shard.color,
                )}
                style={{
                  clipPath: shard.clip,
                  animationDelay: shard.delay,
                  animationDuration: `${5 + shards.indexOf(shard)}s`,
                }}
              />
            </div>
          ))}

          <div
            className="depth-layer absolute top-[22%] left-[2%]"
            style={layer(48, 22, 190)}
          >
            <div className="glass flex items-center gap-2 border border-white/15 px-3 py-2 font-heading text-[10px] font-semibold tracking-[0.2em] text-white uppercase sm:text-xs">
              <Icon name="crosshair" className="size-4 text-lime" />
              Battle royale
            </div>
          </div>
          <div
            className="depth-layer absolute right-[1%] bottom-[26%]"
            style={layer(-44, -18, 200)}
          >
            <div className="glass flex items-center gap-2 border border-lime/40 px-3 py-2 font-heading text-[10px] font-semibold tracking-[0.2em] text-lime uppercase sm:text-xs">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-lime" />
                <span className="relative inline-flex size-2 rounded-full bg-lime" />
              </span>
              Squad up
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
