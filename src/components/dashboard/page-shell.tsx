import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function DashboardPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-4 pb-8 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
