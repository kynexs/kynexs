import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function StatCardsSkeleton({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={`stat-${index + 1}`} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
