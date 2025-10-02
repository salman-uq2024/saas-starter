# Key Features

This SaaS starter provides a robust foundation for building multi-tenant applications with authentication, team collaboration, billing, and more. Below is a deep dive into the core features.

## Authentication with NextAuth.js

Secure user authentication using NextAuth.js, supporting magic links and credentials for seamless onboarding.

- **Magic Link Emails**: Users receive a secure email link for passwordless login. Configured via SMTP settings in `.env.local`.
- **Demo Credentials**: For quick testing, use the built-in demo account without email setup.
- **Session Management**: Sessions are handled server-side with Prisma integration for persistence.

Example route handler in [`src/app/api/auth/[...nextauth]/route.ts`](../../../src/app/api/auth/%5B...nextauth%5D/route.ts):
```ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
// ... configuration
```

## Multi-Tenant Workspaces and Invites

Prisma-powered relational data model enables workspaces with role-based access and invite workflows.

- **Workspaces**: Users can create and switch between isolated workspaces. Each workspace supports multiple members with roles (Owner, Admin, Member).
- **Invites**: Generate shareable invite links or email invites. Status tracking (Pending, Accepted, Expired) ensures auditability.
- **Relations**: Leverages Prisma relations for efficient queries, e.g., User → WorkspaceMember → Workspace.

Key schema highlights from [`prisma/schema.prisma`](../../../prisma/schema.prisma):
```prisma
model Workspace {
  id            String              @id @default(cuid())
  name          String
  memberships   WorkspaceMember[]
  invites       WorkspaceInvite[]
}

model WorkspaceMember {
  id          String           @id @default(cuid())
  role        WorkspaceRole    @default(MEMBER)
  userId      String
  workspaceId String
  user        User             @relation(fields: [userId], references: [id])
  workspace   Workspace        @relation(fields: [workspaceId], references: [id])
}
```

UI components like [`src/components/settings/create-workspace-form.tsx`](../../../src/components/settings/create-workspace-form.tsx) handle creation.

## Stripe Billing and Webhooks

Integrated Stripe for subscription management, with fallback stub mode for demos.

- **Plans**: Free and Pro tiers with upgrade paths. Billing status (Active, Past Due) syncs via webhooks.
- **Checkout and Portal**: One-click upgrades to Stripe Checkout; customer portal for management.
- **Webhook Handling**: Securely processes events like `checkout.session.completed` to update subscriptions.

Webhook route in [`src/app/api/billing/webhook/route.ts`](../../../src/app/api/billing/webhook/route.ts):
```ts
import { stripe } from '@/lib/stripe'
export async function POST(request: NextRequest) {
  const sig = request.headers.get('stripe-signature')
  // ... verification and event handling
}
```

## UI with shadcn/ui

Modern, accessible UI built with Tailwind CSS and shadcn/ui components for consistency.

- **Components**: Reusable elements like buttons, cards, tables for dashboard, settings, and forms.
- **Themes**: Supports dark mode and custom branding via `globals.css`.
- **Navigation**: Sidebar and topbar for app navigation, with workspace switcher.

Example usage in [`src/components/ui/button.tsx`](../../../src/components/ui/button.tsx).

## Testing Suite

Comprehensive testing with Vitest for units and Playwright for E2E.

- **Unit Tests**: Cover utilities like rate limiting and billing logic in `tests/unit/`.
- **E2E Tests**: Smoke tests for marketing pages and auth flows in `tests/e2e/`.
- **CI Integration**: Runs on GitHub Actions for lint, typecheck, and tests.

Run with `npm run test`.

## Deployment and Operations

Easy deployment to Vercel or similar, with scripts for packaging and health checks.

- **Vercel-Optimized**: App Router structure for serverless functions.
- **Env Validation**: Strict checks in [`src/lib/env.ts`](../../../src/lib/env.ts) prevent misconfigurations.
- **Rate Limiting**: Protects endpoints using Upstash or in-memory.

For more, see [Deployment Guide](deploy.md) and [Operations Runbook](ops.md).

See the [README](../README.md) for quick start and feature overview.