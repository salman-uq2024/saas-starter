# SaaS Starter

Launch a polished SaaS demo in an afternoon. This starter ships a marketing site, passwordless auth, collaborative workspaces, Stripe billing, and a full runbook so teams can focus on their unique product copy instead of scaffolding.

## At a glance

- Marketing site, dashboard, settings, billing, and invite flows ready to brand.
- Passwordless auth with a dev-only “Use demo account” button to skip SMTP.
- Stripe Checkout + Customer Portal with a deterministic stub when keys are absent.
- Prisma + SQLite by default (swap to Postgres) with seed data and audit trail.
- CI (GitHub Actions) plus packaging script for handing off a zipped release.

## Quickstart (5 minutes)

> Prerequisites: Node.js 20+, npm 10+, and the `zip` CLI (bundled with macOS/Linux). No external services required.

```bash
git clone <repo-url>
cd saas-starter
npm install
npm run db:generate
npx prisma db push
npm run db:seed
npm run dev
```

Visit `http://localhost:3000`, open **Login**, and click **Use demo account** to land on the dashboard as `founder@example.com`. Update your profile name/timezone, switch workspaces, and explore billing—all fully stubbed for local demos.

## Environment keys

Copy `.env.example` to `.env.local` (placeholders already provided). Update as needed:

| Key | Required? | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✔️ | Defaults to SQLite file (`file:./dev.db`). Point to Postgres for staging/prod. |
| `AUTH_SECRET` | ✔️ | 32+ char secret (`openssl rand -base64 32`). |
| `APP_URL` | ✔️ | Base URL used in emails and Stripe redirects (`http://localhost:3000` in dev). |
| `NEXT_PUBLIC_APP_NAME` | ✔️ | Brand name rendered in the UI. |
| `AUTH_EMAIL_FROM` | Optional | Email “from” address for magic links (falls back to no-reply@host). |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` | Optional | Configure to deliver real magic links and invites. Absent = terminal preview. |
| `STRIPE_SECRET_KEY` | Optional | Test/Live secret key. Missing = billing stub mode. |
| `STRIPE_PRICE_ID_PRO` | Optional | Price ID used during Checkout. |
| `STRIPE_WEBHOOK_SECRET` | Optional | Enables signature verification + live webhook sync. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Only needed when embedding client-side Stripe widgets. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` | Optional | Adjust server action rate limits (defaults: 50 req / 5 min). |

> Build guard (`npm run build:guard`) blocks deployments if any `SERVER_ONLY` variable leaks via a `NEXT_PUBLIC_` prefix.

## Working with the project

| Command | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode (App Router). |
| `npm run lint` | ESLint with zero-warning policy. |
| `npm run typecheck` | TypeScript strict mode. |
| `npm run test` | Vitest unit suite + Playwright marketing smoke (headless). |
| `npm run test:e2e` | Build + Playwright smoke. Set `PLAYWRIGHT_WEB_SERVER=1` to launch the Next server automatically. |
| `npm run build` | Build guard then production compile. |
| `npm run start` | Serve the compiled build. |
| `npm run package` | Produce `dist/saas-starter-<DATE>-<SHA>.zip` plus `.sha256.txt`. |

## Billing test flow

- **Stub mode (default):** If Stripe keys are missing, “Upgrade to Pro” instantly sets the workspace plan to PRO, records an audit log, and shows the portal link you would have opened.
- **Live test mode:** Add `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID_PRO`, and `STRIPE_WEBHOOK_SECRET` (Stripe test values). Use card `4242 4242 4242 4242`, any future expiry, any CVC. Checkout redirects back to `/billing/success`, and webhook events keep the billing status in sync.
- Switch back to stub mode any time by removing the keys—no code changes required.

## Troubleshooting

| Issue | Fix |
| --- | --- |
| No sign-in email arrives | In dev, copy the magic-link URL from the terminal. In staging/prod, verify SMTP credentials and `AUTH_EMAIL_FROM`. |
| Build fails with “server-only secrets exposed” | Search for the leaked key and remove any `NEXT_PUBLIC_*` prefix from sensitive env vars. |
| Stripe upgrade appears stuck | Confirm webhook secret is set (live mode) or keep stub mode enabled; check `/api/billing/webhook` logs. |
| “Too many requests” when updating settings | Increase `RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW_MINUTES` or retry after the window resets. |

## What’s seeded?

- Workspace **Acme Inc** (PRO) with owner `founder@example.com` and admin `teammate@example.com`.
- Workspace **Demo Studio** (FREE) owned by `founder@example.com`.
- Pending invite for `newhire@example.com` with token `seed-token-demo`.

## Deployment & packaging

Run `npm run build` before deploying (CI mirrors this via `.github/workflows/ci.yml`). The deployment checklist in [`docs/deploy.md`](docs/deploy.md) covers staging vs. production tips, Stripe webhooks, and secret handoff. When you need a distributable artifact for clients or platform teams, execute:

```bash
npm run package
```

Both the ZIP and SHA256 checksum land in `dist/` for easy distribution.

## Further reading

- [`docs/install.md`](docs/install.md) – step-by-step setup and first login.
- [`docs/deploy.md`](docs/deploy.md) – staging/production checklist and secret management.
- [`docs/ops.md`](docs/ops.md) – backup, restore, seeding, and rollback playbooks.
- [`docs/loom-script.md`](docs/loom-script.md) – narrated two-minute demo path.
