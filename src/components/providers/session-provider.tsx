"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthProviderProps {
  session: Session | null;
  children: React.ReactNode;
}

export function AuthProvider({ session, children }: AuthProviderProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
