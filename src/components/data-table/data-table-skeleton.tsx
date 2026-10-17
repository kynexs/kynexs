import { Skeleton } from "@/components/ui/skeleton";

export default function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border">
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`row-${index + 1}`}
              className="flex items-center gap-4 border-b border-border px-3 py-4 last:border-b-0"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="size-10 rounded-md" />
              <Skeleton className="ml-auto size-8 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
