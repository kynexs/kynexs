"use server";

import { revalidatePath } from "next/cache";
import { deleteContact, markContactReplied } from "@/actions/contacts/admin";
import { assertCan } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import { prisma } from "@/services/prisma";
import type { ContactInput } from "@/types/contact";
import { validateContact } from "@/validations/contact";

export interface ContactPayload extends ContactInput {
  website?: string;
}

// ----------- Website Actions -----------

export async function sendContact(payload: ContactPayload): Promise<void> {
  if (payload.website) return;

  const result = validateContact(payload);
  if (!result.ok) {
    const message =
      result.errors.name ??
      result.errors.email ??
      result.errors.phone ??
      result.errors.message ??
      "Check the form and try again.";
    throw new Error(message);
  }

  await prisma.contact.create({
    data: {
      id: crypto.randomUUID(),
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
      updatedAt: new Date(),
    },
  });
}

// ----------- Admin Dashboard Actions -----------

export async function markContactRepliedAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };

  const contactId = id?.trim();
  if (!contactId) return { ok: false, error: "Invalid contact id." };

  try {
    await markContactReplied(contactId);
    revalidatePath("/contacts");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not update contact." };
  }
}

export async function deleteContactAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  const allowed = assertCan(session, "contact:delete");
  if (!allowed.ok) return allowed;

  const contactId = id?.trim();
  if (!contactId) return { ok: false, error: "Invalid contact id." };

  try {
    await deleteContact(contactId);
    revalidatePath("/contacts");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, error: "Could not delete contact." };
  }
}
