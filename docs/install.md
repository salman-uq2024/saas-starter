# Installation Guide

Get the starter running on a new machine in a few minutes.

## 1. Prerequisites

- Node.js 20 or later
- npm 10 or later
- `zip` CLI (bundled with macOS/Linux, `choco install zip` on Windows)
- Optional: Stripe test keys if you want to trial the live Checkout flow

## 2. Clone & install

```bash
git clone <repo-url>
cd saas-starter
npm install
```

## 3. Configure environment

Copy `.env.example` to `.env.local` (the repo already ships placeholder values) and adjust the keys that matter:

| Key | Action |
| --- | --- |
| `AUTH_SECRET` | Generate a 32+ character secret (`openssl rand -base64 32`). |
| `APP_URL` | Use `http://localhost:3000` locally; set your staging/prod domain later. |
| `DATABASE_URL` | Defaults to SQLite. Swap to Postgres when you introduce a managed database. |
| Stripe keys | Leave empty for stub mode. Add Stripe test keys to exercise real billing. |
| SMTP settings | Skip for local demos; fill in when you need real magic-link emails. |

## 4. Prepare the database

```bash
npm run setup
```

The `setup` script generates the Prisma client, syncs the schema, and seeds demo data. SQLite lives alongside the code for development. To use Postgres, change the provider in `prisma/schema.prisma`, set `DATABASE_URL`, and run `npx prisma migrate dev` instead of SQLite seeding.

## 5. First login

```bash
npm run dev
```

Open `http://localhost:3000/login` and click **Use demo account**. You will land on the dashboard as `founder@example.com` with two seeded workspaces, pending invites, and billing data ready to explore.

Prefer a magic link? Enter any email address, then copy the URL printed to your terminal and paste it into the browser.

## 6. Quality checks

```bash
npm run lint
npm run typecheck
npm run test
```

The Playwright smoke test runs headless. If you need the bundled Chromium ahead of time, execute `npx playwright install --with-deps chromium`.

## 7. Next steps

- Replace placeholder copy and branding in `src/app/(marketing)` and dashboard headers.
- Review deployment guidance in [`docs/deploy.md`](deploy.md).
- Familiarise yourself with day-to-day operations in [`docs/ops.md`](ops.md).
