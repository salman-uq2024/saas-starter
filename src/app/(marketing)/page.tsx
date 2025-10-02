import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Zap, CreditCard, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicEnv } from "@/lib/env";

const publicEnv = getPublicEnv();

const featureList = [
  {
    title: "Launch-ready dashboard",
    description: "Authenticated experience with workspaces, audit trails, and responsive UI patterns ready for production.",
    icon: BarChart3,
  },
  {
    title: "Collaborative teams",
    description: "Invite teammates, manage roles, and track membership status with real-time updates.",
    icon: Users,
  },
  {
    title: "Revenue in minutes",
    description: "Stripe-powered subscriptions, billing portal, and webhook verification out of the box.",
    icon: CreditCard,
  },
  {
    title: "Zero-trust defaults",
    description: "Magic link auth, rate limits, audit logs, and build guards keep secrets server-side by design.",
    icon: ShieldCheck,
  },
];

const securityHighlights = [
  "Passwordless authentication with signed links",
  "Server-side secrets validation before every build",
  "Role-aware workspace access and invite lifecycle",
  "Webhook signature checks with deterministic stubs",
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for prototypes and internal tools.",
    features: [
      "Marketing site + docs",
      "Magic link authentication",
      "Unlimited workspaces",
      "SQLite by default (swap to Postgres)",
    ],
    cta: "Start for free",
    href: "/login",
  },
  {
    name: "Pro",
    price: "$29",
    description: "Everything teams need to launch paid products.",
    features: [
      "Stripe subscriptions + portal",
      "Role-based access control",
      "Audit log API + export",
      "Priority updates",
    ],
    cta: "Upgrade in app",
    href: "/login",
  },
];

export default function MarketingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-transparent to-sky-200/40 py-20">
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-sky-600/10 px-3 py-1 text-xs font-medium text-sky-700">
              New: Billing + audit logs included
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl dark:text-slate-50">
              SaaS Starter – Built by Salman
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Full-stack SaaS boilerplate with auth, billing, and workspaces
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="sm:w-auto">
                <Button className="w-full sm:w-auto" size="lg">
                  Launch demo workspace
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Button>
              </Link>
              <Link href="/docs/install" className="sm:w-auto">
                <Button className="w-full sm:w-auto" size="lg" variant="secondary">
                  Read the docs
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-500" aria-hidden />
                <span>Security-first defaults</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-500" aria-hidden />
                <span>CI-ready scripts</span>
              </div>
            </div>
          </div>
          <Card className="relative border-slate-200/70 bg-white/70 shadow-xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-900">
            <CardHeader>
              <CardTitle>What&apos;s included?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>
                {publicEnv.NEXT_PUBLIC_APP_NAME} ships with production-grade flows: workspace invites, billing lifecycle, seeded data,
                observability, and docs for your team to deploy confidently.
              </p>
              <ul className="grid gap-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                    1
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Plug-and-play auth</h3>
                    <p className="text-xs text-slate-500">
                      Passwordless login with magic links, workspace provisioning, and session middleware.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Billing that just works</h3>
                    <p className="text-xs text-slate-500">
                      Stripe Checkout, portal hand-off, webhooks, and deterministic stubs for local demos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">Ops-ready tooling</h3>
                    <p className="text-xs text-slate-500">
                      Typecheck, lint, unit + e2e tests, CI config, packaging script, and environment guard rails.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="features" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Everything founders expect</h2>
          <p className="mt-3 text-sm text-slate-500">
            Skip the scaffolding and focus on differentiation. Components, actions, and schemas are production-tested and fully
            typed.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {featureList.map((feature) => (
            <Card key={feature.title} className="h-full border-slate-200/80 bg-white/60 backdrop-blur dark:border-slate-800/80">
              <CardContent className="flex h-full flex-col gap-4">
                <feature.icon className="h-9 w-9 text-sky-500" aria-hidden />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{feature.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="security" className="bg-slate-900 py-20 text-slate-100">
        <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">Security & operations baked in</h2>
            <p className="text-sm text-slate-300">
              From rate-limited server actions to build-time secret guards, every flow is designed to protect your users and your
              team.
            </p>
          </div>
          <div className="grid gap-4">
            {securityHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                <span className="text-sm text-slate-100">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="container py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Simple pricing that scales with you</h2>
          <p className="mt-3 text-sm text-slate-500">
            Start with the free tier, upgrade when you&apos;re ready to charge customers. Billing runs entirely in Stripe test mode by
            default.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {pricing.map((plan) => (
            <Card key={plan.name} className="flex h-full flex-col border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <span className="text-2xl font-semibold">{plan.price}</span>
                </div>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between gap-6">
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-sky-500" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className="w-full" variant={plan.name === "Pro" ? "primary" : "secondary"}>
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-slate-100">
        <div className="container grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">What teams say</p>
            <h2 className="mt-3 text-3xl font-semibold">“We shipped our client demo in a weekend.”</h2>
            <p className="mt-4 text-sm text-slate-400">
              “The starter handled auth, workspace invites, and billing flows that usually take weeks. We focused on our differentiating
              features and closed the deal fast.”
            </p>
            <p className="mt-6 text-sm font-medium text-slate-200">Alex Rivera — Fractional CTO</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            <h3 className="text-base font-semibold text-slate-100">Demo-ready defaults</h3>
            <p className="mt-2 text-slate-400">
              Seed script provisions a workspace with owners, admins, invites, and audit logs so you can demo capabilities on day one.
            </p>
            <ul className="mt-6 space-y-2 text-xs text-slate-400">
              <li>• Test user: founder@example.com</li>
              <li>• Invite token: seed-token-demo</li>
              <li>• Billing stubs when Stripe keys are absent</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="container flex flex-col items-center gap-6 rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-800 dark:bg-slate-800/40">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Ready to ship your next SaaS?</h2>
          <p className="max-w-xl text-sm text-slate-500">
            Clone the repo, run the seed script, and start demoing. Production deploys come with CI, docs, and packaging scripts from day
            zero.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button size="lg">Start the demo</Button>
            </Link>
            <Link href="/docs/deploy">
              <Button size="lg" variant="secondary">
                View deployment checklist
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
