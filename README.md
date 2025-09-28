# SaaS Starter

A production-ready starter kit bundling marketing pages, passwordless auth, collaborative workspaces, billing, documentation, and CI/ops workflows. It is designed for agencies and teams that need to launch client demos or jumpstart paid SaaS projects in hours, not weeks.

## Highlights

- ✅ Marketing site, dashboard, workspace management, settings, and billing flows.
- ✅ Passwordless authentication with magic links, invite lifecycle, and audit log.
- ✅ Stripe subscription checkout + customer portal (with deterministic stub when keys are missing).
- ✅ Prisma + SQLite by default (swap to Postgres) with seed data and audit trail.
- ✅ Scripts for dev, lint, typecheck, unit + e2e tests, build guard, and packaging.
- ✅ GitHub Actions CI (ubuntu-latest) that runs lint, typecheck, tests, and build.
- ✅ Build-time secret guard and rate-limited server actions to keep credentials server-side.

## Quickstart

> Requirements: Node.js 20+, npm 10+, and the `zip` CLI (macOS/Linux default). No external services are required for the demo experience.

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate the Prisma client**
   ```bash
   npm run db:generate
   ```
3. **Push the schema & seed demo data**
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. **Start the dev server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to explore the marketing site. Use `founder@example.com` to test the seeded account.

Magic-link emails are logged to the terminal when SMTP credentials are not provided.

## Local auth quickstart

Local demos do not require SMTP. With the dev server running:

1. Visit `http://localhost:3000/login`.
2. Click **Use demo account** to sign in instantly as `founder@example.com`.
3. Optionally submit your own email to test the magic-link flow—links render in the terminal when email is disabled.

Update your display name and timezone from **Settings → Profile** after signing in to see the dashboard personalize in real time.

## Local workspace invites

SMTP is optional during development. Use **Settings → Workspaces → Manage** to send an invite—when email isn’t configured the UI surfaces a shareable accept link (`/invites/<token>`) that teammates can open locally to join the workspace.

## Billing test mode

- **Placeholders only:** Without real Stripe test keys the app stays in stub mode—upgrades flip the plan immediately and the billing UI shows the exact link it would have opened.
- **Test keys provided:** Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, and `STRIPE_WEBHOOK_SECRET` (test values) to run true Checkout and Customer Portal flows. Use card `4242 4242 4242 4242`, any future expiry, and any CVC.
- Webhook signatures are verified when `STRIPE_WEBHOOK_SECRET` is present; leave it unset to keep the deterministic stub.

## Environment

All configuration lives in `.env.local` (placeholders committed) and `.env.example`. Key variables:

| Key | Description |
| --- | --- |
| `DATABASE_URL` | SQLite path by default. Swap to Postgres when deploying. |
| `AUTH_SECRET` | 32+ char secret for NextAuth JWT/session signing. |
| `STRIPE_SECRET_KEY` | Stripe secret for live billing. Absent = stub mode. |
| `STRIPE_PRICE_ID_PRO` | Price ID for the Pro subscription. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret (optional). |
| `APP_URL` | Public app URL used for emails and Stripe redirects. |
| `NEXT_PUBLIC_APP_NAME` | Display name surfaced on the marketing site. |

The build guard (`npm run build:guard`) fails if any `SERVER_ONLY` env key leaks with a `NEXT_PUBLIC_` prefix in code or env files.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Next.js in development mode. |
| `npm run build` | Guard + compile the production build. |
| `npm run start` | Run the compiled app. |
| `npm run lint` | ESLint with Testing Library plugin. |
| `npm run typecheck` | Strict TypeScript check. |
| `npm run test` | Runs Vitest unit tests and Playwright e2e smoke test. |
| `npm run test:unit` | Vitest only. |
| `npm run test:e2e` | Build + Playwright smoke using Chromium. |
| `npm run db:generate` | Generate the Prisma client. |
| `npm run db:seed` | Seed the database with demo data. |
| `npm run package` | Build and create `dist/saas-starter-YYYY-MM-DD-<gitsha>.zip` + SHA256. |

## Demo data

After seeding you get:

- Workspace **“Acme Inc”** on the Pro plan.
- Owner: `founder@example.com`
- Admin: `teammate@example.com`
- Pending invite: `newhire@example.com` (token `seed-token-demo`).

## Security & Observability

- Rate-limited server actions (`@/lib/rate-limit`) guard invites, billing, and auth flows.
- Audit log records workspace events (provisioning, invites, billing updates).
- Build guard halts deployment if server secrets leak to the client bundle.
- Centralised JSON logger (`@/lib/logger`) used by auth and billing flows.
- Error boundaries + loading skeletons ensure resilient UX in the dashboard area.

## Billing behaviour

- With Stripe keys present: creates Checkout sessions, portal links, and processes webhooks.
- Without keys: deterministic stub promotes the workspace to `PRO`, logs the intended redirect, and surfaces a stub portal page.

## Testing & CI

- **Unit tests:** see `tests/unit` for rate limiting and env coverage.
- **E2E:** `tests/e2e/marketing.spec.ts` exercises the marketing homepage via Playwright.
- CI workflow lives at `.github/workflows/ci.yml` (ubuntu-latest).

Run tests locally:
```bash
npm run test
```

## Packaging

Create a distributable bundle with:
```bash
npm run package
```
This command runs the build, zips the project into `dist/saas-starter-<DATE>-<GITSHA>.zip`, and writes `*.sha256.txt` with the checksum.

## Deploy notes

- Swap `DATABASE_URL` to your production database and run `npx prisma migrate deploy`.
- Set Stripe keys + webhook secret before enabling live billing.
- The Next.js middleware protects `/dashboard` and `/settings` routes.
- See `docs/deploy.md` for service-by-service guidance (Vercel, Render, etc.).

## Further reading

- [`docs/install.md`](docs/install.md)
- [`docs/deploy.md`](docs/deploy.md)
- [`docs/ops.md`](docs/ops.md)
- [`docs/loom-script.md`](docs/loom-script.md)
