import { connection } from "next/server";
import { Suspense } from "react";
import { getContactStats, listContacts } from "@/actions/contacts/admin";
import DashboardPageHeader from "@/components/dashboard/page-header";
import DashboardPageShell from "@/components/dashboard/page-shell";
import StatCardsSkeleton from "@/components/dashboard/stat-cards-skeleton";
import DataTableSkeleton from "@/components/data-table/data-table-skeleton";
import { can } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import ContactsTable from "./features/contacts-table";
import ContactSummaryCards from "./features/summary-cards";

export default function ContactsPage() {
  return (
    <DashboardPageShell className="space-y-8">
      <DashboardPageHeader
        heading="Contacts"
        description="Review inbound messages, mark threads as replied, and remove spam when needed."
      />

      <Suspense
        fallback={
          <StatCardsSkeleton
            count={3}
            className="sm:grid-cols-2 xl:grid-cols-3"
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
  const stats = await getContactStats();
  return <ContactSummaryCards stats={stats} />;
}

async function TableSection() {
  await connection();
  const [session, contacts] = await Promise.all([getSession(), listContacts()]);
  const canDelete = session ? can(session, "contact:delete") : false;
  return <ContactsTable data={contacts} canDelete={canDelete} />;
}
