import "server-only";

import { headers } from "next/headers";
import { prisma } from "@/services/prisma";

const WINDOW_MS = 60 * 60 * 1000;

export const RATE_LIMITS = {
  registration: 20,
  upload: 30,
} as const;

export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return h.get("x-real-ip")?.trim() || "unknown";
}

/** Sliding 1-hour window. Returns a user-facing error string when over the limit. */
export async function assertRateLimit(
  kind: keyof typeof RATE_LIMITS,
  ip: string,
): Promise<string | null> {
  const limit = RATE_LIMITS[kind];
  const key = `${kind}:${ip}`;
  const since = new Date(Date.now() - WINDOW_MS);

  const count = await prisma.rateLimitHit.count({
    where: { key, createdAt: { gte: since } },
  });
  if (count >= limit) {
    return kind === "upload"
      ? "Too many slip uploads. Try again in an hour."
      : "Too many registrations from your network. Try again in an hour.";
  }

  await prisma.rateLimitHit.create({
    data: { id: crypto.randomUUID(), key },
  });

  // Best-effort cleanup of old rows for this key.
  await prisma.rateLimitHit
    .deleteMany({ where: { key, createdAt: { lt: since } } })
    .catch(() => {});

  return null;
}
