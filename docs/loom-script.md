# 2-Minute Demo Script

Use this script for a Loom or live screen-share. Keep the pace brisk—about 15–20 seconds per section.

## 0:00 – 0:20 · Welcome & hook
- Start on `https://localhost:3000/` (marketing homepage).
- “This is the SaaS Starter—a complete SaaS shell with marketing, auth, teams, and billing so you can launch demos immediately.”
- Scroll the hero and features rows, highlight the primary “Start the demo” button.

## 0:20 – 0:55 · Sign in & dashboard
- Click **Start the demo** → **Use demo account**. Mention that magic links still work and log to the terminal when SMTP is missing.
- Land on the dashboard. Call out the welcome header, metrics cards (Plan, Members, Invites, Billing status), and the audit-friendly layout.

## 0:55 – 1:15 · Workspace management
- Open **Settings → Workspaces**.
- Point to the list of workspaces (seeded “Acme Inc” and “Demo Studio”) and the create workspace form.
- Dive into a workspace detail page: show member role dropdowns, invite form, and pending invites with shareable links for local demos.

## 1:15 – 1:40 · Billing overview
- Navigate to **Settings → Billing**.
- Highlight the plan badge, status chip, and the two buttons (Upgrade/Manage subscription).
- Explain stub mode vs live mode: without Stripe keys, upgrades happen instantly for demos; add Stripe test keys to launch real Checkout and the customer portal.

## 1:40 – 2:00 · Docs, packaging, and CTA
- Flip to the repository `README` or `docs/` folder.
- Call out install, deploy, and ops runbooks plus the packaging script (`npm run package`) that produces a ZIP + SHA for client handoff.
- Close with “Clone, seed, click ‘Use demo account’, and you have a ready-to-show SaaS experience.”
