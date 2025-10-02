# Demo Guide

Use this scripted walkthrough for quick demonstrations, such as Loom videos, live screen shares, or client presentations. The script is designed for a 2-minute overview, keeping the pace engaging and focused on key features. Assume the app is running locally (`npm run dev`) or deployed (e.g., on Vercel).

## Preparation

- **Environment**: Start the server with `npm run dev` and open `http://localhost:3000` (or your deployed URL).
- **Demo Data**: Ensure the database is seeded (`npm run setup`) for pre-populated workspaces and users.
- **Mode**: Use stub mode (no Stripe/SMTP keys) for simplicity; emails log to console, billing upgrades instantly.
- **Timing**: Practice to fit in 2 minutes—15-20 seconds per section.

For full setup, see the [Installation Guide](install.md) and [Key Features](features.md).

## Script: 2-Minute SaaS Starter Demo

### 0:00 – 0:20: Welcome and Overview
- **Screen**: Marketing homepage (`/`).
- **Narration**: "Welcome to the SaaS Starter—a full-stack template built with Next.js, Prisma, NextAuth, and Stripe. It includes multi-tenant workspaces, secure authentication, team invites, and subscription billing, ready for your MVP or portfolio demo."
- **Actions**: Scroll through the hero section and features highlights. Point to the "Start the demo" button.
- **Tip**: Emphasize how it accelerates development by handling boilerplate.

### 0:20 – 0:55: Authentication and Dashboard
- **Screen**: Click "Start the demo" → Select **Use demo account** (signs in as `founder@example.com`).
- **Narration**: "Passwordless login via magic links or demo credentials gets users in quickly. No SMTP setup needed for local demos—links print to the terminal."
- **Actions**: Land on the dashboard. Highlight:
  - Welcome header with user details (e.g., timezone-personalized).
  - Metrics cards: Plan (Free), Members, Pending Invites, Billing Status.
  - Clean, responsive layout with sidebar navigation.
- **Link**: See [Authentication](features.md#authentication-with-nextauthjs) for details.

### 0:55 – 1:15: Workspace Management
- **Screen**: Navigate to **Settings → Workspaces**.
- **Narration**: "Manage teams with isolated workspaces. Create new ones, assign roles (Owner, Admin, Member), and handle invites securely."
- **Actions**: 
  - Show seeded workspaces ("Acme Inc", "Demo Studio").
  - Demonstrate creating a workspace via the form.
  - Click into a workspace: Display member list, role dropdowns, and invite form.
  - Generate an invite link (shareable) or email invite (stubs to console).
- **Link**: Explore [Multi-Tenant Workspaces](features.md#multi-tenant-workspaces-and-invites) and schema in [Architecture](architecture.md).

### 1:15 – 1:40: Billing and Subscriptions
- **Screen**: Go to **Settings → Billing**.
- **Narration**: "Monetize with Stripe integration. Free tier by default; upgrade to Pro for advanced features. Webhooks keep billing status in sync automatically."
- **Actions**:
  - Highlight plan badge, status (e.g., "Active"), and buttons (Upgrade, Manage Portal).
  - Click "Upgrade" to simulate Stripe Checkout (instant in stub mode; real flow with test keys).
  - Note: Customer portal for self-service management.
- **Link**: Details in [Stripe Billing](features.md#stripe-billing-and-webhooks) and [Security](security.md#stripe-security).

### 1:40 – 2:00: Wrap-Up and Next Steps
- **Screen**: Return to dashboard or open the repo/docs.
- **Narration**: "That's the core flow: auth, teams, and billing in a scalable, secure package. Deploy to Vercel in minutes, extend with your features, and scale with Postgres."
- **Actions**: 
  - Mention testing (`npm run test`) and packaging (`npm run package` for ZIP handoff).
  - Call to action: "Clone from GitHub, run `npm run setup`, and start building."
- **Links**: 
  - [Deployment Guide](deploy.md) for going live.
  - [Operations Runbook](ops.md) for maintenance.
  - Full [README](../README.md) for overview.

## Tips for Effective Demos

- **Customization**: Replace placeholders (e.g., app name in env) and add your branding before recording.
- **Edge Cases**: If using real Stripe, test webhooks; for emails, configure SMTP or note stubs.
- **Recording**: Use Loom or ScreenFlow; keep browser zoomed for readability.
- **Duration**: Time sections to avoid rushing—focus on value over details.
- **Q&A Prep**: Be ready for questions on scalability (e.g., multi-tenancy via Prisma relations) or security (see [Security Best Practices](security.md)).

This guide showcases the starter's readiness for production. For deeper dives, check [Architecture](architecture.md) and [Health Checks](health-checks.md).