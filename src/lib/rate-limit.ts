import { getServerEnv } from "./env";

const buckets = new Map<string, { remaining: number; resetAt: number }>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(key: string): RateLimitResult {
  const env = getServerEnv();
  const windowMs = env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000;
  const limit = env.RATE_LIMIT_MAX;
  const now = Date.now();

  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    const resetAt = now + windowMs;
    buckets.set(key, { remaining: limit - 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  if (existing.remaining <= 0) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.remaining -= 1;
  buckets.set(key, existing);
  return { success: true, remaining: existing.remaining, resetAt: existing.resetAt };
}

type HeaderLike = Pick<Headers, "get">;

export function rateLimitKeyFromRequestHeaders(headers: HeaderLike): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() ?? "unknown";
  }
  return headers.get("x-real-ip") ?? "anonymous";
}
