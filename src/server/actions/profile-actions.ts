"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit, requireUser } from "@/server/actions/helpers";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const profileSchema = z.object({
  name: z.string().min(2).max(80),
});

export async function updateProfileAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = profileSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid name" };
  }

  try {
    await enforceRateLimit(`profile:update:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
      },
    });
    revalidatePath("/settings/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
