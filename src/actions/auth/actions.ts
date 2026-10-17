"use server";

import { prisma } from "@/services/prisma";

/** Gate public signup and promote the first account to admin. */
export async function claimFirstAdmin(
  email?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const adminCount = await prisma.user.count({ where: { role: "admin" } });

  if (!email) {
    if (adminCount > 0) {
      return {
        ok: false,
        error: "Signup is closed. Ask an admin for an account.",
      };
    }
    return { ok: true };
  }

  if (adminCount > 0) {
    return { ok: false, error: "An admin already exists." };
  }

  const normalized = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalized } });
  if (!user) {
    return { ok: false, error: "Account not found after signup." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: "admin" },
  });

  return { ok: true };
}
