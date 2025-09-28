import { beforeEach, describe, expect, it, vi } from "vitest";

const loggerMock = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

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

  vi.doMock("@/lib/logger", () => ({ logger: loggerMock }));
  vi.doMock("@/lib/prisma", () => ({
    prisma: {
      workspace: {
        findUnique: vi.fn(),
        update: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  }));
  vi.doMock("@/server/workspaces", () => ({ recordAuditLog: vi.fn() }));
});

describe("handleStripeWebhook", () => {
  it("returns stub mode when webhook secret is missing", async () => {
    const { handleStripeWebhook } = await import("@/server/billing");
    const result = await handleStripeWebhook(Buffer.from("{}"), undefined);

    expect(result).toEqual({ received: true, mode: "stub" });
    expect(loggerMock.info).toHaveBeenCalledWith("Skipping webhook handling (stub mode)");
  });
});
