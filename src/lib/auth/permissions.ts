import "server-only";

import type { Session } from "@/lib/auth";
import { getRole } from "@/lib/auth/session";

export type Permission =
  | "registration:delete"
  | "contact:delete"
  | "gaming-zone:delete"
  | "users:manage";

const adminOnly: Permission[] = [
  "registration:delete",
  "contact:delete",
  "gaming-zone:delete",
  "users:manage",
];

export function can(session: Session, permission: Permission): boolean {
  const role = getRole(session);
  if (role === "admin") return true;
  return !adminOnly.includes(permission);
}

export function assertCan(
  session: Session,
  permission: Permission,
): { ok: true } | { ok: false; error: string } {
  if (can(session, permission)) return { ok: true };
  return { ok: false, error: "Forbidden" };
}
