import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  className?: string;
  opacity?: number;
}

export default function GridBackground({
  className,
  opacity = 0.03,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]",
        "bg-[size:64px_64px]",
        className,
      )}
      style={{ opacity }}
    />
  );
}
