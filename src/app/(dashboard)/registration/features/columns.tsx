"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/data-table/data-table-features";
import { formatAppDate } from "@/lib/format";
import type { RegistrationRow } from "@/types/registration";
import RegistrationRowActions from "./row-actions";
import SlipThumbnail from "./slip-thumbnail";

const columnHelper = createColumnHelper<DataTableFeatures, RegistrationRow>();

export function createRegistrationColumns(canDelete: boolean) {
  return columnHelper.columns([
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
          <p className="text-xs text-muted-foreground">
            {row.original.teamName}
          </p>
        </div>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("game", {
      id: "game",
      header: "Game",
      cell: ({ getValue }) =>
        getValue() === "FREE_FIRE" ? "Free Fire" : "PUBG",
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
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatAppDate(getValue())}
        </span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <RegistrationRowActions
          registration={row.original}
          canDelete={canDelete}
        />
      ),
    }),
  ]);
}
