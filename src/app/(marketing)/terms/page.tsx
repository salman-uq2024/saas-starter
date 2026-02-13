import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

export default function TermsPage() {
  return (
    <section className="container py-16">
      <Card className="mx-auto max-w-3xl border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Terms of Service</CardTitle>
          <p className="text-sm text-slate-500">Effective date: February 13, 2026</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>
            These terms govern your use of {publicEnv.NEXT_PUBLIC_APP_NAME}. By using the service, you agree to use it lawfully and
            keep your account details accurate.
          </p>
          <p>
            You are responsible for activity within your workspace, including invites and billing actions. Do not use the platform
            to harm systems, bypass access controls, or violate applicable laws.
          </p>
          <p>
            The starter is provided as-is for portfolio and development purposes. Review and customize these terms before launching
            a production service.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
