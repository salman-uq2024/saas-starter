import { headers } from "next/headers";
import { getServerAuthSession } from "@/server/auth";
import { checkRateLimit, rateLimitKeyFromRequestHeaders } from "@/lib/rate-limit";

export async function requireUser() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function enforceRateLimit(prefix: string) {
  const headerList = await headers();
  const key = `${prefix}:${rateLimitKeyFromRequestHeaders(headerList)}`;
  const result = checkRateLimit(key);
  if (!result.success) {
    throw new Error("Too many requests. Please wait and try again.");
  }
}
