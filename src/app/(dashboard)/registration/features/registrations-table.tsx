"use client";

import {
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  useTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DateRangeFilter, {
  type DateRangeValue,
  rowInDateRange,
} from "@/components/dashboard/date-range-filter";
import SearchInput from "@/components/dashboard/search-input";
import DataTable, {
  type DataTableInstance,
} from "@/components/data-table/data-table";
import { features } from "@/components/data-table/data-table-features";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegistrationRow } from "@/types/registration";
import { createRegistrationColumns } from "./columns";

type GameFilter = "ALL" | "PUBG" | "FREE_FIRE";

export default function RegistrationsTable({
  data,
  canDelete,
}: {
  data: RegistrationRow[];
  canDelete: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [gameFilter, setGameFilter] = useState<GameFilter>("ALL");
  const [dateRange, setDateRange] = useState<DateRangeValue>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => createRegistrationColumns(canDelete),
    [canDelete],
  );

  const rows = useMemo(() => {
    return data.filter((row) => {
      if (gameFilter !== "ALL" && row.game !== gameFilter) return false;
      if (!rowInDateRange(row.createdAt, dateRange)) return false;
      return true;
    });
  }, [data, gameFilter, dateRange]);

  const table = useTable({
    features,
    data: rows,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? "")
        .trim()
        .toLowerCase();
      if (!query) return true;
      const original = row.original;
      return (
        original.id.toLowerCase().includes(query) ||
        original.contactName.toLowerCase().includes(query) ||
        original.teamName.toLowerCase().includes(query) ||
        original.contactWhatsapp.toLowerCase().includes(query)
      );
    },
  });

  return (
    <DataTable
      table={table as unknown as DataTableInstance}
      columnCount={columns.length}
      emptyMessage={
        data.length === 0
          ? "No registrations yet."
          : "No registrations match your filters."
      }
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={globalFilter}
            onChange={(value) => {
              setGlobalFilter(value);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            placeholder="Search registrations by name…"
            aria-label="Search registrations"
          />

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              value={gameFilter}
              onValueChange={(value) => {
                if (
                  value === "ALL" ||
                  value === "PUBG" ||
                  value === "FREE_FIRE"
                ) {
                  setGameFilter(value);
                  setPagination((current) => ({ ...current, pageIndex: 0 }));
                }
              }}
            >
              <SelectTrigger
                className="h-10 w-[160px] bg-surface-200"
                aria-label="Filter by game"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All games</SelectItem>
                <SelectItem value="PUBG">PUBG</SelectItem>
                <SelectItem value="FREE_FIRE">Free Fire</SelectItem>
              </SelectContent>
            </Select>

            <DateRangeFilter
              value={dateRange}
              onChange={(next) => {
                setDateRange(next);
                setPagination((current) => ({ ...current, pageIndex: 0 }));
              }}
            />
          </div>
        </div>
      }
    />
  );
}
