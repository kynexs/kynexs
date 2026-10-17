import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GamingZoneStats } from "./types";

export default function GamingZoneSummaryCards({
  stats,
}: {
  stats: GamingZoneStats;
}) {
  const top = stats.topZone;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="bg-surface-100/80">
        <CardHeader className="pb-0">
          <CardDescription className="font-heading text-xs font-semibold tracking-[0.2em] text-lime uppercase">
            Total referred registrations
          </CardDescription>
          <CardTitle className="font-display text-4xl font-extrabold tracking-tight">
            {stats.referredRegistrations}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Squads that signed up with a gaming zone referral code
          </p>
        </CardContent>
      </Card>

      <Card className="bg-surface-100/80">
        <CardHeader className="pb-0">
          <CardDescription className="font-heading text-xs font-semibold tracking-[0.2em] text-lime uppercase">
            Top gaming zone
          </CardDescription>
          {top ? (
            <CardTitle className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {top.zoneName}
            </CardTitle>
          ) : (
            <CardTitle className="font-display text-2xl font-extrabold tracking-tight text-muted-foreground sm:text-3xl">
              —
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          {top ? (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
