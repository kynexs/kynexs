import "server-only";

import type {
  GamingZoneRow,
  GamingZoneStats,
} from "@/components/gaming-zones/types";
import { prisma } from "@/lib/services/prisma";

function generateReferralCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  let code = "KZ";
  for (const byte of bytes) {
    code += alphabet[byte % alphabet.length];
  }
  return code;
}

export async function getGamingZoneStats(): Promise<GamingZoneStats> {
  const [referredRegistrations, zones] = await Promise.all([
    prisma.registration.count({ where: { gamingZoneId: { not: null } } }),
    prisma.gamingZone.findMany({
      include: { _count: { select: { registrations: true } } },
    }),
  ]);

  const top = zones
    .slice()
    .sort((a, b) => b._count.registrations - a._count.registrations)[0];

  return {
    referredRegistrations,
    topZone:
      top && top._count.registrations > 0
        ? {
            zoneName: top.zoneName,
            referralCode: top.referralCode,
            count: top._count.registrations,
          }
        : null,
  };
}

export async function listGamingZones(): Promise<GamingZoneRow[]> {
  const rows = await prisma.gamingZone.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { registrations: true } } },
  });

  return rows.map((row) => ({
    id: row.id,
    zoneName: row.zoneName,
    zoneNumber: row.zoneNumber,
    zoneLocation: row.zoneLocation,
    referralCode: row.referralCode,
    registrationCount: row._count.registrations,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createGamingZone(input: {
  zoneName: string;
  zoneNumber: string;
  zoneLocation: string;
}) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const referralCode = generateReferralCode();
    try {
      return await prisma.gamingZone.create({
        data: {
          id: crypto.randomUUID(),
          zoneName: input.zoneName,
          zoneNumber: input.zoneNumber,
          zoneLocation: input.zoneLocation,
          referralCode,
          updatedAt: new Date(),
        },
      });
    } catch {
      // unique collision — retry
    }
  }
  throw new Error("Could not generate a unique referral code.");
}

export async function updateGamingZone(
  id: string,
  input: { zoneName: string; zoneNumber: string; zoneLocation: string },
) {
  return prisma.gamingZone.update({
    where: { id },
    data: {
      zoneName: input.zoneName,
      zoneNumber: input.zoneNumber,
      zoneLocation: input.zoneLocation,
      updatedAt: new Date(),
    },
  });
}

export async function deleteGamingZone(id: string) {
  return prisma.gamingZone.delete({ where: { id } });
}
