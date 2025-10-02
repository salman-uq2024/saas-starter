# Security Best Practices

This SaaS starter incorporates several security measures to protect user data, prevent common vulnerabilities, and ensure robust operation. Below are key practices implemented, with explanations and references to relevant code.

## Environment Variable Validation

Strict validation of environment variables prevents misconfigurations and runtime errors.

- **Zod Schema Validation**: All server-side env vars are parsed using Zod schemas in [`src/lib/env.ts`](../../../src/lib/env.ts). Invalid or missing required vars (e.g., `AUTH_SECRET`) throw descriptive errors during startup.
  - Sanitization: Empty strings are treated as unset, avoiding partial configs.
  - Separation: Public (client-side) and server-only vars are distinctly handled to prevent exposure.
- **Defaults and Fallbacks**: Non-critical vars like `DATABASE_URL` default to SQLite for dev, but production requires explicit setup.

Example from env.ts:
```ts
const serverSchema = z.object({
  AUTH_SECRET: z.string().min(10).default("development-secret"),
  // ... other vars with optional() for stubs
});
```

## Authentication Guards

NextAuth.js integration with middleware and server-side checks enforces secure access.

- **Session Management**: JWT sessions with Prisma adapter store user data securely. Callbacks in [`src/server/auth.ts`](../../../src/server/auth.ts) populate sessions with user ID, email, and workspace info without exposing sensitive data.
  - Events: Auto-creates default workspace on first sign-in for seamless onboarding.
- **Role-Based Access Control (RBAC)**: Workspace memberships define roles (Owner, Admin, Member). Server actions (e.g., in `src/server/actions/`) check permissions before mutations.
- **Magic Links**: Time-limited, single-use tokens for passwordless auth. Dev mode includes credentials provider for testing without SMTP.

No client-side auth logic; all guards run server-side to mitigate tampering.

## Rate Limiting

Protects against abuse and DDoS by limiting requests per IP.

- **In-Memory Buckets**: Implemented in [`src/lib/rate-limit.ts`](../../../src/lib/rate-limit.ts) using a Map for token buckets. Defaults to 50 requests per 5 minutes, configurable via env.
  - IP Extraction: Uses `x-forwarded-for` or `x-real-ip` headers for proxies (e.g., Vercel).
  - Graceful Degradation: Returns remaining quota and reset time on success; 429 on exceed.
- **Applied To**: Server actions and API routes (e.g., invites, billing webhooks) to prevent spam.

Example usage:
```ts
const result = checkRateLimit(ipKey);
if (!result.success) {
  return NextResponse.json({ error: "Rate limited" }, { status: 429 });
}
```

For production scale, integrate with Redis (e.g., Upstash) by swapping the Map.

## Secure Email Handling

Mailer configuration prioritizes security and reliability.

- **Nodemailer Transport**: In [`src/server/mailer.ts`](../../../src/server/mailer.ts), uses authenticated SMTP with TLS (port 587/465). Credentials are env-only, never hardcoded.
  - Fallback Stub: Logs email content to console if SMTP unset (dev-friendly, no delivery).
  - Error Handling: Catches and logs failures without exposing details to users.
- **Content Security**: Magic links and invites use HTTPS URLs; subjects/text are templated to avoid injection.

Emails are sent asynchronously; monitor logs for delivery issues.

## Database Security with Prisma

Prisma ORM ensures safe, efficient queries.

- **Parameterized Queries**: Built-in protection against SQL injection; all inputs are escaped automatically.
- **Connection Pooling**: Singleton client in [`src/lib/prisma.ts`](../../../src/lib/prisma.ts) with logging (queries in dev, errors only in prod).
- **Schema Constraints**: Enums (e.g., `WorkspaceRole`), unique indexes (e.g., user-workspace), and relations prevent invalid data.
  - Multi-Tenancy: Workspace ID filters isolate data; no global user access.
- **Audit Logging**: All actions (invites, billing changes) logged to `AuditLog` model with actor IP and metadata.

Run `npx prisma generate` after schema changes; use migrations for production.

## Additional Measures

- **Build-Time Guards**: Scripts like `build-guard.mjs` detect exposed secrets (e.g., `NEXT_PUBLIC_` on server vars).
- **CORS and Headers**: Next.js defaults; add custom middleware for strict origins if needed.
- **Dependency Security**: Regular `npm audit`; pinned versions in package.json.
- **Stripe Security**: Webhooks verified with signing secrets; no card data stored locally.

For compliance (e.g., GDPR), extend audit logs and add data export/deletion flows. Regularly review OWASP top 10 and update deps.

See [Architecture](architecture.md) for integration details and [Deployment Guide](deploy.md) for prod hardening.