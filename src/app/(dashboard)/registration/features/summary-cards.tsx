import StatCard from "@/components/dashboard/stat-card";
import type { RegistrationStats } from "@/types/registration";

const cards = [
  {
    key: "totalRegistrations" as const,
    title: "Total Registrations",
    hint: "All registrations in the system",
  },
  {
    key: "totalPlayers" as const,
    title: "Total Players",
    hint: "Players across all registrations",
  },
  {
    key: "squadCount" as const,
    title: "Squad Registrations",
    hint: "Full squad sign-ups",
  },
  {
    key: "individualCount" as const,
    title: "Individual Registrations",
    hint: "Solo player sign-ups",
  },
  {
    key: "withSlip" as const,
    title: "Payment Slips",
    hint: "Registrations with a slip",
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
        <StatCard
          key={card.key}
          title={card.title}
          value={stats[card.key]}
          description={
            <p className="text-sm text-muted-foreground">{card.hint}</p>
          }
        />
      ))}
    </div>
  );
}
