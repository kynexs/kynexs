import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  description,
  icon,
  valueClassName,
}: {
  title: string;
  value: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  valueClassName?: string;
}) {
  return (
    <Card className="bg-surface-100/80">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="font-heading text-xs font-semibold tracking-[0.2em] text-lime uppercase">
            {title}
          </CardDescription>
          {icon ? <span className="text-muted-foreground">{icon}</span> : null}
        </div>
        <CardTitle
          className={cn(
            "font-display font-extrabold tracking-tight",
            valueClassName ?? "text-4xl",
          )}
        >
          {value}
        </CardTitle>
      </CardHeader>
      {description != null ? <CardContent>{description}</CardContent> : null}
    </Card>
  );
}
