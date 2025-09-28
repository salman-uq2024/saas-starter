import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyRequestPage() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <Card className="border-none bg-transparent shadow-none">
        <CardHeader className="flex items-center justify-center gap-3 p-0">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
            <MailCheck className="h-7 w-7" aria-hidden />
          </span>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Check your email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-0 pt-6 text-sm text-slate-600 dark:text-slate-300">
          <p>We sent a one-time sign-in link. Open it to continue.</p>
          <p className="text-xs text-slate-500">
            No email? In local development, the magic link prints to your terminal. Otherwise check your promotions or spam folders.
          </p>
          <div className="flex flex-col gap-3 text-sm text-slate-500">
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Use a different email
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
