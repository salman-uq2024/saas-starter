import { prisma } from "@/lib/prisma";

export async function getWorkspaceSettings(workspaceId: string) {
  return prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      memberships: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      invites: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}
