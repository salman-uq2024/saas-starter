import type { Metadata } from "next";
import "./globals.css";
import { getPublicEnv, getServerEnv } from "@/lib/env";
import { getServerAuthSession } from "@/server/auth";
import { AuthProvider } from "@/components/providers/session-provider";

const publicEnv = getPublicEnv();
const serverEnv = getServerEnv();

const robots = serverEnv.DISABLE_INDEXING
  ? {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    }
  : {
      index: true,
      follow: true,
    };

export const metadata: Metadata = {
  metadataBase: new URL(serverEnv.APP_URL),
  title: `${publicEnv.NEXT_PUBLIC_APP_NAME} · Modern SaaS starter kit`,
  description: `${publicEnv.NEXT_PUBLIC_APP_NAME} helps teams launch fast with auth, billing, workspaces, and marketing built-in.`,
  openGraph: {
    title: `${publicEnv.NEXT_PUBLIC_APP_NAME} portfolio demo`,
    description: "A production-ready SaaS kit with Next.js, Prisma, and Stripe.",
    images: ["/og-image.png"],
    url: serverEnv.APP_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${publicEnv.NEXT_PUBLIC_APP_NAME} · Modern SaaS starter kit`,
    description: "Production-ready SaaS boilerplate with auth, billing, and workspaces.",
    images: ["/og-image.png"],
  },
  robots,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className="bg-[rgb(var(--background))] text-[rgb(var(--foreground))] antialiased">
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
