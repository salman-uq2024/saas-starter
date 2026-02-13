import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  workspace: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findFirst: vi.fn(),
  },
  workspaceMember: {
    findFirst: vi.fn(),
    upsert: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    delete: vi.fn(),
    findMany: vi.fn(),
  },
  workspaceInvite: {
    findUnique: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    findFirst: vi.fn(),
    create: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  auditLog: {
    create: vi.fn(),
  },
  $transaction: vi.fn(),
};

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

vi.mock("@/server/mailer", () => ({
  sendMail: vi.fn(async () => true),
}));

vi.mock("@/lib/env", () => ({
  getServerEnv: vi.fn(() => ({
    APP_URL: "http://localhost:3000",
  })),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe("workspace security checks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.workspaceMember.findFirst.mockResolvedValue({
      workspaceId: "ws_1",
      userId: "owner_1",
      role: "ADMIN",
      status: "ACTIVE",
    });
  });

  it("rejects invite acceptance when signed-in email does not match invite email", async () => {
    const { acceptInvite } = await import("@/server/workspaces");

    prismaMock.workspaceInvite.findUnique.mockResolvedValue({
      id: "invite_1",
      token: "token_1",
      email: "teammate@example.com",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 60_000),
      workspaceId: "ws_1",
      role: "MEMBER",
    });
    prismaMock.user.findUnique.mockResolvedValue({ email: "different@example.com" });

    await expect(acceptInvite({ token: "token_1", userId: "user_1" })).rejects.toThrow(
      "Sign in with teammate@example.com to accept this invitation."
    );
    expect(prismaMock.$transaction).not.toHaveBeenCalled();
  });

  it("accepts invite when user email only differs by case", async () => {
    const { acceptInvite } = await import("@/server/workspaces");

    prismaMock.workspaceInvite.findUnique.mockResolvedValue({
      id: "invite_1",
      token: "token_1",
      email: "Teammate@Example.com",
      status: "PENDING",
      expiresAt: new Date(Date.now() + 60_000),
      workspaceId: "ws_1",
      role: "MEMBER",
    });
    prismaMock.user.findUnique.mockResolvedValue({ email: "teammate@example.com" });
    prismaMock.$transaction.mockResolvedValue([]);
    prismaMock.user.update.mockResolvedValue({});
    prismaMock.auditLog.create.mockResolvedValue({});

    const workspaceId = await acceptInvite({ token: "token_1", userId: "user_1" });

    expect(workspaceId).toBe("ws_1");
    expect(prismaMock.$transaction).toHaveBeenCalledOnce();
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: "user_1" },
      data: { defaultWorkspaceId: "ws_1" },
    });
  });

  it("does not allow canceling invite IDs from another workspace", async () => {
    const { cancelInvite } = await import("@/server/workspaces");

    prismaMock.workspaceInvite.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      cancelInvite({
        workspaceId: "ws_1",
        actorId: "owner_1",
        inviteId: "invite_other_workspace",
      })
    ).rejects.toThrow("Invite not found");
    expect(prismaMock.auditLog.create).not.toHaveBeenCalled();
  });
});
