# SaaS Starter

SaaS Starter is a production-grade Next.js 15 + Prisma template for shipping subscription SaaS products fast. It includes a marketing site, passwordless auth, collaborative workspaces, Stripe billing (with a deterministic stub when keys are missing), seeded data, and operational runbooks.

## Quickstart

1. **Clone & install**
   ```bash
   git clone <repo-url>
   cd saas-starter
   npm install
   ```
2. **Create your env file**
   ```bash
   cp .env.example .env.local
   openssl rand -base64 32 | tr -d '\n'  # copy into AUTH_SECRET
   ```
3. **Provision the database and seed demo data**
   ```bash
   npm run setup
   ```
4. **Start the dev server**
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:3000/login` and click **Use demo account** to explore the dashboard as `founder@example.com`.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server with hot reload. |
| `npm run build` | Run the build guard and compile a production bundle. |
| `npm run start` | Serve the compiled app (after `npm run build`). |
| `npm run setup` | Generate Prisma client, sync the schema, and seed demo data. |
| `npm run lint` | ESLint with a zero-warning policy. |
| `npm run typecheck` | TypeScript project check (`tsc --noEmit`). |
| `npm run test:unit` | Vitest suite covering env, billing, and workspace logic. |
| `npm run test:e2e` | Playwright marketing smoke test (requires `npm run build`). |
| `npm run test` | Runs unit tests then e2e smoke tests. |
| `npm run package` | Produces `dist/saas-starter-YYYY-MM-DD.zip` and checksum. |

## Environment

Create `.env.local` for local work. All keys have safe defaults—empty Stripe/SMTP keys keep the app in stub mode so you can demo billing without external services.

| Key | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | ✔️ | Defaults to SQLite (`file:./dev.db`). Point to Postgres in staging/prod. |
| `AUTH_SECRET` | ✔️ | 32+ character secret (`openssl rand -base64 32`). |
| `APP_URL` | ✔️ | Base URL of the running instance (`http://localhost:3000` in dev, Vercel URL in demo). |
| `NEXT_PUBLIC_APP_NAME` | ✔️ | Branding shown in the UI. |
| `STRIPE_SECRET_KEY` | Optional | Add to enable live Checkout; leave empty for stubbed upgrades. |
| `STRIPE_PRICE_ID_PRO` | Optional | Price ID for the paid plan. |
| `STRIPE_WEBHOOK_SECRET` | Optional | Enables signature verification + subscription sync. |
| `SMTP_*` keys | Optional | Configure to send real magic links/invites; blank = terminal preview. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` | Optional | Adjust server action rate limits (defaults 60 req / 5 min). |

Store production secrets in your host’s secret manager—never commit `.env.local` or database files.

## Testing

```bash
npm run lint
npm run typecheck
npm run test:unit          # fast deterministic checks
PLAYWRIGHT_WEB_SERVER=1 npm run test:e2e  # headless smoke test
```

The Playwright job builds the app and runs a marketing smoke flow. In CI we install Chromium using `npx playwright install --with-deps chromium`.

## Deployment

- Default demo host: **Vercel (Hobby tier)**. Import the repo, set the environment variables from `.env.example`, and configure the build command `npm run build` with install command `npm install`. Vercel automatically runs `npm run start` for previews.
- Local production preview: `npm run build && npm run start`.
- Detailed staging/production guidance lives in [`docs/deploy.md`](docs/deploy.md). Step-by-step setup is in [`docs/install.md`](docs/install.md); operational runbooks in [`docs/ops.md`](docs/ops.md).

## Packaging

`npm run package` builds the app and exports a distributable ZIP plus `.sha256` checksum in `dist/`. The archive contains the `.next` build, Prisma schema, docs, and scripts—handy for clients or air-gapped environments.

## Troubleshooting

- **Dev login spins**: ensure `AUTH_SECRET` is 32+ chars and the SQLite file exists (rerun `npm run setup`).
- **Build guard fails**: search for leaked server env via `rg "NEXT_PUBLIC_" src` and move secrets back to the server.
- **Stripe upgrade stuck**: keep keys empty for stub mode, or configure `STRIPE_*` values and webhook signing secret for live mode.
- **Playwright missing Chromium**: install once with `npx playwright install --with-deps chromium`.

## Documentation

- [`docs/install.md`](docs/install.md) – fresh machine setup
- [`docs/deploy.md`](docs/deploy.md) – Vercel demo + staging/production checklist
- [`docs/ops.md`](docs/ops.md) – backups, restores, and routine operations

## License

[MIT](LICENSE)
