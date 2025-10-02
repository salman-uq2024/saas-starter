# Operations Runbook

This runbook provides essential procedures for maintaining, troubleshooting, and scaling the SaaS starter in production or staging environments. It focuses on best practices for reliability, backups, and incident response.

For initial setup, refer to the [Installation Guide](install.md) and [Deployment Guide](deploy.md).

## Quick Reference Commands

Essential npm scripts for daily operations:

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run dev` | Start development server | Local debugging or reproducing issues |
| `npm run lint` | Run ESLint checks | Before commits or merges to enforce code style |
| `npm run typecheck` | Validate TypeScript | Ensure type safety across the app |
| `npm run test` | Execute full test suite (Vitest + Playwright) | Regression testing; use `PLAYWRIGHT_SKIP_BROWSER=1` in headless envs |
| `npm run db:seed` | Re-seed demo data | Refresh database after resets (non-production only) |
| `npm run package` | Create ZIP bundle + SHA checksum | Client handoffs or offline deployments |

All commands assume Node.js 20+ and configured env vars.

## Backup and Restore Procedures

Reliable backups are critical for data integrity.

### SQLite (Development/Demo)
- **Backup**: Copy the DB file: `cp dev.db backup-$(date +%F).db`. Always include `prisma/schema.prisma` for schema reference.
- **Restore**: Replace `dev.db`, then `npm run db:generate` to update Prisma client.
- **Best Practice**: Automate daily copies; retain 7 days.

### PostgreSQL (Production)
- **Managed Services**: Use provider tools (e.g., `pg_dump` for Supabase, snapshots for AWS RDS). Enable point-in-time recovery (PITR).
- **Manual Backup**: `pg_dump -U user -h host dbname > backup.sql`.
- **Restore**: Create new DB, import: `psql -U user -h host dbname < backup.sql`. Update `DATABASE_URL`.
- **Policy**: Daily automated backups; test restores quarterly. Document access controls.

See [Database Schema](architecture.md#database-schema-highlights) for model details.

## Seeding and Data Refresh

For non-production environments:

1. Target a dev/staging DB (never production).
2. Run:
   ```bash
   npx prisma db push  # Sync schema
   npm run db:seed     # Insert demo users, workspaces, invites
   ```
3. Verify: Log in as `founder@example.com`; check seeded workspaces ("Acme Inc", "Demo Studio").

For Postgres with migrations: `npx prisma migrate deploy` before seeding.

## Rollback Procedures

In case of failures:

1. **Code Rollback**: `git checkout <last-good-commit>` → `npm run build` → Redeploy.
2. **Database Rollback**:
   - SQLite: Restore from backup file, restart app.
   - Postgres: Use PITR or snapshot; note the exact timestamp.
3. **Billing Rollback**: Pause affected subscriptions in Stripe Dashboard; resume after verification.
4. **Post-Incident**: Notify users, log details, conduct post-mortem if downtime >5min.

## Routine Health Checks

Perform these weekly or after deploys:

- **Audit Logs**: Query recent entries: `SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 50;` (via Prisma Studio or DB client). Confirm actions (e.g., invites, upgrades) are logged.
- **Rate Limiting**: Monitor for 429 errors; adjust `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` based on traffic.
- **Email Health**: Send a test invite; verify delivery or console logs (stub mode).
- **Stripe Webhooks**: Check Dashboard for recent events; ensure 200 responses from `/api/billing/webhook`.
- **Performance**: Run `npm run test`; review query logs in Prisma (dev mode).

Integrate with monitoring tools (e.g., Vercel Analytics, Datadog) for alerts.

## Troubleshooting Cheatsheet

Common issues and resolutions:

| Symptom | Possible Cause | Resolution |
|---------|----------------|------------|
| Magic link not received | SMTP unset or misconfigured | Use stub mode (check terminal); configure SMTP for prod |
| Build fails with "server-only secrets" | Env var prefixed incorrectly | Remove `NEXT_PUBLIC_` from sensitive keys; run `npm run build` locally |
| Billing status desynced | Missing webhook secret | Set `STRIPE_WEBHOOK_SECRET`; replay events in Stripe Dashboard |
| 429 errors on actions | Rate limit exceeded | Increase env vars or implement client-side retries |
| Prisma connection error | Invalid `DATABASE_URL` | Validate URL format; check DB permissions/firewall |

For deeper diagnostics, enable debug logs in `src/lib/prisma.ts` and `src/server/auth.ts`.

## Observability and Scaling

- **Logging**: JSON-structured via [`src/lib/logger.ts`](../../../src/lib/logger.ts); pipe to services like Logflare or Sentry.
- **Audit Trails**: Automatic for workspace/billing events; extend for custom actions.
- **Scaling Tips**: 
  - Use connection pooling in Prisma for high traffic.
  - Offload emails to queues (e.g., Resend, Postmark).
  - Shard databases for multi-tenancy at scale.
- **Alerts**: Monitor uptime, error rates, and webhook failures.

For security-focused ops, see [Security Best Practices](security.md). Track project evolution in [Project Roadmap](project-roadmap.md).

This runbook ensures operational excellence—review and update as the app evolves.