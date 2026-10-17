"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/services/auth";
import { assertCan } from "@/services/auth/permissions";
import { getSession } from "@/services/auth/session";
import { validateEmail, validateText } from "@/validations/fields";

export async function createDashboardUser(input: {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  const allowed = assertCan(session, "users:manage");
  if (!allowed.ok) return allowed;

  const nameError = validateText(input.name, "Name", 2, 80);
  const emailError = validateEmail(input.email);
  if (nameError) return { ok: false, error: nameError };
  if (emailError) return { ok: false, error: emailError };
  if (!input.password || input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  if (input.role !== "admin" && input.role !== "user") {
    return { ok: false, error: "Invalid role." };
  }

  try {
    await auth.api.createUser({
      body: {
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        role: input.role,
      },
      headers: await headers(),
    });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not create user.",
    };
  }
}

export async function setDashboardUserRole(input: {
  userId: string;
  role: "admin" | "user";
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Unauthorized" };
  const allowed = assertCan(session, "users:manage");
  if (!allowed.ok) return allowed;

  if (!input.userId?.trim()) return { ok: false, error: "Invalid user id." };
  if (input.role !== "admin" && input.role !== "user") {
    return { ok: false, error: "Invalid role." };
  }

  try {
    await auth.api.setRole({
      body: {
        userId: input.userId,
        role: input.role,
      },
      headers: await headers(),
    });
    revalidatePath("/users");
    return { ok: true };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Could not update role.",
    };
  }
}
