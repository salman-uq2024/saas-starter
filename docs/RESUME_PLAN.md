# RESUME_PLAN

## Status Snapshot
- Next.js 15 App Router + Prisma + NextAuth + Stripe hooked up; workspace/team + billing flows scaffolded.
- Scripts present for dev/build/start/test/typecheck/lint/package; Playwright + Vitest configs wired; CI runs lint/typecheck/test.
- Env loading hardened (blank optional vars now treated as unset) to reduce setup friction.
- Local demo auth available without SMTP (dev credentials provider) and profile settings capture timezone for personalization.

## Gaps / Risks
- No checked-in Prisma migrations; onboarding to Postgres/cloud DB will stall without generated migrations.
- Test coverage thin: only marketing e2e flow and two unit specs; no smoke tests for dashboard/auth/billing critical paths.
- Stripe + email paths rely on live services; need deterministic mocks/stubs for local + CI confidence beyond guard rails.

## Completed
1. Added development-only credentials login to unblock local demos and documented the flow in the README.
2. Extended profile settings (and Prisma schema) to store timezone, ensuring dashboards greet users by their chosen details.
3. Rounded out workspace management with rename, role management, and invite sharing for teams working locally.
4. Wired Stripe billing test mode (Checkout, Portal, webhook sync) with deterministic stubs when keys are absent.
5. Hardened CI/test tooling: vitest + Playwright coverage (marketing smoke), packaging zip + SHA for releases.

## Next Actions
1. Generate baseline Prisma migration(s) from `prisma/schema.prisma`; document workflow for future changes.
2. Deepen automated coverage beyond marketing + utility smoke (dashboard flows, Stripe success paths, workspace invites).
3. Add service fallbacks (mock Stripe/webhook payloads, in-memory mail logging) to allow CI/local runs without secrets.
4. Introduce assertions around timezone usage (notifications, audits) and seed coverage to keep future features consistent.
