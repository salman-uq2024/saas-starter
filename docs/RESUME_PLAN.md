# RESUME_PLAN

## Status Snapshot
- Next.js 15 App Router + Prisma + NextAuth + Stripe hooked up; workspace/team + billing flows scaffolded.
- Scripts present for dev/build/start/test/typecheck/lint/package; Playwright + Vitest configs wired; CI runs lint/typecheck/test.
- Env loading hardened (blank optional vars now treated as unset) to reduce setup friction.

## Gaps / Risks
- No checked-in Prisma migrations; onboarding to Postgres/cloud DB will stall without generated migrations.
- Test coverage thin: only marketing e2e flow and two unit specs; no smoke tests for dashboard/auth/billing critical paths.
- Stripe + email paths rely on live services; need deterministic mocks/stubs for local + CI confidence beyond guard rails.
- Docs limited to ops/install; lacking architecture, auth/billing walkthroughs, and troubleshooting guidance.

## Next Actions
1. Generate baseline Prisma migration(s) from `prisma/schema.prisma`; document workflow for future changes.
2. Expand automated tests: add Vitest coverage for env/rate limit utilities and Playwright smoke for auth + workspace creation.
3. Add service fallbacks (mock Stripe/webhook payloads, in-memory mail logging) to allow CI/local runs without secrets.
4. Document module ownership + runbooks (auth, billing, teams) so future engineers can resume quickly.
