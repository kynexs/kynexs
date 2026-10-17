"use client";

import { createColumnHelper } from "@tanstack/react-table";
import type { DataTableFeatures } from "@/components/registration/data-table-features";
import { formatAppDate } from "@/lib/format";
import GamingZoneRowActions from "./row-actions";
import type { GamingZoneRow } from "./types";

const columnHelper = createColumnHelper<DataTableFeatures, GamingZoneRow>();

export function gamingZoneColumns(canDelete: boolean) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      id: "id",
      header: "ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue().slice(0, 8)}…</span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("zoneName", {
      id: "zoneName",
      header: "Zone name",
      cell: ({ getValue }) => (
        <span className="min-w-32 font-medium">{getValue()}</span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("zoneNumber", {
      id: "zoneNumber",
      header: "Zone number",
      filterFn: "includesString",
    }),
    columnHelper.accessor("zoneLocation", {
      id: "zoneLocation",
      header: "Location",
      filterFn: "includesString",
    }),
    columnHelper.accessor("referralCode", {
      id: "referralCode",
      header: "Referral code",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      filterFn: "includesString",
    }),
    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Created",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">
          {formatAppDate(getValue())}
        </span>
      ),
      sortFn: "alphanumeric",
    }),

    columnHelper.display({
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <GamingZoneRowActions zone={row.original} canDelete={canDelete} />
      ),
    }),
  ]);
}
