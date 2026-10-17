import { connection } from "next/server";
import { Suspense } from "react";
import UsersTable from "@/components/users/users-table";
import { Skeleton } from "@/components/ui/skeleton";
import { requireAdmin } from "@/lib/auth/session";
import { listDashboardUsers } from "@/lib/users-admin";

export default function UsersPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-4 pb-8 sm:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase"> 
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl">
          Users
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Create dashboard accounts and assign admin or user roles.
        </p>
      </header>

      <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
        <UsersSection />
      </Suspense>
    </div>
  );
}

async function UsersSection() {
  await connection();
  await requireAdmin();
  const users = await listDashboardUsers();
  return <UsersTable data={users} />;
}
