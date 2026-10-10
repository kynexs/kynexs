"use client";

import type { ReactNode } from "react";
import { usePointerVars } from "@/hooks/usePointerVars";
import { cn } from "@/lib/utils";

export default function ChamferCard({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const pointer = usePointerVars<HTMLDivElement>();
  return (
    <div className={cn("group chamfer relative bg-white/10 p-px", className)}>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-lime via-purple to-purple opacity-0 transition-opacity duration-normal group-hover:opacity-100"
      />
      <div
        {...pointer}
        className={cn(
          "spotlight chamfer relative h-full bg-surface-200 transition-colors duration-normal group-hover:bg-surface-300",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
