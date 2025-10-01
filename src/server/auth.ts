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
  session: { strategy: "jwt" },
  secret: serverEnv.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
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
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = typeof token.id === "string" ? token.id : "";
        session.user.defaultWorkspaceId =
          typeof token.defaultWorkspaceId === "string" ? token.defaultWorkspaceId : undefined;
        session.user.email = typeof token.email === "string" ? token.email : session.user.email;
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
        session.user.timezone = typeof token.timezone === "string" ? token.timezone : undefined;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image ?? undefined;
        token.timezone = user.timezone ?? undefined;
        token.defaultWorkspaceId = user.defaultWorkspaceId ?? undefined;
        return token;
      }
      if (!token.id && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            timezone: true,
            defaultWorkspaceId: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name ?? undefined;
          token.picture = dbUser.image ?? undefined;
          token.timezone = dbUser.timezone ?? undefined;
          token.defaultWorkspaceId = dbUser.defaultWorkspaceId ?? undefined;
        }
      }
      return token;
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
