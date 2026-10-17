"use client";

import type { ReactNode } from "react";
import DataTablePagination from "@/components/data-table/data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type HeaderLike = {
  id: string;
  isPlaceholder: boolean;
};

type HeaderGroupLike = {
  id: string;
  headers: HeaderLike[];
};

type CellLike = {
  id: string;
};

type RowLike = {
  id: string;
  getVisibleCells: () => CellLike[];
};

type FlexRenderProps = {
  header?: HeaderLike;
  cell?: CellLike;
};

/** Minimal table API shared by our TanStack v9 useTable instances. */
export type DataTableInstance = {
  getHeaderGroups: () => HeaderGroupLike[];
  getRowModel: () => { rows: RowLike[] };
  getFilteredRowModel: () => { rows: unknown[] };
  getPageCount: () => number;
  getCanPreviousPage: () => boolean;
  getCanNextPage: () => boolean;
  previousPage: () => void;
  nextPage: () => void;
  state: { pagination: { pageIndex: number } };
  FlexRender: (props: FlexRenderProps) => ReactNode;
};

export default function DataTable({
  table,
  columnCount,
  emptyMessage,
  toolbar,
}: {
  table: DataTableInstance;
  columnCount: number;
  emptyMessage: string;
  toolbar?: ReactNode;
}) {
  const pageCount = table.getPageCount();
  const pageIndex = table.state.pagination.pageIndex;
  const resultCount = table.getFilteredRowModel().rows.length;
  const FlexRender = table.FlexRender;

  return (
    <div className="space-y-4">
      {toolbar}
      <div className="overflow-hidden rounded-xl border border-border bg-surface-100/60">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <FlexRender header={header} />
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
                      <FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-28 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        resultCount={resultCount}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
        onPreviousPage={() => table.previousPage()}
        onNextPage={() => table.nextPage()}
      />
    </div>
  );
}
