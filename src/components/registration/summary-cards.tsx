import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RegistrationStats } from "./types";

const cards = [
  {
    key: "totalRegistrations" as const,
    title: "Total Registrations",
    hint: "All squads in the system",
  },
  {
    key: "withSlip" as const,
    title: "Payment Slips",
    hint: "Registrations with a slip",
  },
  {
    key: "totalPlayers" as const,
    title: "Total Players",
    hint: "Players across all squads",
  },
  {
    key: "withoutSlip" as const,
    title: "Without Payment Slip",
    hint: "Still missing a slip",
  },
];

export default function RegistrationSummaryCards({
  stats,
}: {
  stats: RegistrationStats;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
