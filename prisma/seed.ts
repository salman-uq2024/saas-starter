import { PrismaClient, WorkspaceRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function upsertUser(
  email: string,
  name: string,
  workspaceId: string,
  role: WorkspaceRole,
  timezone: string,
  password?: string
) {
  const userData: any = {
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
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    userData.create.password = hashedPassword;
    userData.update.password = hashedPassword;
  }

  const user = await prisma.user.upsert(userData);

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

  const owner = await upsertUser("founder@example.com", "Founding User", workspace.id, "OWNER", "America/New_York", "password123");
  const teammate = await upsertUser("teammate@example.com", "Teammate", workspace.id, "ADMIN", "Europe/London", "password123");

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

  const demoUser = await upsertUser("demo@saas.com", "Demo User", demoWorkspace.id, "OWNER", "UTC", "password123");

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

  // Add sample invite for demo workspace
  await prisma.workspaceInvite.upsert({
    where: { token: "demo-invite-token" },
    update: {
      email: "demo-invite@saas.com",
      workspaceId: demoWorkspace.id,
      role: "MEMBER",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
    },
    create: {
      email: "demo-invite@saas.com",
      workspaceId: demoWorkspace.id,
      role: "MEMBER",
      token: "demo-invite-token",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
      creatorId: demoUser.id,
    },
  });

  // Set test subscription for acme workspace (stub for demo)
  await prisma.workspace.update({
    where: { id: workspace.id },
    data: {
      stripeSubscriptionId: "sub_test_12345", // Mock test sub ID
      stripeCustomerId: "cus_test_12345", // Mock test customer ID
      plan: "PRO",
      billingStatus: "ACTIVE",
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
