import Link from "next/link";
import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";
import { getServerAuthSession } from "@/server/auth";

const publicEnv = getPublicEnv();

export default async function LoginPage() {
  const session = await getServerAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="p-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white">
              <LogIn className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Sign in to {publicEnv.NEXT_PUBLIC_APP_NAME}
              </CardTitle>
              <p className="text-sm text-slate-500">We&apos;ll send a secure, single-use link to your inbox.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 pt-6">
          <LoginForm />
          <p className="mt-6 text-xs text-slate-500">
            By continuing you agree to the <Link href="#" className="underline">terms</Link> and confirm you reviewed the
            <Link href="#" className="ml-1 underline">privacy notice</Link>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
