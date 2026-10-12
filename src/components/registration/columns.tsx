"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "./data-table-features";
import RegistrationRowActions from "./row-actions";
import SlipThumbnail from "./slip-thumbnail";
import type { RegistrationRow } from "./types";

const columnHelper = createColumnHelper<DataTableFeatures, RegistrationRow>();

export const columns = columnHelper.columns([
  columnHelper.accessor("id", {
    id: "id",
    header: "Registration ID",
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
    ),
    filterFn: "includesString",
  }),
  columnHelper.accessor("contactName", {
    id: "contactName",
    header: "Registration Name",
    cell: ({ row, getValue }) => (
      <div className="min-w-40">
        <p className="font-medium">{getValue()}</p>
        <p className="text-xs text-muted-foreground">{row.original.teamName}</p>
      </div>
    ),
    filterFn: "includesString",
  }),
  columnHelper.accessor("contactWhatsapp", {
    id: "contactWhatsapp",
    header: "Phone Number",
  }),
  columnHelper.display({
    id: "slip",
    header: "Payment Slip",
    cell: ({ row }) => <SlipThumbnail receipt={row.original.receipt} />,
  }),
  columnHelper.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RegistrationRowActions registration={row.original} />,
  }),
]);
