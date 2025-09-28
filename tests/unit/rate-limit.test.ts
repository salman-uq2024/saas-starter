import { beforeAll, describe, expect, it } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

beforeAll(() => {
  const globalAny = globalThis as Record<string, unknown>;
  if ("window" in globalAny) {
    delete globalAny.window;
  }
});

describe("rate limiting", () => {
  it("allows the first request and blocks after the window is exceeded", () => {
    const key = `test-user-${Date.now()}`;
    let lastResult = checkRateLimit(key);
    expect(lastResult.success).toBe(true);

    for (let i = 0; i < 49; i += 1) {
      lastResult = checkRateLimit(key);
      expect(lastResult.success).toBe(true);
    }

    const blocked = checkRateLimit(key);
    expect(blocked.success).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetAt).toBeGreaterThan(Date.now());
  });
});
