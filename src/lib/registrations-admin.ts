import "server-only";

import type {
  RegistrationRow,
  RegistrationStats,
} from "@/components/registration/types";
import { prisma } from "@/lib/services/prisma";
import { getObjectSignedUrl } from "@/lib/services/s3";

export async function getRegistrationStats(): Promise<RegistrationStats> {
  const [totalRegistrations, withSlip, totalPlayers] = await Promise.all([
    prisma.registration.count(),
    prisma.receipt.count(),
    prisma.player.count(),
  ]);

  return {
    totalRegistrations,
    withSlip,
    totalPlayers,
    withoutSlip: Math.max(0, totalRegistrations - withSlip),
  };
}

export async function listRegistrations(): Promise<RegistrationRow[]> {
  const rows = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      Player: { orderBy: { slot: "asc" } },
      Receipt: true,
    },
  });

  return Promise.all(
    rows.map(async (row) => {
      let receipt: RegistrationRow["receipt"] = null;
      if (row.Receipt) {
        const fileUrl = await getObjectSignedUrl(row.Receipt.fileKey).catch(
          () => row.Receipt?.fileUrl ?? "",
        );
        receipt = {
          id: row.Receipt.id,
          fileKey: row.Receipt.fileKey,
          fileUrl,
          fileName: row.Receipt.fileName,
          fileType: row.Receipt.fileType,
          fileSize: row.Receipt.fileSize,
        };
      }

      return {
        id: row.id,
        teamName: row.teamName,
        contactName: row.contactName,
        contactWhatsapp: row.contactWhatsapp,
        contactEmail: row.contactEmail,
        contactAge: row.contactAge,
        contactArea: row.contactArea,
        status: row.status,
        game: row.game,
        referralCodeEntered: row.referralCodeEntered,
        createdAt: row.createdAt.toISOString(),
        players: row.Player.map((player) => ({

          id: player.id,
          slot: player.slot,
          isIgl: player.isIgl,
          fullName: player.fullName,
          age: player.age,
          pubgName: player.pubgName,
          whatsapp: player.whatsapp,
          area: player.area,
        })),
        receipt,
      };
    }),
  );
}
