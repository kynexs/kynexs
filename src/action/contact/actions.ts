"use server";

import type { ContactInput } from "@/lib/contact";
import { validateContact } from "@/lib/contact";
import { prisma } from "@/lib/prisma";

export interface ContactPayload extends ContactInput {
  website?: string;
}

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
