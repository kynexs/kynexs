import "server-only";

import { prisma } from "@/services/prisma";
import type { DashboardUserRow } from "@/types/users";

export async function listDashboardUsers(): Promise<DashboardUserRow[]> {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role ?? "user",
    createdAt: row.createdAt.toISOString(),
  }));
}
