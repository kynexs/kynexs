import { connection } from "next/server";
import { Suspense } from "react";
import {
  getRegistrationStats,
  listRegistrations,
} from "@/actions/registration/admin";
import DashboardPageHeader from "@/components/dashboard/page-header";
import DashboardPageShell from "@/components/dashboard/page-shell";
import StatCardsSkeleton from "@/components/dashboard/stat-cards-skeleton";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { can } from "@/services/auth/permissions";
import { requireSession } from "@/services/auth/session";
import RegistrationsTable from "./features/registrations-table";
import RegistrationSummaryCards from "./features/summary-cards";

export default function RegistrationPage() {
  return (
    <DashboardPageShell className="space-y-8">
      <DashboardPageHeader
        heading="Registration"
        description="Review squads, payment slips, and player details. Delete only when you are sure — the slip file is removed from storage too."
      />

      <Suspense
        fallback={
          <StatCardsSkeleton
            count={4}
            className="sm:grid-cols-2 xl:grid-cols-4"
          />
        }
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
  const stats = await getRegistrationStats();
  return <RegistrationSummaryCards stats={stats} />;
}

async function TableSection() {
  await connection();
  const session = await requireSession();
  const registrations = await listRegistrations();
  return (
    <RegistrationsTable
      data={registrations}
      canDelete={can(session, "registration:delete")}
    />
  );
}
