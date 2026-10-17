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
import type { ContactRow } from "@/types/contact";
import { createContactColumns } from "./columns";

export default function ContactsTable({
  data,
  canDelete,
}: {
  data: ContactRow[];
  canDelete: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => createContactColumns(canDelete), [canDelete]);

  const rows = useMemo(
    () => data.filter((row) => rowInDateRange(row.createdAt, dateRange)),
    [data, dateRange],
  );

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
        original.name.toLowerCase().includes(query) ||
        original.email.toLowerCase().includes(query) ||
        original.message.toLowerCase().includes(query)
      );
    },
  });

  return (
    <DataTable
      table={table as unknown as DataTableInstance}
      columnCount={columns.length}
      emptyMessage={
        data.length === 0
          ? "No contacts yet."
          : "No contacts match your filters."
      }
      toolbar={
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={globalFilter}
            onChange={(value) => {
              setGlobalFilter(value);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
            placeholder="Search contacts by name…"
            aria-label="Search contacts"
          />

          <DateRangeFilter
            value={dateRange}
            onChange={(next) => {
              setDateRange(next);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
          />
        </div>
      }
    />
  );
}
