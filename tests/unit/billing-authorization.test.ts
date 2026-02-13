import { beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();

  vi.doMock("@/lib/env", () => ({
    getServerEnv: vi.fn(() => ({
      STRIPE_SECRET_KEY: undefined,
      STRIPE_PRICE_ID_PRO: undefined,
      STRIPE_WEBHOOK_SECRET: undefined,
      APP_URL: "http://localhost:3000",
    })),
  }));

  vi.doMock("@/lib/logger", () => ({
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
  }));

  vi.doMock("@/server/workspaces", () => ({
    recordAuditLog: vi.fn(),
  }));

  vi.doMock("@/lib/prisma", () => ({
    prisma: {
      workspaceMember: {
        findFirst: vi.fn(async () => null),
      },
      workspace: {
        update: vi.fn(),
      },
    },
  }));
});

describe("billing authorization", () => {
  it("blocks checkout session creation for users outside the workspace", async () => {
    const { createCheckoutSession } = await import("@/server/billing");

    await expect(createCheckoutSession({ workspaceId: "ws_1", actorId: "user_1" })).rejects.toThrow(
      "You do not have access to this workspace"
    );
  });

  it("blocks billing portal session creation for users outside the workspace", async () => {
    const { createBillingPortalSession } = await import("@/server/billing");

    await expect(createBillingPortalSession({ workspaceId: "ws_1", actorId: "user_1" })).rejects.toThrow(
      "You do not have access to this workspace"
    );
  });
});
