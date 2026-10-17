import "server-only";

import type { Session } from "@/services/auth";
import { getRole } from "@/services/auth/session";
import type { Permission } from "@/types/auth";

const adminOnly: Permission[] = [
  "registration:delete",
  "contact:delete",
  "gaming-zone:delete",
  "users:manage",
];

export type { Permission };

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
