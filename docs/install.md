# Install Guide

This guide walks through setting up the SaaS Starter on a fresh machine.

## 1. Prerequisites

- Node.js 20+
- npm 10+
- `zip` CLI (included with macOS/Linux)
- Optional: Stripe test keys if you want to exercise live checkout flows.

## 2. Clone and install

```bash
git clone <repo-url>
cd saas-starter
npm install
npm run db:generate
```

## 3. Environment variables

Copy `.env.example` to `.env.local` (the repo already ships a placeholder `.env.local`). Adjust values as needed:

- **AUTH_SECRET** – generate a random 32+ character string (`openssl rand -base64 32`).
- **APP_URL** – the base URL of your deployment.
- **STRIPE_*** keys – optional; leave blank for stubbed billing.

## 4. Database

SQLite is the default. Push the schema and seed demo data:

```bash
npx prisma db push
npm run db:seed
```

To use Postgres, edit `prisma/schema.prisma` (`provider = "postgresql"`) and set `DATABASE_URL` accordingly, then run `npx prisma migrate dev`.

## 5. Run locally

```bash
npm run dev
```

- Marketing site: `http://localhost:3000`
- Dashboard: sign in with any email (magic link prints to the terminal).
- Seeded owner: `founder@example.com` (auto-provisioned workspace).

## 6. Tests & QA

```bash
npm run lint
npm run typecheck
npm run test
```

Playwright downloads Chromium automatically (or run `npx playwright install --with-deps chromium`).

## 7. Next steps

- Update copy and styling on `src/app/(marketing)/page.tsx`.
- Replace placeholders in `.env.local`.
- Review deployment checklist in `docs/deploy.md`.
