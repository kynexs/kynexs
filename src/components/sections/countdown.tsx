"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { formatLaunch } from "@/lib/countdown";
import { cn } from "@/lib/utils";

const UNITS = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown({
  target,
  size = "lg",
  className,
}: {
  target: string;
  size?: "lg" | "sm";
  className?: string;
}) {
  const time = useCountdown(target);
  const label = formatLaunch(target);

  if (time?.done) {
    return (
      <output
        className={cn(
          "block font-display text-3xl font-extrabold tracking-wide text-lime uppercase",
          className,
        )}
      >
        Today is the match date
      </output>
    );
  }

  return (
    <div className={className}>
      <div
        role="timer"
        aria-label={`Time until registrations open${label ? `: ${label}` : ""}`}
        className="flex gap-2 sm:gap-3"
      >
        {UNITS.map(({ key, label: unit }, i) => {
          const value = time ? time[key] : null;
          return (
            <div
              key={key}
              className="chamfer-sm relative bg-gradient-to-b from-white/25 to-white/5 p-px"
            >
              <div
                className={cn(
                  "chamfer-sm flex flex-col items-center bg-surface-100/95 backdrop-blur",
                  size === "lg"
                    ? "min-w-[64px] px-3 pt-3 pb-2 sm:min-w-[92px] sm:px-5 sm:pt-4 sm:pb-3"
                    : "min-w-[56px] px-3 pt-2.5 pb-2",
                )}
              >
                <span
                  key={value ?? "init"}
                  className={cn(
                    "block overflow-hidden font-display leading-none font-extrabold tabular-nums",
                    size === "lg" ? "text-4xl sm:text-6xl" : "text-3xl",
                    i === 3 ? "text-lime" : "text-white",
                    value !== null && "animate-tick",
                  )}
                >
                  {value === null ? "--" : pad(value)}
                </span>
                <span className="mt-1.5 font-heading text-[9px] font-semibold tracking-[0.25em] text-text-muted uppercase sm:text-[10px]">
                  {unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {label && (
        <p className="mt-3 font-heading text-[11px] tracking-[0.25em] text-text-muted uppercase">
          Registrations open {label}
        </p>
      )}
    </div>
  );
}
