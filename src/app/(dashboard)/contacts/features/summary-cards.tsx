import StatCard from "@/components/dashboard/stat-card";
import type { ContactStats } from "@/types/contact";

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
