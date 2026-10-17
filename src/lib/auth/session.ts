import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

export async function getSession(): Promise<Session | null> {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/sign-in");
  return session;
}

export function getRole(session: Session): "admin" | "user" {
  return session.user.role === "admin" ? "admin" : "user";
}

export async function requireAdmin(): Promise<Session> {
  const session = await requireSession();
  if (getRole(session) !== "admin") redirect("/overview");
  return session;
}

export async function adminExists(): Promise<boolean> {
  const { prisma } = await import("@/lib/services/prisma");
  const count = await prisma.user.count({ where: { role: "admin" } });
  return count > 0;
}
