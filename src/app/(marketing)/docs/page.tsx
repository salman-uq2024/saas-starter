import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const docs = [
  {
    slug: "install",
    title: "Installation Guide",
    description: "Get the starter running locally with Node, Prisma, and seeded demo data.",
  },
  {
    slug: "deploy",
    title: "Deployment Guide",
    description: "Step-by-step instructions for Vercel, staging, and production environments.",
  },
  {
    slug: "ops",
    title: "Operations Runbook",
    description: "Backups, rollbacks, troubleshooting, and health checks for the hosted demo.",
  },
  {
    slug: "demo-guide",
    title: "Demo Guide",
    description: "Narrated flow for a two-minute portfolio walkthrough or Loom recording.",
  },
  {
    slug: "loom-script",
    title: "2-Minute Demo Script",
    description: "Scripted voiceover cues for pitching the project to clients or employers.",
  },
  {
    slug: "security",
    title: "Security Best Practices",
    description: "Summary of auth, rate limiting, secret management, and Stripe safeguards.",
  },
];

export default function DocsIndexPage() {
  return (
    <section className="container py-16">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Documentation &amp; Playbooks
        </h1>
        <p className="text-sm text-slate-500">
          Everything you need to install, deploy, and showcase the SaaS Starter. These pages render directly from the markdown
          files in the repository so they stay in sync with the codebase.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {docs.map((doc) => (
          <Card
            key={doc.slug}
            className="border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-900"
          >
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <p>{doc.description}</p>
              <Link href={`/docs/${doc.slug}`} className="text-sky-600 hover:underline">
                Read documentation
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
