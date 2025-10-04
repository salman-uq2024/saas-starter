import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type EnvState = NodeJS.ProcessEnv;

const ORIGINAL_ENV = { ...process.env } as EnvState;

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
  delete process.env.DATABASE_URL;
  delete process.env.AUTH_SECRET;
  delete process.env.RATE_LIMIT_MAX;
  delete process.env.RATE_LIMIT_WINDOW_MINUTES;
  // Ensure server-only env loader treats test environment as server-side
  const globalAny = globalThis as Record<string, unknown>;
  if ("window" in globalAny) {
    delete globalAny.window;
  }
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("environment configuration", () => {
  it("falls back to defaults when optional variables are missing", async () => {
    const { getServerEnv, getPublicEnv } = await import("@/lib/env");
    const server = getServerEnv();
    const client = getPublicEnv();

    expect(server.DATABASE_URL).toBe("file:./dev.db");
    expect(server.RATE_LIMIT_MAX).toBe(50);
    expect(server.DISABLE_INDEXING).toBe(false);
    expect(client.NEXT_PUBLIC_APP_NAME).toBeTruthy();
  });

  it("throws when required variables are invalid", async () => {
    process.env.AUTH_SECRET = "short";
    const { getServerEnv } = await import("@/lib/env");
    expect(() => getServerEnv()).toThrow();
  });
});
