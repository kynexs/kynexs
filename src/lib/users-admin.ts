import "server-only";

import { prisma } from "@/lib/services/prisma";

export type DashboardUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

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
