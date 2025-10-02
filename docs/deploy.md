# Deployment Guide

Deploy this SaaS starter to platforms like Vercel, Render, or Fly.io with minimal configuration. This guide provides step-by-step instructions for demo, staging, and production environments, assuming you've completed the [Installation Guide](install.md).

## Prerequisites

- A GitHub repository with your forked/cloned project.
- Platform account (e.g., Vercel for serverless, or a VPS for self-hosted).
- Database: SQLite for demos; PostgreSQL (managed like Supabase or AWS RDS) for production.
- Secrets: Stripe keys (test for staging, live for prod), SMTP for emails, and a strong `AUTH_SECRET`.
- Optional: Domain name for custom URLs.

Ensure local setup passes checks: `npm run lint`, `npm run typecheck`, and `npm run test`.

## Quick Demo Deployment (Vercel Hobby Plan)

Ideal for portfolios or quick shares. Vercel handles builds, scaling, and previews.

1. **Import Repository**:
   - Log in to [vercel.com](https://vercel.com).
   - Click *New Project* > Import your GitHub repo.

2. **Configure Environment Variables**:
   - In Project Settings > Environment Variables, add keys from `.env.example`.
   - Set `APP_URL` to `https://your-project.vercel.app`.
   - For demos: Leave Stripe/SMTP blank (uses stubs); add `AUTH_SECRET` (generate via `openssl rand -base64 32`).

   | Key | Value for Demo |
   |-----|----------------|
   | `AUTH_SECRET` | Your generated secret |
   | `APP_URL` | Project URL from Vercel |
   | `DATABASE_URL` | `file:./dev.db` (SQLite) or Postgres connection |

3. **Set Build Commands**:
   - Install: `npm install`
   - Build: `npm run build`
   - Output Directory: `.next`
   - Root Directory: `./` (default)

4. **Deploy and Verify**:
   - Click *Deploy*. Vercel runs CI (lint, test, build).
   - Once live, visit `/login` > **Use demo account** to access seeded data.
   - Test: Create a workspace, send an invite (stub email logs to console).

Previews auto-deploy on branches; promote to production after checks.

## Staging and Production Environments

Separate environments to avoid mixing data/secrets.

| Environment | Purpose | Setup Recommendations |
|-------------|---------|-----------------------|
| **Staging** | Testing, demos | SQLite or lightweight Postgres; Stripe **test** keys; stub emails |
| **Production** | Live users | Managed Postgres (backups enabled); Stripe **live** keys + webhooks; Real SMTP |

- **Never share secrets** between envs. Use platform vaults (Vercel Secrets, AWS SSM).
- Update `APP_URL` to your domain (e.g., `https://app.example.com`).

### Step 1: Provision Secrets

Create env files or platform secrets:

| Key | Staging Notes | Production Notes |
|-----|---------------|------------------|
| `DATABASE_URL` | Throwaway DB | Managed Postgres with PITR backups |
| `AUTH_SECRET` | Unique per env | Regenerate if compromised |
| `APP_URL` | `https://staging.example.com` | `https://app.example.com` |
| `NEXT_PUBLIC_APP_NAME` | "SaaS Starter Staging" | Your branded name |
| `STRIPE_SECRET_KEY` | Test key | Live key |
| `STRIPE_PRICE_ID_PRO` | Test price ID | Live price ID |
| `STRIPE_WEBHOOK_SECRET` | Test webhook secret | Live webhook secret |
| `SMTP_*` | Sandbox (e.g., Mailtrap) | Provider like SendGrid |

Validate with local `npm run dev` before deploying.

### Step 2: Database Setup

For production (Postgres):

```bash
# Generate Prisma client
npm run db:generate

# Apply migrations (in CI/CD or manually)
npx prisma migrate deploy
```

- Commit migrations to Git for reproducibility.
- Seed demo data only in staging: `npm run db:seed`.
- See [Database Schema](architecture.md#database-schema-highlights) for details.

### Step 3: Configure Stripe Webhooks

1. In Stripe Dashboard > Webhooks > Add endpoint:
   - URL: `https://your-domain.com/api/billing/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

2. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.

Without this, billing falls back to stubs. Test by upgrading a workspace.

### Step 4: Build and Deploy

```bash
npm install
npm run build
npm run start  # For self-hosted; Vercel auto-starts
```

- **Vercel**: Git push triggers auto-deploy.
- **Other Platforms**: Use Docker or PM2 for Node.js runtime (Node 20+).
- CI: GitHub Actions (`.github/workflows/ci.yml`) runs checks; require for merges.

### Step 5: Post-Deployment Checklist

- [ ] **Auth Test**: Sign in via magic link or demo; verify session.
- [ ] **Billing Flow**: Upgrade to Pro (test mode); confirm webhook updates status.
- [ ] **Invites**: Send workspace invite; check email delivery and acceptance.
- [ ] **Health Checks**: Run `npm run test` in staging; monitor logs for errors.
- [ ] **Backups**: Set up DB snapshots; test restore (see [Operations Runbook](ops.md)).
- [ ] **Monitoring**: Add alerts for 5xx errors, rate limits, and webhook failures.

For packaging (ZIP + checksum for handoff):

```bash
npm run package
```

Outputs to `dist/`; share with clients.

## Troubleshooting

- **Build Fails**: Check env vars; run `npm run build` locally.
- **DB Connection**: Verify `DATABASE_URL`; ensure provider allows connections.
- **Emails Not Sending**: Confirm SMTP; use stubs for testing.
- **Rate Limits**: Adjust `RATE_LIMIT_MAX` if traffic spikes.

Refer to [Security Best Practices](security.md) for hardening and [Features](features.md) for advanced configs. For local ops, see [Operations Runbook](ops.md).

Your SaaS is now live—explore the [Dashboard](https://your-domain.com/dashboard)!