import type { NextRequest } from "next/server";
import { authOptions } from "@/server/auth";

async function resolveHandler() {
  const { default: NextAuth } = await import("next-auth/next");
  return NextAuth(authOptions);
}

export const runtime = "nodejs";

type AuthHandler = Awaited<ReturnType<typeof resolveHandler>>;
type AuthContext = Parameters<AuthHandler["GET"]>[1];

export async function GET(request: NextRequest, context: AuthContext) {
  const handler = await resolveHandler();
  return handler.GET(request, context);
}

export async function POST(request: NextRequest, context: AuthContext) {
  const handler = await resolveHandler();
  return handler.POST(request, context);
}
