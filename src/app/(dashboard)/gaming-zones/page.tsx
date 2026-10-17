import { connection } from "next/server";
import { Suspense } from "react";
import {
  getGamingZoneStats,
  listGamingZones,
} from "@/actions/gaming-zones/admin";
import DashboardPageHeader from "@/components/dashboard/page-header";
import DashboardPageShell from "@/components/dashboard/page-shell";
import StatCardsSkeleton from "@/components/dashboard/stat-cards-skeleton";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { can } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import GamingZonesTable from "./features/gaming-zones-table";
import GamingZoneSummaryCards from "./features/summary-cards";

export default function GamingZonesPage() {
  return (
    <DashboardPageShell className="space-y-8">
      <DashboardPageHeader
        heading="Gaming Zones"
        description="Create gaming zones, share referral codes with partners, and track how many squads register through each zone."
      />

      <Suspense
        fallback={<StatCardsSkeleton count={2} className="sm:grid-cols-2" />}
      >
        <SummarySection />
      </Suspense>

      <Suspense fallback={<DataTableSkeleton />}>
        <TableSection />
      </Suspense>
    </DashboardPageShell>
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
