import { connection } from "next/server";
import { Suspense } from "react";
import { listDashboardUsers } from "@/actions/users/admin";
import DashboardPageHeader from "@/components/dashboard/page-header";
import DashboardPageShell from "@/components/dashboard/page-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/services/auth/session";
import UsersTable from "./features/users-table";

export default function UsersPage() {
  return (
    <DashboardPageShell className="space-y-6">
      <DashboardPageHeader
        className="space-y-2"
        heading="Users"
        description="Create dashboard accounts and assign admin or user roles."
      />

      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <UsersSection />
      </Suspense>
    </DashboardPageShell>
  );
}

async function UsersSection() {
  await connection();
  await requireAdmin();
  const users = await listDashboardUsers();
  return <UsersTable data={users} />;
}
