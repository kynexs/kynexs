"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function SearchInput({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "aria-label": string;
  className?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={cn("h-10 max-w-sm bg-surface-200", className)}
      aria-label={ariaLabel}
    />
  );
}
