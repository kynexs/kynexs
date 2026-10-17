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
import { features } from "@/components/registration/data-table-features";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gamingZoneColumns } from "./columns";
import type { GamingZoneRow } from "./types";
import ZoneFormDialog from "./zone-form-dialog";

export default function GamingZonesTable({
  data,
  canDelete,
}: {
  data: GamingZoneRow[];
  canDelete: boolean;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(() => gamingZoneColumns(canDelete), [canDelete]);

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
        original.zoneName.toLowerCase().includes(query) ||
        original.referralCode.toLowerCase().includes(query) ||
        original.zoneLocation.toLowerCase().includes(query)
      );
    },
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.state.pagination.pageIndex;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={globalFilter}
          onChange={(event) => {
            setGlobalFilter(event.target.value);
            setPagination((current) => ({ ...current, pageIndex: 0 }));
          }}
          placeholder="Search gaming zones by name…"
          className="h-10 max-w-sm bg-surface-200"
          aria-label="Search gaming zones"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DateRangeFilter
            value={dateRange}
            onChange={(next) => {
              setDateRange(next);
              setPagination((current) => ({ ...current, pageIndex: 0 }));
            }}
          />
          <Button
            type="button"
            className="h-10 shrink-0"
            onClick={() => setCreateOpen(true)}
          >
            Add Gaming Zone
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-100/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-muted-foreground"
                >
                  {data.length === 0
                    ? "No gaming zones yet."
                    : "No gaming zones match your filters."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount} ·{" "}
          {table.getFilteredRowModel().rows.length} result
          {table.getFilteredRowModel().rows.length === 1 ? "" : "s"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <ZoneFormDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
