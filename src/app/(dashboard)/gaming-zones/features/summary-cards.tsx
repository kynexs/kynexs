import StatCard from "@/components/dashboard/stat-card";
import type { GamingZoneStats } from "@/types/gaming-zones";

export default function GamingZoneSummaryCards({
  stats,
}: {
  stats: GamingZoneStats;
}) {
  const top = stats.topZone;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <StatCard
        title="Total referred registrations"
        value={stats.referredRegistrations}
        description={
          <p className="text-sm text-muted-foreground">
            Squads that signed up with a gaming zone referral code
          </p>
        }
      />

      <StatCard
        title="Top gaming zone"
        value={top ? top.zoneName : "—"}
        valueClassName={
          top
            ? "text-2xl sm:text-3xl"
            : "text-2xl text-muted-foreground sm:text-3xl"
        }
        description={
          top ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-foreground">
                {top.referralCode}
              </span>
              {" · "}
              {top.count} referral{top.count === 1 ? "" : "s"}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No referred registrations yet. Share referral codes from the table
              below.
            </p>
          )
        }
      />
    </div>
  );
}
