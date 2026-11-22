"use server";

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { revalidatePath } from "next/cache";
import {
  OWNER_EMAIL,
  registrationConfirmationEmail,
  registrationOwnerEmail,
} from "@/emails/registration";
import { assertRateLimit, clientIp } from "@/lib/rate-limit";
import { buildReceiptKey, parseReceiptKey } from "@/lib/receipt";
import { assertCan } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import { prisma } from "@/services/prisma";
import { sendEmails } from "@/services/resend";
import { deleteObject, s3, storageBucket } from "@/services/s3";
import type {
  IndividualInput,
  RegistrationData,
  RegistrationInput,
  RegistrationStatus,
} from "@/types/registration";
import {
  detectSlipType,
  validateIndividualRegistration,
  validateRegistration,
  validateSlip,
} from "@/validations/registration";

const isDev = process.env.NODE_ENV === "development";

async function assertEmailAvailable(email: string): Promise<void> {
  const existing = await prisma.registration.findFirst({
    where: { contactEmail: email },
    select: { id: true },
  });
  if (existing) {
    throw new Error("This email is already registered.");
  }
}

async function saveRegistration(
  data: RegistrationData,
  fileUrl: string,
  parsed: NonNullable<ReturnType<typeof parseReceiptKey>>,
  gamingZoneId: string | null,
): Promise<void> {
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
      type: data.type,
      fee: data.fee,
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
}

async function sendRegistrationEmails(data: RegistrationData): Promise<void> {
  const emailPayload = {
    teamName: data.teamName,
    type: data.type,
    players: data.players,
  };
  const playerMail = registrationConfirmationEmail(emailPayload);
  const ownerMail = registrationOwnerEmail(emailPayload);

  await sendEmails(
    [
      {
        to: data.igl.email,
        subject: playerMail.subject,
        html: playerMail.html,
      },
      {
        to: OWNER_EMAIL,
        subject: ownerMail.subject,
        html: ownerMail.html,
      },
    ],
    `registration/${data.registrationId}`,
  );
}

export async function uploadReceiptFile(formData: FormData): Promise<string> {
  const ip = await clientIp();
  await assertRateLimit("upload", ip);

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
  const log = (...args: unknown[]) => {
    if (isDev) console.log("[registerSquad]", ...args);
  };

  const ip = await clientIp();
  await assertRateLimit("registration", ip);

  log("1/6 validate input");
  const result = validateRegistration(input);
  if (!result.ok) {
    const message =
      Object.values(result.errors)[0] ?? "Check the form and try again.";
    log("validation failed", result.errors);
    throw new Error(message);
  }

  const data = result.data;
  await assertEmailAvailable(data.igl.email);

  log("2/6 parse receipt", {
    registrationId: data.registrationId,
    teamName: data.teamName,
    iglEmail: data.igl.email,
  });
  const parsed = parseReceiptKey(data.receiptKey);
  if (!parsed) throw new Error("Upload your payment slip.");

  let gamingZoneId: string | null = null;
  if (data.referralCode) {
    log("3/6 resolve referral", data.referralCode);
    const zone = await prisma.gamingZone.findUnique({
      where: { referralCode: data.referralCode },
    });
    if (!zone) throw new Error("Invalid referral code.");
    gamingZoneId = zone.id;
  } else {
    log("3/6 no referral code");
  }

  log("4/6 sign receipt url");
  const fileUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: storageBucket(), Key: data.receiptKey }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  try {
    log("5/6 save registration to db");
    await saveRegistration(data, fileUrl, parsed, gamingZoneId);
    log("5/6 db save ok", data.registrationId);
  } catch (error) {
    console.error("registration failed", error);
    throw new Error("Couldn't save your squad. Try again in a moment.");
  }

  try {
    log("6/6 send emails");
    await sendRegistrationEmails(data);
    log("6/6 emails sent ok");
  } catch (error) {
    console.error("registration emails failed", error);
    log("6/6 emails failed", error);
  }
}

export async function registerIndividual(
  input: IndividualInput,
): Promise<void> {
  const log = (...args: unknown[]) => {
    if (isDev) console.log("[registerIndividual]", ...args);
  };

  const ip = await clientIp();
  await assertRateLimit("registration", ip);

  log("1/5 validate input");
  const result = validateIndividualRegistration(input);
  if (!result.ok) {
    const message =
      Object.values(result.errors)[0] ?? "Check the form and try again.";
    log("validation failed", result.errors);
    throw new Error(message);
  }

  const data = result.data;
  await assertEmailAvailable(data.igl.email);

  const parsed = parseReceiptKey(data.receiptKey);
  if (!parsed) throw new Error("Upload your payment slip.");

  log("2/5 sign receipt url");
  const fileUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: storageBucket(), Key: data.receiptKey }),
    { expiresIn: 60 * 60 * 24 * 7 },
  );

  try {
    log("3/5 save registration to db");
    await saveRegistration(data, fileUrl, parsed, null);
    log("4/5 db save ok", data.registrationId);
  } catch (error) {
    console.error("individual registration failed", error);
    throw new Error("Couldn't save your registration. Try again in a moment.");
  }

  try {
    log("5/5 send emails");
    await sendRegistrationEmails(data);
    log("5/5 emails sent ok");
  } catch (error) {
    console.error("registration emails failed", error);
    log("5/5 emails failed", error);
  }
}

const REGISTRATION_STATUSES: RegistrationStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
];

export async function updateRegistrationStatus(
  registrationId: string,
  status: RegistrationStatus,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const id = registrationId?.trim();
  if (!id || id.length < 8 || id.length > 80) {
    return { ok: false, error: "Invalid registration id." };
  }
  if (!REGISTRATION_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid registration status." };
  }

  try {
    const existing = await prisma.registration.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "Registration not found." };

    await prisma.registration.update({
      where: { id },
      data: { status, updatedAt: new Date() },
    });
    revalidatePath("/registration");
    return { ok: true };
  } catch (error) {
    console.error("update registration status failed", error);
    return {
      ok: false,
      error: "Couldn't update registration status. Try again.",
    };
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
