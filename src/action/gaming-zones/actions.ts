"use server";

import { revalidatePath } from "next/cache";
import { assertCan } from "@/lib/auth/permissions";
import { getSession } from "@/lib/auth/session";
import { validateText } from "@/lib/fields";
import {
  createGamingZone,
  deleteGamingZone,
  updateGamingZone,
} from "@/lib/gaming-zones-admin";

function parseZoneFields(input: {
  zoneName?: string;
  zoneNumber?: string;
  zoneLocation?: string;
}) {
  const zoneNameError = validateText(input.zoneName, "Zone name", 2, 80);
  const zoneNumberError = validateText(input.zoneNumber, "Zone number", 1, 40);
  const zoneLocationError = validateText(
    input.zoneLocation,
    "Zone location",
    2,
    120,
  );
  const error = zoneNameError ?? zoneNumberError ?? zoneLocationError;
  if (error) return { ok: false as const, error };
  return {
    ok: true as const,
    data: {
      zoneName: String(input.zoneName).trim(),
      zoneNumber: String(input.zoneNumber).trim(),
      zoneLocation: String(input.zoneLocation).trim(),
    },
  };
}

export async function createGamingZoneAction(input: {
  zoneName: string;
  zoneNumber: string;
  zoneLocation: string;
}): Promise<{ ok: true; referralCode: string } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const parsed = parseZoneFields(input);
  if (!parsed.ok) return parsed;

  try {
    const zone = await createGamingZone(parsed.data);
    revalidatePath("/gaming-zones");
    return { ok: true, referralCode: zone.referralCode };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not create gaming zone." };
  }
}

export async function updateGamingZoneAction(input: {
  id: string;
  zoneName: string;
  zoneNumber: string;
  zoneLocation: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const id = input.id?.trim();
  if (!id) return { ok: false, error: "Invalid zone id." };

  const parsed = parseZoneFields(input);
  if (!parsed.ok) return parsed;

  try {
    await updateGamingZone(id, parsed.data);
    revalidatePath("/gaming-zones");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not update gaming zone." };
  }
}

export async function deleteGamingZoneAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  const allowed = assertCan(session, "gaming-zone:delete");
  if (!allowed.ok) return allowed;

  const zoneId = id?.trim();
  if (!zoneId) return { ok: false, error: "Invalid zone id." };

  try {
    await deleteGamingZone(zoneId);
    revalidatePath("/gaming-zones");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not delete gaming zone." };
  }
}
