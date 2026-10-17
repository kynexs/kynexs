import { connection } from "next/server";
import { Suspense } from "react";
import GamingZonesTable from "@/components/gaming-zones/gaming-zones-table";
import GamingZoneSummaryCards from "@/components/gaming-zones/summary-cards";
import RegistrationsTableSkeleton from "@/components/registration/registrations-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { getGamingZoneStats, listGamingZones } from "@/lib/gaming-zones-admin";

export default function GamingZonesPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-4 pb-8 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-3">
        <p className="font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
          Gaming Zones
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Create gaming zones, share referral codes with partners, and track how
          many squads register through each zone.
        </p>
      </header>

      <Suspense fallback={<SummaryCardsSkeleton />}>
        <SummarySection />
      </Suspense>

      <Suspense fallback={<RegistrationsTableSkeleton />}>
        <TableSection />
      </Suspense>
    </div>
  );
}

async function SummarySection() {
  await connection();
  const stats = await getGamingZoneStats();
  return <GamingZoneSummaryCards stats={stats} />;
}

async function TableSection() {
  await connection();
  const [zones, session] = await Promise.all([listGamingZones(), getSession()]);
  const canDelete = session ? can(session, "gaming-zone:delete") : false;
  return <GamingZonesTable data={zones} canDelete={canDelete} />;
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={`stat-${index + 1}`} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
