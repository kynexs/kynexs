"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatAppDate } from "@/lib/format";
import type { ContactRow } from "@/types/contact";

export default function ContactDetailSheet({
  open,
  onOpenChange,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: ContactRow | null;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-y-auto sm:min-w-lg"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-display text-3xl font-extrabold uppercase">
            {contact?.name ?? "Contact"}
          </SheetTitle>
          <SheetDescription>Full contact message and details</SheetDescription>
        </SheetHeader>

        {contact && (
          <div className="flex flex-col gap-6 p-4">
            <dl className="grid gap-3 text-sm">
              <Row label="Contact ID" value={contact.id} mono />
              <Row label="Name" value={contact.name} />
              <Row label="Email" value={contact.email} />
              <Row label="Phone" value={contact.phone?.trim() || "—"} />
              <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
                <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Status
                </dt>
                <dd>
                  <ContactStatusBadge status={contact.status} />
                </dd>
              </div>
              <Row
                label="Created at"
                value={formatAppDate(contact.createdAt)}
              />
            </dl>

            <section className="space-y-3">
              <h3 className="font-heading text-xs font-semibold tracking-[0.25em] text-lime uppercase">
                Message
              </h3>
              <p className="rounded-lg border border-border bg-surface-200/50 p-4 text-sm whitespace-pre-wrap break-words">
                {contact.message}
              </p>
            </section>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ContactStatusBadge({ status }: { status: ContactRow["status"] }) {
  if (status === "REPLIED") {
    return (
      <Badge className="rounded-none font-heading text-[10px] tracking-widest uppercase">
        Replied
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="rounded-none font-heading text-[10px] tracking-widest uppercase"
    >
      Unreplied
    </Badge>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-start">
      <dt className="font-heading text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className={mono ? "break-all font-mono text-xs" : "break-words"}>
        {value}
      </dd>
    </div>
  );
}
