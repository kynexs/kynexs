import { marqueeItems } from "@/constants/content";
import { cn } from "@/lib/utils";

function keyedHalf(copy: number) {
  const seen = new Map<string, number>();
  return [...marqueeItems, ...marqueeItems].map((text) => {
    const n = (seen.get(text) ?? 0) + 1;
    seen.set(text, n);
    return { text, key: `${copy}-${text}-${n}` };
  });
}

function Track({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  return (
    <div
      className={cn(
        "flex w-max",
        reverse ? "animate-marquee-reverse" : "animate-marquee",
      )}
      aria-hidden="true"
    >
      {[0, 1].map((copy) => (
        <ul key={copy} className="flex shrink-0 items-center">
          {keyedHalf(copy).map((item) => (
            <li key={item.key} className="flex items-center">
              <span
                className={cn(
                  "px-6 font-display text-3xl font-extrabold tracking-wide uppercase sm:text-5xl",
                  outline
                    ? "text-outline [-webkit-text-stroke-width:1.5px] [-webkit-text-stroke-color:rgba(255,255,255,0.55)]"
                    : "text-background",
                )}
              >
                {item.text}
              </span>
              <span
                className={cn(
                  "size-3 rotate-45 sm:size-4",
                  outline ? "bg-lime" : "bg-background",
                )}
              />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <section
      className="relative z-10 -my-2 overflow-hidden py-14 sm:py-20"
      aria-label="Highlights"
    >
      <p className="sr-only">{marqueeItems.join(". ")}.</p>
      <div className="absolute inset-x-[-5%] top-1/2 -translate-y-1/2 rotate-[1.6deg] border-y border-purple/50 bg-purple/20 py-3 backdrop-blur-sm">
        <Track reverse outline />
      </div>
      <div className="relative -ml-[5%] w-[110%] -rotate-[1.6deg] bg-lime py-2.5 shadow-glow-lime">
        <Track />
      </div>
    </section>
  );
}
