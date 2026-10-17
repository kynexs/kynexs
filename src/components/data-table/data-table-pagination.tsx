"use client";

import { Button } from "@/components/ui/button";

export default function DataTablePagination({
  pageIndex,
  pageCount,
  resultCount,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
}: {
  pageIndex: number;
  pageCount: number;
  resultCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount} ·{" "}
        {resultCount} result{resultCount === 1 ? "" : "s"}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!canNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
