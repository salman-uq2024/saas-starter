import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getServerEnv } from "@/lib/env";
import { sendMail } from "@/server/mailer";
import type { Prisma, WorkspaceRole } from "@prisma/client";

const INVITE_EXPIRATION_HOURS = 48;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function generateWorkspaceSlug(base: string): Promise<string> {
  const candidateBase = slugify(base) || `workspace-${nanoid(6)}`;
  let candidate = candidateBase;
  let iteration = 0;

  while (true) {
    const existing = await prisma.workspace.findUnique({ where: { slug: candidate } });
    if (!existing) {
      return candidate;
    }
    iteration += 1;
    candidate = `${candidateBase}-${iteration}`;
    if (iteration > 10) {
      candidate = `${candidateBase}-${nanoid(4)}`;
    }
  }
}

async function setDefaultWorkspace(userId: string, workspaceId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { defaultWorkspaceId: workspaceId },
  });
}

export async function ensureWorkspaceForUser(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      defaultWorkspaceId: true,
      memberships: {
        select: { workspaceId: true },
        orderBy: { createdAt: "asc" },
        take: 1,
      },
    },
  });

  if (!user) {
    return;
  }

  if (user.defaultWorkspaceId) {
    return;
  }

  if (user.memberships.length > 0) {
    await setDefaultWorkspace(user.id, user.memberships[0]!.workspaceId);
    return;
  }

  const displayName = user.name?.trim() || user.email?.split("@")[0] || "Workspace";
  const workspaceName = `${displayName}'s Team`;
  const slug = await generateWorkspaceSlug(displayName);

  const workspace = await prisma.workspace.create({
    data: {
      name: workspaceName,
      slug,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
  });

  await setDefaultWorkspace(user.id, workspace.id);

  await prisma.auditLog.create({
    data: {
      workspaceId: workspace.id,
      actorId: user.id,
      action: "workspace.created",
      metadata: {
        reason: "auto-provision",
      },
    },
  });

  logger.info("Workspace provisioned for user", { userId: user.id, workspaceId: workspace.id });
}

export async function listWorkspacesForUser(userId: string) {
  return prisma.workspaceMember.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      workspace: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function createWorkspace(userId: string, name: string) {
  const slug = await generateWorkspaceSlug(name);
  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      memberships: {
        create: {
          userId,
          role: "OWNER",
          status: "ACTIVE",
        },
      },
    },
    include: {
      memberships: true,
    },
  });

  await setDefaultWorkspace(userId, workspace.id);

  await prisma.auditLog.create({
    data: {
      workspaceId: workspace.id,
      actorId: userId,
      action: "workspace.created",
      target: workspace.id,
      metadata: { name },
    },
  });

  return workspace;
}

export async function recordAuditLog(params: {
  workspaceId?: string;
  actorId?: string;
  action: string;
  target?: string;
  metadata?: Prisma.JsonValue;
  ipAddress?: string | null;
}) {
  await prisma.auditLog.create({
    data: {
      workspaceId: params.workspaceId,
      actorId: params.actorId,
      action: params.action,
      target: params.target,
      metadata: params.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: params.ipAddress ?? undefined,
    },
  });
}

async function assertCanManageWorkspace(userId: string, workspaceId: string): Promise<WorkspaceRole> {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, status: "ACTIVE" },
  });

  if (!membership) {
    throw new Error("Not a member of this workspace");
  }

  if (membership.role === "MEMBER") {
    throw new Error("Insufficient permissions");
  }

  return membership.role;
}

export async function inviteToWorkspace(params: {
  workspaceId: string;
  inviterId: string;
  email: string;
  role: WorkspaceRole;
}) {
  await assertCanManageWorkspace(params.inviterId, params.workspaceId);

  const existingMember = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: params.workspaceId,
      user: { email: params.email },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this workspace");
  }

  const existingInvite = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId: params.workspaceId,
      email: params.email,
      status: "PENDING",
    },
  });

  if (existingInvite) {
    return existingInvite;
  }

  const token = nanoid(32);
  const expiresAt = new Date(Date.now() + INVITE_EXPIRATION_HOURS * 60 * 60 * 1000);

  const invite = await prisma.workspaceInvite.create({
    data: {
      email: params.email.toLowerCase(),
      workspaceId: params.workspaceId,
      role: params.role,
      token,
      expiresAt,
      creatorId: params.inviterId,
    },
    include: {
      workspace: true,
    },
  });

  await recordAuditLog({
    workspaceId: params.workspaceId,
    actorId: params.inviterId,
    action: "workspace.invite.created",
    target: invite.email,
    metadata: { inviteId: invite.id, role: invite.role },
  });

  const env = getServerEnv();
  const acceptUrl = `${env.APP_URL}/invites/${invite.token}`;

  await sendMail({
    to: invite.email,
    subject: `You're invited to ${invite.workspace.name}`,
    text: `Join ${invite.workspace.name} on ${env.APP_URL}. Invitation link: ${acceptUrl}`,
    html: `<p>You have been invited to join <strong>${invite.workspace.name}</strong>.</p><p><a href="${acceptUrl}">Accept your invite</a></p>`,
    tags: { type: "workspace.invite" },
  });

  return invite;
}

export async function getInviteByToken(token: string) {
  return prisma.workspaceInvite.findUnique({
    where: { token },
    include: {
      workspace: {
        select: {
          id: true,
          name: true,
        },
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function acceptInvite(params: { token: string; userId: string }) {
  const invite = await prisma.workspaceInvite.findUnique({
    where: { token: params.token },
  });

  if (!invite) {
    throw new Error("Invitation not found");
  }

  if (invite.status !== "PENDING") {
    throw new Error("Invitation is no longer valid");
  }

  if (invite.expiresAt < new Date()) {
    await prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: { status: "EXPIRED" },
    });
    throw new Error("Invitation has expired");
  }

  await prisma.$transaction([
    prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: params.userId,
          workspaceId: invite.workspaceId,
        },
      },
      create: {
        userId: params.userId,
        workspaceId: invite.workspaceId,
        role: invite.role,
        status: "ACTIVE",
      },
      update: {
        role: invite.role,
        status: "ACTIVE",
      },
    }),
    prisma.workspaceInvite.update({
      where: { id: invite.id },
      data: {
        status: "ACCEPTED",
        acceptedAt: new Date(),
      },
    }),
  ]);

  await setDefaultWorkspace(params.userId, invite.workspaceId);

  await recordAuditLog({
    workspaceId: invite.workspaceId,
    actorId: params.userId,
    action: "workspace.invite.accepted",
    metadata: { inviteId: invite.id },
  });

  return invite.workspaceId;
}

export async function getWorkspaceSummary(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      memberships: {
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      invites: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function switchDefaultWorkspace(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findFirst({
    where: { userId, workspaceId, status: "ACTIVE" },
  });

  if (!membership) {
    throw new Error("You are not a member of this workspace");
  }

  await setDefaultWorkspace(userId, workspaceId);
}

export async function removeMember(params: { workspaceId: string; actorId: string; memberId: string }) {
  await assertCanManageWorkspace(params.actorId, params.workspaceId);

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: params.memberId, workspaceId: params.workspaceId } },
  });

  if (!membership) {
    throw new Error("Member not found");
  }

  if (membership.role === "OWNER") {
    throw new Error("Cannot remove workspace owner");
  }

  await prisma.workspaceMember.delete({
    where: { userId_workspaceId: { userId: params.memberId, workspaceId: params.workspaceId } },
  });

  await recordAuditLog({
    workspaceId: params.workspaceId,
    actorId: params.actorId,
    action: "workspace.member.removed",
    target: params.memberId,
  });
}

export async function cancelInvite(params: { workspaceId: string; actorId: string; inviteId: string }) {
  await assertCanManageWorkspace(params.actorId, params.workspaceId);

  await prisma.workspaceInvite.update({
    where: { id: params.inviteId },
    data: { status: "CANCELED" },
  });

  await recordAuditLog({
    workspaceId: params.workspaceId,
    actorId: params.actorId,
    action: "workspace.invite.canceled",
    metadata: { inviteId: params.inviteId },
  });
}
