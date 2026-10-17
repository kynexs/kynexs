"use server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import { buildReceiptKey, parseReceiptKey } from "@/lib/receipt";
import { assertCan } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import { prisma } from "@/services/prisma";
import { deleteObject, s3, storageBucket } from "@/services/s3";
import type { RegistrationInput } from "@/types/registration";
import {
  detectSlipType,
  validateRegistration,
  validateSlip,
} from "@/validations/registration";

export async function uploadReceiptFile(formData: FormData): Promise<string> {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Upload your payment slip.");
  const invalid = validateSlip(file);
  if (invalid) throw new Error(invalid);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detected = detectSlipType(bytes);
  if (!detected) throw new Error("Slip must be a JPG, PNG, WebP or PDF file.");

  const id = crypto.randomUUID();
  const key = buildReceiptKey(id, {
    name: file.name,
    size: file.size,
    type: detected,
  });
  await s3.send(
    new PutObjectCommand({
      Bucket: storageBucket(),
      Key: key,
      Body: bytes,
      ContentType: detected,
    }),
  );
  return key;
}

export async function registerSquad(input: RegistrationInput): Promise<void> {
  const result = validateRegistration(input);
  if (!result.ok) {
    const message =
      Object.values(result.errors)[0] ?? "Check the form and try again.";
    throw new Error(message);
  }

  const data = result.data;
  const parsed = parseReceiptKey(data.receiptKey);
  if (!parsed) throw new Error("Upload your payment slip.");

  let gamingZoneId: string | null = null;
  if (data.referralCode) {
    const zone = await prisma.gamingZone.findUnique({
      where: { referralCode: data.referralCode },
    });
    if (!zone) throw new Error("Invalid referral code.");
    gamingZoneId = zone.id;
  }

  const fileUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: storageBucket(), Key: data.receiptKey }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  try {
    await prisma.registration.create({
      data: {
        id: data.registrationId,
        teamName: data.teamName,
        contactName: data.igl.fullName,
        contactWhatsapp: data.igl.whatsapp,
        contactEmail: data.igl.email,
        contactAge: data.igl.age,
        contactArea: data.igl.area,
        agreementsAccepted: true,
        game: data.game,
        gamingZoneId,
        referralCodeEntered: data.referralCode,
        updatedAt: new Date(),
        Player: {
          create: data.players.map((player) => ({
            id: crypto.randomUUID(),
            slot: player.slot,
            isIgl: player.isIgl,
            fullName: player.fullName,
            age: player.age,
            pubgName: player.pubgName,
            whatsapp: player.whatsapp,
            area: player.area,
          })),
        },
        Receipt: {
          create: {
            id: crypto.randomUUID(),
            fileKey: data.receiptKey,
            fileUrl,
            fileName: parsed.fileName,
            fileType: parsed.fileType,
            fileSize: parsed.fileSize,
          },
        },
      },
    });
  } catch (error) {
    console.error("registration failed", error);
    throw new Error("Couldn't save your squad. Try again in a moment.");
  }
}

export async function deleteRegistration(
  registrationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  const allowed = assertCan(session, "registration:delete");
  if (!allowed.ok) return allowed;

  const id = registrationId?.trim();
  if (!id || id.length < 8 || id.length > 80) {
    return { ok: false, error: "Invalid registration id." };
  }

  const existing = await prisma.registration.findUnique({
    where: { id },
    include: { Receipt: true },
  });
  if (!existing) return { ok: false, error: "Registration not found." };

  try {
    if (existing.Receipt?.fileKey) {
      await deleteObject(existing.Receipt.fileKey).catch((error) => {
        console.error("receipt delete failed", error);
      });
    }

    await prisma.registration.delete({ where: { id } });
    revalidatePath("/registration");
    return { ok: true };
  } catch (error) {
    console.error("delete registration failed", error);
    return {
      ok: false,
      error: "Couldn't delete this registration. Try again.",
    };
  }
}
