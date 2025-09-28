import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string, workspaceId: string) {
  const workspace = await prisma.workspace.findUnique({
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
      },
      auditLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const membership = workspace.memberships.find((member) => member.userId === userId);
  if (!membership) {
    throw new Error("You do not have access to this workspace");
  }

  return {
    workspace,
    membership,
    metrics: {
      memberCount: workspace.memberships.length,
      pendingInvites: workspace.invites.length,
      plan: workspace.plan,
      billingStatus: workspace.billingStatus,
    },
    auditTrail: workspace.auditLogs,
  };
}
