import type { Metadata } from "next";
import "./globals.css";
import { getPublicEnv } from "@/lib/env";
import { getServerAuthSession } from "@/server/auth";
import { AuthProvider } from "@/components/providers/session-provider";

const publicEnv = getPublicEnv();

export const metadata: Metadata = {
  metadataBase: new URL("https://saas-starter.example.com"),
  title: `${publicEnv.NEXT_PUBLIC_APP_NAME} · Modern SaaS starter kit`,
  description: `${publicEnv.NEXT_PUBLIC_APP_NAME} helps teams launch fast with auth, billing, workspaces, and marketing built-in.`,
  openGraph: {
    title: "SaaS Starter Portfolio Project",
    description: "A production-ready SaaS kit with Next.js, Prisma, and Stripe.",
    images: ["/og-image.png"],
    url: "https://saas-starter.example.com",
  },
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
