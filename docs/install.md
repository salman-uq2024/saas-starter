# Installation Guide

Get this SaaS starter up and running on your machine in just a few minutes. This guide assumes basic familiarity with Node.js and Git.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: Version 20 or later. Download from [nodejs.org](https://nodejs.org/).
- **npm**: Version 10 or later (comes with Node.js). Verify with `npm --version`.
- **Git**: For cloning the repository. Install from [git-scm.com](https://git-scm.com/).
- **zip CLI**: Bundled with macOS/Linux; on Windows, install via `choco install zip` (requires Chocolatey).
- **Optional**: Stripe test keys (from [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)) to enable live billing simulations during demos.

For database options:
- **SQLite** (default for development): No additional setup needed.
- **PostgreSQL** (recommended for production): Install a client like pgAdmin or use a managed service (e.g., Supabase, Vercel Postgres).

## Step 1: Clone the Repository and Install Dependencies

Open your terminal and run:

```bash
git clone <your-repo-url> saas-starter
cd saas-starter
npm install
```

This installs all required packages, including Next.js, Prisma, NextAuth, and Stripe integrations.

## Step 2: Configure Environment Variables

Copy the example environment file and customize it:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values. Key variables include:

| Key                  | Description | Example/Default |
|----------------------|-------------|-----------------|
| `AUTH_SECRET`       | A secure secret for signing JWTs (generate with `openssl rand -base64 32`). Required for authentication. | `your-32-char-secret` |
| `APP_URL`           | Base URL of your app. Use `http://localhost:3000` for local development. | `http://localhost:3000` |
| `DATABASE_URL`      | Database connection string. Defaults to local SQLite (`file:./dev.db`). For Postgres: `postgresql://user:pass@localhost:5432/dbname`. | `file:./dev.db` |
| `STRIPE_SECRET_KEY` | Stripe secret key for billing (optional for stub mode). | `sk_test_...` |
| `STRIPE_PRICE_ID_PRO` | ID of your Pro plan price in Stripe (optional). | `price_123...` |
| `SMTP_*`            | SMTP settings for email (optional for local demos; required for magic links). | See `.env.example` |
| `DISABLE_INDEXING`  | Set to `true` to add `noindex`/`nofollow` headers for demo deployments. | `false` |

For full details, refer to the [Environment Validation](../src/lib/env.ts) in the codebase. Invalid configs will throw errors on startup.

## Step 3: Set Up the Database

Run the setup script to generate the Prisma client, apply the schema, and seed demo data:

```bash
npm run setup
```

- This creates tables based on [`prisma/schema.prisma`](prisma/schema.prisma).
- Seeds sample data: A demo user (`founder@example.com`), two workspaces ("Acme Inc", "Demo Studio"), and pending invites.
- For PostgreSQL: Update `provider = "postgresql"` in `schema.prisma`, set `DATABASE_URL`, then run `npx prisma migrate dev` instead of the setup script.

Verify the database: Check `dev.db` (SQLite) or connect to your Postgres instance.

## Step 4: Start the Development Server

Launch the app:

```bash
npm run dev
```

- The server runs on `http://localhost:3000`.
- Open `/login` in your browser.
- Click **Use demo account** to sign in as `founder@example.com` (no password needed).
- Alternatively, enter any email for a magic link (printed to terminal if SMTP is unset).

You'll land on the dashboard with access to seeded workspaces, billing stubs, and settings.

## Step 5: Run Quality Checks

Ensure everything is set up correctly:

```bash
npm run lint    # Checks code style (ESLint)
npm run typecheck  # Validates TypeScript
npm run test    # Runs unit (Vitest) and E2E (Playwright) tests
```

- If Playwright needs Chromium: Run `npx playwright install --with-deps`.
- All checks should pass for a healthy setup. See [Testing Suite](features.md#testing-suite) for details.

## Next Steps

- **Customize**: Update branding in `src/app/(marketing)/` and dashboard components.
- **Billing Demo**: Add Stripe test keys to `.env.local` and upgrade a workspace to see Checkout flow.
- **Deploy**: Follow the [Deployment Guide](deploy.md) for Vercel or other platforms.
- **Explore Features**: Dive into [Key Features](features.md), [Architecture](architecture.md), and [Security](security.md).
- **Operations**: Review the [Operations Runbook](ops.md) for maintenance.

For troubleshooting, check console logs or the [Security Best Practices](security.md). Questions? See the [README](../README.md).

Happy building!
