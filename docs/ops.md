# Operations Runbook

Keep this runbook handy for day-to-day support, maintenance, and incident response.

## Quick reference

| Command | When to use |
| --- | --- |
| `npm run dev` | Local troubleshooting or reproducing issues.
| `npm run lint` / `npm run typecheck` | Quality gates before merging hotfixes.
| `npm run test` | Full regression (Vitest + Playwright smoke).
| `npm run db:seed` | Rebuild demo data after a reset (idempotent).
| `npm run package` | Generate a ZIP + SHA for point-in-time backups or client delivery.

## Backup & restore

### SQLite (default)
- **Backup:** copy the `.db` file referenced by `DATABASE_URL` (`cp dev.db dev-backup-$(date +%F).db`). Include `prisma/schema.prisma` in archival backups for schema history.
- **Restore:** replace the existing `.db`, then run `npm run db:generate` to refresh the Prisma client.

### Postgres
- Rely on managed backups from your provider (Heroku, RDS, Supabase, etc.). Ensure PITR (point-in-time recovery) is enabled.
- To restore locally, pull a dump (`pg_dump`), create a new database, and import (`psql`). Update `DATABASE_URL` to point to the restored instance.

Document where backups live, retention policy, and who can access them. Schedule recurring backups (daily for production) and test restoration quarterly.

## Seed & refresh demo data

1. Confirm you’re targeting a non-production database.
2. Run:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
3. Verify seeded accounts (`founder@example.com`, `teammate@example.com`) and invites appear as expected.

If using Postgres with migrations, run `npx prisma migrate deploy` before seeding to keep the schema in sync.

## Rollback procedure

1. **Code:** revert to the last known good commit and redeploy (`git checkout <sha>` → `npm run build` → deploy).
2. **Database:**
   - SQLite: replace the `.db` file with the latest backup, then restart the app.
   - Postgres: trigger a restore in your managed service (PITR or snapshot). Document the exact timestamp chosen.
3. **Billing:** if Stripe live mode is enabled, pause subscriptions in the Stripe dashboard if the incident is billing-related, then resume after verification.
4. **Communication:** notify stakeholders, link the incident in your ops log, and schedule a post-mortem if downtime exceeded expectations.

## Routine checks

- **Audit log:** run a quick filter (`SELECT * FROM "AuditLog" ORDER BY "createdAt" DESC LIMIT 50;`) to confirm events are recorded.
- **Rate limits:** adjust `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` if users trigger 429 responses.
- **SMTP health:** send a test invite from `/settings/workspaces` after credential changes; ensure the email arrives.
- **Stripe webhook:** review recent events in the Stripe dashboard and confirm the handler responded with `200`.

## Troubleshooting cheatsheet

| Symptom | Resolution |
| --- | --- |
| Magic link email missing | Check terminal logs in stub mode, or verify SMTP settings in production. |
| “Build guard detected server-only secrets” | Remove any `NEXT_PUBLIC_*` prefix from sensitive env keys. |
| Stripe status out of sync | Ensure `STRIPE_WEBHOOK_SECRET` is set. Replay events from the Stripe dashboard if needed. |
| 429 errors on server actions | Increase rate-limit env vars or retry after the window resets. |

## Observability

- Logs are JSON-formatted via `@/lib/logger`; forward stdout to your logging stack (Datadog, Logflare, etc.).
- Audit trails capture workspace, invite, and billing events for compliance.
- Add your monitoring alerts to watch `/api/billing/webhook` (200 responses) and overall uptime.
