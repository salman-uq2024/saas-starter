# Operations Runbook

Use this runbook for day-to-day operations and incident handling.

## Scripts reference

| Script | Description |
| --- | --- |
| `npm run dev` | Local development server. |
| `npm run lint` / `npm run typecheck` | Quality gates for CI. |
| `npm run test` | Full test suite (unit + Playwright smoke). |
| `npm run db:seed` | Re-seed the database (idempotent). |
| `npm run package` | Produce a distributable ZIP + SHA256. |

## Database tasks

- **Apply schema changes:** `npx prisma migrate deploy`
- **View data locally:** `npx prisma studio`
- **Reset dev DB:** delete `dev.db` then rerun `npm run db:seed`

## User management

- Invite users from `/settings/workspaces/<id>`.
- To revoke access, remove membership (admins only) or cancel pending invites.
- Audit trail keeps snapshots of membership and billing events.

## Billing operations

- Trigger upgrade/downgrade from `/settings/billing`.
- Without Stripe keys the system switches to stub mode; events are logged and the workspace is upgraded immediately.
- With Stripe keys, monitor the webhook logs for delivery errors.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| Magic link email missing | In dev, check terminal logs. In prod, verify SMTP env variables. |
| Build fails `Build guard detected...` | Remove any `NEXT_PUBLIC_*` versions of server-only env vars. |
| 429 errors on actions | Increase `RATE_LIMIT_MAX`/`RATE_LIMIT_WINDOW_MINUTES` or retry after the window resets. |

## Observability

- Logs print as JSON via `@/lib/logger`; forward STDOUT to your aggregation tool.
- Error boundary for the app shell surfaces descriptive messages and lets the user retry.
- Audit log table retains a chronological record of sensitive events.

## Backup & restore

- SQLite: copy the `.db` file (e.g., nightly). Postgres: rely on managed backups.
- To restore locally, replace `dev.db` and rerun `npm run db:generate` if needed.
