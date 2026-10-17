"use client";

import { CalendarIcon, XIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DateRangeValue = {
  from?: Date;
  to?: Date;
};

export default function DateRangeFilter({
  value,
  onChange,
  className,
}: {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "h-10 min-w-[220px] justify-start font-normal",
                !value.from && "text-muted-foreground",
              )}
            />
          }
        >
          <CalendarIcon className="size-4" />
          Filter by Date
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={
              value.from || value.to
                ? ({ from: value.from, to: value.to } as DateRange)
                : undefined
            }
            onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
          />
        </PopoverContent>
      </Popover>
      {(value.from || value.to) && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear date range"
          onClick={() => onChange({})}
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}

/** Inclusive local-calendar filter against ISO createdAt strings. */
export function rowInDateRange(
  createdAtIso: string,
  range: DateRangeValue,
): boolean {
  if (!range.from && !range.to) return true;
  const created = new Date(createdAtIso).getTime();
  if (range.from) {
    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    if (created < start.getTime()) return false;
  }
  if (range.to) {
    const end = new Date(range.to);
    end.setHours(23, 59, 59, 999);
    if (created > end.getTime()) return false;
  }
  return true;
}
