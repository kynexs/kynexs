"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setDashboardUserRole } from "@/action/users/actions";
import DateRangeFilter, {
  type DateRangeValue,
  rowInDateRange,
} from "@/components/dashboard/date-range-filter";
import CreateUserDialog from "@/components/users/create-user-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAppDate } from "@/lib/format";
import type { DashboardUserRow } from "@/lib/users-admin";

export default function UsersTable({ data }: { data: DashboardUserRow[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRangeValue>({});
  const [createOpen, setCreateOpen] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((row) => {
      if (!rowInDateRange(row.createdAt, dateRange)) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.role.toLowerCase().includes(q)
      );
    });
  }, [data, query, dateRange]);

  async function onRoleChange(userId: string, role: "admin" | "user") {
    const result = await setDashboardUserRole({ userId, role });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Role updated");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users by name…"
          className="h-10 max-w-sm bg-surface-200"
          aria-label="Search users"
        />
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Add user
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface-100/60">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Select
                      value={row.role === "admin" ? "admin" : "user"}
                      onValueChange={(value) => {
                        if (value === "admin" || value === "user") {
                          void onRoleChange(row.id, value);
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 w-[120px] bg-surface-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatAppDate(row.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-28 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CreateUserDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
