# Health Checks and Monitoring

This guide outlines routine health checks and monitoring practices to ensure the SaaS starter runs smoothly in development, staging, or production. Regular verification helps catch issues early, maintaining reliability for users.

## Summary of Key Checks

Run these commands to validate the application's health:

- **`npm run lint`**: Ensures code style compliance using ESLint. No warnings or errors expected.
- **`npm run typecheck`**: Validates TypeScript types across the codebase.
- **`npm run build`**: Compiles the Next.js app; checks for build errors (also runs during tests and deployments).
- **`npm run test`**: Executes unit tests (Vitest) and E2E smoke tests (Playwright). Use `PLAYWRIGHT_SKIP_BROWSER=1` in environments without GUI support.

All checks should pass for a healthy setup. Example output:
```
✓ 10/10 tests passed (100% coverage)
✓ Build successful
```

## Routine Monitoring

### Daily/Weekly Checks

| Check | Command/Method | Expected Outcome | Action if Failed |
|-------|----------------|------------------|------------------|
| **Database Connectivity** | Query via Prisma: `npx prisma studio` or `npm run db:seed` | Demo data loads; no connection errors | Verify `DATABASE_URL`; restart service |
| **Authentication** | Sign in at `/login` (demo or magic link) | Session persists; redirects to dashboard | Check `AUTH_SECRET` and SMTP (if used) |
| **Billing Sync** | Upgrade workspace (with Stripe keys) | Status updates via webhook | Review Stripe dashboard events; verify secret |
| **Email Delivery** | Send invite from settings | Email arrives or logs to console (stub mode) | Test SMTP config; check logs |
| **Rate Limiting** | Simulate requests to API | No 429 errors under normal load | Adjust `RATE_LIMIT_MAX` env var |
| **Logs and Audits** | Review console or integrated logs | AuditLog entries for actions; no errors | Enable structured logging (e.g., Datadog) |

### Performance and Security Scans

- **Dependency Audit**: `npm audit` – Fix high-severity vulnerabilities.
- **Build Guard**: During `npm run build`, ensures no server secrets exposed as public env vars.
- **Observability**: Forward logs from [`src/lib/logger.ts`](../../../src/lib/logger.ts) to a service. Monitor `/api/billing/webhook` for 200 responses.

## Troubleshooting Common Issues

- **Tests Skip Browser**: Set `PLAYWRIGHT_SKIP_BROWSER=1` for headless runs; install Chromium with `npx playwright install --with-deps` for full E2E.
- **Prisma Migrations**: Generate with `npx prisma migrate dev` after schema changes; deploy with `npx prisma migrate deploy`.
- **Stub Mode Fallbacks**: Without Stripe/SMTP keys, features use mocks – ideal for local demos but monitor in prod.

## Best Practices

- **CI/CD Integration**: Run checks in GitHub Actions (`.github/workflows/ci.yml`) before merges.
- **Backups**: Schedule DB snapshots; test restores quarterly (see [Operations Runbook](ops.md)).
- **Alerts**: Set notifications for 5xx errors, failed webhooks, or high rate-limit hits.
- **Coverage Expansion**: Add tests for dashboard, billing, and invites as features evolve (see [Testing Suite](features.md#testing-suite)).

For deployment-specific health, refer to [Deployment Guide](deploy.md). Maintain a log of checks for compliance.

See the [README](../README.md) for initial setup and [Security](security.md) for vulnerability management.