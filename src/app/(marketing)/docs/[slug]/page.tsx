import { promises as fs } from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderMarkdown } from "@/lib/markdown";

const docMap = {
  install: {
    file: "install.md",
    title: "Installation Guide",
    description: "Set up dependencies, configure environment variables, and seed demo data.",
  },
  deploy: {
    file: "deploy.md",
    title: "Deployment Guide",
    description: "Deploy to Vercel or your infrastructure with environment and database tips.",
  },
  ops: {
    file: "ops.md",
    title: "Operations Runbook",
    description: "Operational procedures for backups, rollbacks, and monitoring.",
  },
  "demo-guide": {
    file: "demo-guide.md",
    title: "Demo Guide",
    description: "Two-minute walkthrough and preparation checklist for live demos.",
  },
  "loom-script": {
    file: "loom-script.md",
    title: "2-Minute Demo Script",
    description: "Scripted narration to accompany the guided tour.",
  },
  security: {
    file: "security.md",
    title: "Security Best Practices",
    description: "How the starter protects secrets, auth, rate limiting, and Stripe webhooks.",
  },
} as const;

type DocSlug = keyof typeof docMap;

async function loadDoc(slug: DocSlug) {
  const doc = docMap[slug];
  const filePath = path.join(process.cwd(), "docs", doc.file);
  try {
    const markdown = await fs.readFile(filePath, "utf8");
    return { ...doc, html: await renderMarkdown(markdown) };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function generateStaticParams() {
  return Object.keys(docMap).map((slug) => ({ slug }));
}

interface DocPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!(slug in docMap)) {
    return {};
  }
  const doc = docMap[slug as DocSlug];
  return {
    title: `${doc.title} · Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  if (!(slug in docMap)) {
    notFound();
  }

  const doc = await loadDoc(slug as DocSlug);
  if (!doc) {
    notFound();
  }

  return (
    <section className="container py-16">
      <Card className="mx-auto max-w-3xl border-slate-200/80 bg-white/90 shadow-lg backdrop-blur dark:border-slate-800/80 dark:bg-slate-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{doc.title}</CardTitle>
          <p className="text-sm text-slate-500">{doc.description}</p>
        </CardHeader>
        <CardContent>
          <article
            className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-sky-600 hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </CardContent>
      </Card>
    </section>
  );
}
