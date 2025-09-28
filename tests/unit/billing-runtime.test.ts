import { beforeEach, describe, expect, it, vi } from "vitest";

const mockStripe = vi.fn();

function mockEnv(values: Partial<Record<string, string | undefined>>) {
  vi.doMock("@/lib/env", () => ({
    getServerEnv: vi.fn(() => ({
      STRIPE_SECRET_KEY: values.STRIPE_SECRET_KEY,
      STRIPE_PRICE_ID_PRO: values.STRIPE_PRICE_ID_PRO,
      STRIPE_WEBHOOK_SECRET: values.STRIPE_WEBHOOK_SECRET,
      APP_URL: values.APP_URL ?? "http://localhost:3000",
    })),
  }));
}

describe("getBillingRuntimeInfo", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.doMock("stripe", () => ({
      __esModule: true,
      default: class Stripe {
        constructor(...args: unknown[]) {
          mockStripe(args);
        }
      },
    }));
  });

  it("reports stub mode when secrets are missing", async () => {
    mockEnv({});
    const { getBillingRuntimeInfo } = await import("@/server/billing");

    expect(getBillingRuntimeInfo()).toEqual({ mode: "stub", webhookConfigured: false });
    expect(mockStripe).not.toHaveBeenCalled();
  });

  it("reports live mode when keys and webhook secret are present", async () => {
    mockEnv({
      STRIPE_SECRET_KEY: "sk_test_123",
      STRIPE_PRICE_ID_PRO: "price_123",
      STRIPE_WEBHOOK_SECRET: "whsec_test",
    });
    const { getBillingRuntimeInfo } = await import("@/server/billing");

    expect(getBillingRuntimeInfo()).toEqual({ mode: "live", webhookConfigured: true });
    expect(mockStripe).toHaveBeenCalledOnce();
  });
});
