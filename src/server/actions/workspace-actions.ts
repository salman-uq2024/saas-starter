"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  acceptInvite,
  cancelInvite,
  createWorkspace,
  inviteToWorkspace,
  renameWorkspace,
  removeMember,
  switchDefaultWorkspace,
  updateMemberRole,
} from "@/server/workspaces";
import { requireUser, enforceRateLimit } from "@/server/actions/helpers";

const createWorkspaceSchema = z.object({
  name: z.string().min(2).max(80),
});

const inviteSchema = z.object({
  workspaceId: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]).default("MEMBER"),
});

const renameSchema = z.object({
  workspaceId: z.string().min(1),
  name: z.string().min(2).max(80),
});

const acceptSchema = z.object({
  token: z.string().min(10),
});

const switchSchema = z.object({
  workspaceId: z.string().min(1),
});

const removeMemberSchema = z.object({
  workspaceId: z.string().min(1),
  memberId: z.string().min(1),
});

const cancelInviteSchema = z.object({
  workspaceId: z.string().min(1),
  inviteId: z.string().min(1),
});

const updateRoleSchema = z.object({
  workspaceId: z.string().min(1),
  memberId: z.string().min(1),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function createWorkspaceAction(formData: FormData): Promise<ActionResult<{ workspaceId: string }>> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = createWorkspaceSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid workspace name" };
  }

  try {
    await enforceRateLimit(`workspace:create:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    const workspace = await createWorkspace(user.id, parsed.data.name);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return { success: true, data: { workspaceId: workspace.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create workspace",
    };
  }
}

export async function inviteMemberAction(
  formData: FormData
): Promise<ActionResult<{ acceptUrl: string; delivered: boolean }>> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = inviteSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    email: formData.get("email"),
    role: formData.get("role") ?? "MEMBER",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid invitation" };
  }

  try {
    await enforceRateLimit(`workspace:invite:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    const result = await inviteToWorkspace({
      workspaceId: parsed.data.workspaceId,
      inviterId: user.id,
      email: parsed.data.email,
      role: parsed.data.role,
    });
    revalidatePath(`/settings/workspaces/${parsed.data.workspaceId}`);
    return { success: true, data: { acceptUrl: result.acceptUrl, delivered: result.delivered } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send invite",
    };
  }
}

export async function renameWorkspaceAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = renameSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid workspace name" };
  }

  try {
    await renameWorkspace({
      workspaceId: parsed.data.workspaceId,
      actorId: user.id,
      name: parsed.data.name,
    });
    revalidatePath(`/settings/workspaces/${parsed.data.workspaceId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to rename workspace",
    };
  }
}

export async function acceptInviteAction(formData: FormData): Promise<ActionResult<{ workspaceId: string }>> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = acceptSchema.safeParse({ token: formData.get("token") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid invite" };
  }

  try {
    await enforceRateLimit(`workspace:accept:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    const workspaceId = await acceptInvite({
      token: parsed.data.token,
      userId: user.id,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/settings/workspaces/${workspaceId}`);
    return { success: true, data: { workspaceId } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to accept invite",
    };
  }
}

export async function switchWorkspaceAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = switchSchema.safeParse({ workspaceId: formData.get("workspaceId") });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid workspace" };
  }

  try {
    await switchDefaultWorkspace(user.id, parsed.data.workspaceId);
    revalidatePath("/dashboard");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to switch workspace",
    };
  }
}

export async function removeMemberAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = removeMemberSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    memberId: formData.get("memberId"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" };
  }

  try {
    await enforceRateLimit(`workspace:remove:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    await removeMember({
      workspaceId: parsed.data.workspaceId,
      actorId: user.id,
      memberId: parsed.data.memberId,
    });
    revalidatePath(`/settings/workspaces/${parsed.data.workspaceId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to remove member",
    };
  }
}

export async function cancelInviteAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = cancelInviteSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    inviteId: formData.get("inviteId"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" };
  }

  try {
    await enforceRateLimit(`workspace:cancel:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    await cancelInvite({
      workspaceId: parsed.data.workspaceId,
      actorId: user.id,
      inviteId: parsed.data.inviteId,
    });
    revalidatePath(`/settings/workspaces/${parsed.data.workspaceId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel invite",
    };
  }
}

export async function updateMemberRoleAction(formData: FormData): Promise<ActionResult> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = updateRoleSchema.safeParse({
    workspaceId: formData.get("workspaceId"),
    memberId: formData.get("memberId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid role" };
  }

  try {
    await updateMemberRole({
      workspaceId: parsed.data.workspaceId,
      actorId: user.id,
      memberId: parsed.data.memberId,
      role: parsed.data.role,
    });
    revalidatePath(`/settings/workspaces/${parsed.data.workspaceId}`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}
