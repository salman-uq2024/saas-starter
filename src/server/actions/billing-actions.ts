"use server";

import { z } from "zod";
import { createBillingPortalSession, createCheckoutSession } from "@/server/billing";
import { enforceRateLimit, requireUser } from "@/server/actions/helpers";
import { listWorkspacesForUser } from "@/server/workspaces";

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

const workspaceSchema = z.object({
  workspaceId: z.string().min(1).optional(),
});

export async function startCheckoutAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = workspaceSchema.safeParse({ workspaceId: formData.get("workspaceId") });
  const memberships = await listWorkspacesForUser(user.id);
  const fallbackWorkspaceId =
    memberships.find((membership) => membership.workspace.id === user.defaultWorkspaceId)?.workspace.id ??
    memberships[0]?.workspace.id;

  const workspaceId = parsed.success
    ? parsed.data.workspaceId ?? fallbackWorkspaceId
    : fallbackWorkspaceId;

  if (!workspaceId) {
    return { success: false, error: "No workspace selected" };
  }

  try {
    await enforceRateLimit(`billing:checkout:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    const session = await createCheckoutSession({ workspaceId, actorId: user.id });
    return { success: true, data: { url: session.url } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start checkout",
    };
  }
}

export async function startBillingPortalAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unauthorized" };
  }

  const parsed = workspaceSchema.safeParse({ workspaceId: formData.get("workspaceId") });
  const memberships = await listWorkspacesForUser(user.id);
  const fallbackWorkspaceId =
    memberships.find((membership) => membership.workspace.id === user.defaultWorkspaceId)?.workspace.id ??
    memberships[0]?.workspace.id;
  const workspaceId = parsed.success
    ? parsed.data.workspaceId ?? fallbackWorkspaceId
    : fallbackWorkspaceId;

  if (!workspaceId) {
    return { success: false, error: "No workspace selected" };
  }

  try {
    await enforceRateLimit(`billing:portal:${user.id}`);
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Rate limit exceeded" };
  }

  try {
    const session = await createBillingPortalSession({ workspaceId, actorId: user.id });
    return { success: true, data: { url: session.url } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to open billing portal",
    };
  }
}
