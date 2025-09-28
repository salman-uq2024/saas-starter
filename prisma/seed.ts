import { PrismaClient, WorkspaceRole } from "@prisma/client";

const prisma = new PrismaClient();

async function upsertUser(
  email: string,
  name: string,
  workspaceId: string,
  role: WorkspaceRole,
  timezone: string
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      defaultWorkspaceId: workspaceId,
      timezone,
    },
    create: {
      email,
      name,
      defaultWorkspaceId: workspaceId,
      timezone,
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
    update: {
      role,
      status: "ACTIVE",
    },
    create: {
      userId: user.id,
      workspaceId,
      role,
      status: "ACTIVE",
    },
  });

  return user;
}

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { slug: "acme" },
    update: {},
    create: {
      name: "Acme Inc",
      slug: "acme",
      plan: "PRO",
      billingStatus: "ACTIVE",
    },
  });

  const owner = await upsertUser("founder@example.com", "Founding User", workspace.id, "OWNER", "America/New_York");
  const teammate = await upsertUser("teammate@example.com", "Teammate", workspace.id, "ADMIN", "Europe/London");

  const demoWorkspace = await prisma.workspace.upsert({
    where: { slug: "demo-studio" },
    update: {},
    create: {
      name: "Demo Studio",
      slug: "demo-studio",
      plan: "FREE",
      billingStatus: "NONE",
    },
  });

  await prisma.workspaceMember.upsert({
    where: {
      userId_workspaceId: {
        userId: owner.id,
        workspaceId: demoWorkspace.id,
      },
    },
    update: {
      role: "OWNER",
      status: "ACTIVE",
    },
    create: {
      userId: owner.id,
      workspaceId: demoWorkspace.id,
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  await prisma.workspaceInvite.upsert({
    where: { token: "seed-token-demo" },
    update: {
      email: "newhire@example.com",
      workspaceId: workspace.id,
      role: "MEMBER",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
    create: {
      email: "newhire@example.com",
      workspaceId: workspace.id,
      role: "MEMBER",
      token: "seed-token-demo",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      creatorId: owner.id,
    },
  });

  await prisma.auditLog.createMany({
    data: [
      {
        workspaceId: workspace.id,
        actorId: owner.id,
        action: "workspace.created",
        target: workspace.id,
        metadata: { seed: true },
      },
      {
        workspaceId: workspace.id,
        actorId: teammate.id,
        action: "workspace.member.invited",
        target: "newhire@example.com",
        metadata: { seed: true },
      },
    ],
  });

  console.log("Seed data created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
