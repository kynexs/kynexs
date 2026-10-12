import { connection } from "next/server";
import { Suspense } from "react";
import RegistrationsTable from "@/components/registration/registrations-table";
import RegistrationsTableSkeleton from "@/components/registration/registrations-table-skeleton";
import RegistrationSummaryCards from "@/components/registration/summary-cards";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getRegistrationStats,
  listRegistrations,
} from "@/lib/registrations-admin";

export default function RegistrationPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
          Registrations
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Review squads, payment slips, and player details. Delete only when you
          are sure — the slip file is removed from storage too.
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
  const stats = await getRegistrationStats();
  return <RegistrationSummaryCards stats={stats} />;
}

async function TableSection() {
  await connection();
  const registrations = await listRegistrations();
  return <RegistrationsTable data={registrations} />;
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`stat-${index + 1}`} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
