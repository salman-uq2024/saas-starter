# Deployment Guide

Use this checklist when promoting the SaaS Starter to staging or production.

## 1. Decide on environments

| Environment | Goal | Recommended setup |
| --- | --- | --- |
| **Staging** | Internal reviews, demo data | SQLite or lightweight Postgres, Stripe **test** keys, stub email delivery |
| **Production** | Live customers | Managed Postgres, Stripe **live** keys + webhooks, SMTP provider |

Keep staging and production entirely separate—unique databases, Stripe projects, and env files. Never reuse secrets across environments.

## 2. Provision secrets

Create `.env.staging` / `.env.production` (or use your platform’s secret store) with the following values:

| Key | Notes |
| --- | --- |
| `DATABASE_URL` | Point staging to a throwaway database; production should use managed Postgres with backups enabled. |
| `AUTH_SECRET` | 32+ character secret per environment. Regenerate if leaked. |
| `APP_URL` | Full HTTPS URL (e.g., `https://staging.example.com`). |
| `NEXT_PUBLIC_APP_NAME` | Matches your branding per environment. |
| `STRIPE_SECRET_KEY` | Test or live secret key tied to the right Stripe project. |
| `STRIPE_PRICE_ID_PRO` | Use a staging-specific price when possible. |
| `STRIPE_WEBHOOK_SECRET` | Per-environment secret from Stripe (required for live mode). |
| SMTP keys | Configure to deliver real magic links. Staging can point to a sandboxed inbox. |
| `RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MINUTES` | Adjust if production traffic differs from defaults. |

Store secrets in your platform’s vault (Vercel, Render, Fly.io, AWS SSM, etc.). Keep an encrypted handoff note for teammates specifying where each secret lives and who owns the master credentials.

## 3. Database migrations

```bash
npm run db:generate
npx prisma migrate deploy
```

For SQLite-based staging, ensure the file path in `DATABASE_URL` is writable. For Postgres, run migrations as part of your CI/CD pipeline before `npm run start`.

## 4. Stripe webhooks

Create a webhook endpoint per environment pointing to:

```
https://<env-domain>/api/billing/webhook
```

Listen for `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` so the handler verifies every request. Without a secret the app reverts to stub mode automatically.

## 5. Build & release

```bash
npm install
npm run build
```

Start the app with `npm run start` (Next.js production server). Make sure your host supports Node.js 20+.

CI (`.github/workflows/ci.yml`) already runs lint, typecheck, tests, and build on Ubuntu. Mirror the same steps in your deployment provider or keep CI as a required check before promotion.

## 6. Packaging handoff (optional)

Need a self-contained bundle for clients or offline deployment?

```bash
npm run package
```

The ZIP and corresponding SHA256 checksum appear in `dist/`. Share both alongside your secret handoff document.

## 7. Post-deploy checklist

- ✅ Smoke-test login and the dashboard using a staging account.
- ✅ Trigger a Stripe test checkout (staging) or low-value plan (production) and confirm webhooks update billing status.
- ✅ Send a magic link invite and ensure email delivery works end-to-end.
- ✅ Capture backups (see [`docs/ops.md`](ops.md)) and verify restore instructions.
