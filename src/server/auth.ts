import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getPublicEnv, getServerEnv } from "@/lib/env";
import { sendMail } from "@/server/mailer";
import { logger } from "@/lib/logger";
import { ensureWorkspaceForUser } from "@/server/workspaces";
import CredentialsProvider from "next-auth/providers/credentials";

const serverEnv = getServerEnv();
const publicEnv = getPublicEnv();
const devCredentialsEnabled = process.env.NODE_ENV !== "production";

if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = serverEnv.APP_URL;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: serverEnv.AUTH_SECRET,
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify",
  },
  providers: [
    EmailProvider({
      from: serverEnv.AUTH_EMAIL_FROM ?? undefined,
      sendVerificationRequest: async ({ identifier, url }) => {
        const subject = `${publicEnv.NEXT_PUBLIC_APP_NAME} sign-in link`;
        const text = `Sign in to ${publicEnv.NEXT_PUBLIC_APP_NAME}: ${url}`;
        const html = `<p>Sign in to <strong>${publicEnv.NEXT_PUBLIC_APP_NAME}</strong></p><p><a href="${url}">Click here to sign in</a></p><p>If you did not request this, you can safely ignore this email.</p>`;

        const delivered = await sendMail({
          to: identifier,
          subject,
          text,
          html,
          tags: { type: "auth.magic_link" },
        });

        if (!delivered) {
          logger.info("Magic link issued (preview)", { email: identifier, url });
        }
      },
    }),
    ...(devCredentialsEnabled
      ? [
          CredentialsProvider({
            id: "dev-login",
            name: "Development",
            credentials: {
              email: { label: "Email", type: "email" },
            },
            async authorize(credentials) {
              const email = credentials?.email?.toString().trim().toLowerCase();
              if (!email) {
                throw new Error("Email is required");
              }

              const user = await prisma.user.upsert({
                where: { email },
                update: {},
                create: {
                  email,
                  name: email.split("@")[0] ?? "Demo user",
                },
              });

              return user;
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.defaultWorkspaceId = user.defaultWorkspaceId ?? undefined;
        session.user.email = user.email;
        session.user.name = user.name;
        session.user.image = user.image;
        session.user.timezone = user.timezone ?? undefined;
      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      await ensureWorkspaceForUser(user.id);
    },
    signIn: async ({ user }) => {
      await ensureWorkspaceForUser(user.id);
    },
  },
};

export const authHandlers = NextAuth(authOptions).handlers;

export async function getServerAuthSession() {
  return getServerSession(authOptions);
}
