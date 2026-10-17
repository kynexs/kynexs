import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DashboardPageHeader({
  title = "Dashboard",
  heading,
  description,
  action,
  className,
}: {
  title?: string;
  heading: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  const copy = (
    <>
      <p className="font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">
        {title}
      </p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
        {heading}
      </h1>
      <p className="max-w-2xl text-muted-foreground">{description}</p>
    </>
  );

  return (
    <header className={cn(className ?? "space-y-3")}>
      {action ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">{copy}</div>
          <div className="shrink-0">{action}</div>
        </div>
      ) : (
        copy
      )}
    </header>
  );
}
