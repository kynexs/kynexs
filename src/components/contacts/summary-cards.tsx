import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ContactStats } from "./types";

const cards = [
  {
    key: "total" as const,
    title: "Total contacts",
    hint: "All messages in the system",
  },
  {
    key: "today" as const,
    title: "Today's contacts",
    hint: "Submitted today (Karachi time)",
  },
  {
    key: "replied" as const,
    title: "Replied contacts",
    hint: "Marked as replied",
  },
];

export default function ContactSummaryCards({
  stats,
}: {
  stats: ContactStats;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key} className="bg-surface-100/80">
          <CardHeader className="pb-0">
            <CardDescription className="font-heading text-xs font-semibold tracking-[0.2em] text-lime uppercase">
              {card.title}
            </CardDescription>
            <CardTitle className="font-display text-4xl font-extrabold tracking-tight">
              {stats[card.key]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{card.hint}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
