import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

export default function PrivacyPage() {
  return (
    <section className="container py-16">
      <Card className="mx-auto max-w-3xl border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Privacy Notice</CardTitle>
          <p className="text-sm text-slate-500">Effective date: February 13, 2026</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            {publicEnv.NEXT_PUBLIC_APP_NAME} stores account details, workspace membership data, and audit events needed to provide
            authentication, collaboration, and billing.
          </p>
          <p>
            Stripe is used for subscription workflows when configured, and your payment details are handled by Stripe directly.
            Email delivery providers process sign-in and invite messages when SMTP is enabled.
          </p>
          <p>
            This project is a starter template. Update this notice with your legal basis, retention windows, and support contact
            before production use.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
