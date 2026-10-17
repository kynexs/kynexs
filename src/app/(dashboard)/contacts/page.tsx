import { connection } from "next/server";
import { Suspense } from "react";
import ContactsTable from "@/components/contacts/contacts-table";
import ContactSummaryCards from "@/components/contacts/summary-cards";
import RegistrationsTableSkeleton from "@/components/registration/registrations-table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { can } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { getContactStats, listContacts } from "@/lib/contacts-admin";

export default function ContactsPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-4 pb-8 sm:px-6 lg:px-8 space-y-8">
      <header className="space-y-3">
        <p className="font-heading text-xs font-semibold tracking-[0.3em] text-lime uppercase">  
          Dashboard
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight uppercase sm:text-5xl"> 
          Contacts
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Review inbound messages, mark threads as replied, and remove spam when
          needed.
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
  const stats = await getContactStats();
  return <ContactSummaryCards stats={stats} />;
}

async function TableSection() {
  await connection();
  const [session, contacts] = await Promise.all([
    getSession(),
    listContacts(),
  ]);
  const canDelete = session ? can(session, "contact:delete") : false;
  return <ContactsTable data={contacts} canDelete={canDelete} />;
}

function SummaryCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={`stat-${index + 1}`} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
