"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/components/registration/data-table-features";
import { formatAppDate } from "@/lib/format";
import ContactRowActions from "./row-actions";
import type { ContactRow } from "./types";

const columnHelper = createColumnHelper<DataTableFeatures, ContactRow>();

function truncateMessage(message: string, max = 72) {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

export function createContactColumns(canDelete: boolean) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      id: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("name", {
      id: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="min-w-32 font-medium">{getValue()}</span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: "Email",
      filterFn: "includesString",
    }),
    columnHelper.accessor("message", {
      id: "message",
      header: "Message",
      cell: ({ getValue }) => (
        <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground">
          {truncateMessage(getValue())}
        </span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        if (status === "REPLIED") {
          return (
            <Badge className="rounded-none font-heading text-[10px] tracking-wider uppercase">
              Replied
            </Badge>
          );
        }
        return (
          <Badge
            variant="outline"
            className="rounded-none font-heading text-[10px] tracking-wider uppercase"
          >
            Unreplied
          </Badge>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Created at",
      cell: ({ getValue }) => formatAppDate(getValue()),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <ContactRowActions contact={row.original} canDelete={canDelete} />
      ),
    }),
  ]);
}
