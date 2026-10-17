import "server-only";

import type { ContactRow, ContactStats } from "@/components/contacts/types";
import { prisma } from "@/lib/services/prisma";
import { todayRangeUtc } from "@/lib/timezone";

export async function getContactStats(): Promise<ContactStats> {
  const today = todayRangeUtc();
  const [total, replied, todayCount] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { status: "REPLIED" } }),
    prisma.contact.count({
      where: {
        createdAt: {
          gte: today.gte,
          lte: today.lte,
        },
      },
    }),
  ]);

  return { total, replied, today: todayCount };
}

export async function listContacts(): Promise<ContactRow[]> {
  const rows = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    message: row.message,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function markContactReplied(id: string) {
  return prisma.contact.update({
    where: { id },
    data: { status: "REPLIED", updatedAt: new Date() },
  });
}

export async function deleteContact(id: string) {
  return prisma.contact.delete({ where: { id } });
}
