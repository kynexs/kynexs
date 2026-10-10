import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "lockup" | "full";
  size?: "sm" | "md" | "lg";
  priority?: boolean;
}

const ICON = { src: "/images/kyneks-icon.webp", width: 422, height: 450 };
const FULL = { src: "/images/kyneks-logo.webp", width: 502, height: 680 };

const iconHeights = { sm: "h-7", md: "h-9", lg: "h-12" } as const;
const wordSizes = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" } as const;
const fullHeights = { sm: "h-24", md: "h-40", lg: "h-64" } as const;

export default function Logo({
  className,
  variant = "lockup",
  size = "md",
  priority,
}: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src={FULL.src}
        width={FULL.width}
        height={FULL.height}
        alt={`${siteConfig.name} - ${siteConfig.tagline}`}
        priority={priority}
        className={cn("w-auto", fullHeights[size], className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={ICON.src}
        width={ICON.width}
        height={ICON.height}
        alt=""
        priority={priority}
        className={cn(
          "w-auto drop-shadow-[0_0_14px_rgba(120,47,255,0.45)]",
          iconHeights[size],
        )}
      />
      <span
        className={cn(
          "font-display text-white leading-none font-extrabold tracking-[0.04em] uppercase",
          wordSizes[size],
        )}
      >
        {siteConfig.name}
      </span>
    </span>
  );
}
