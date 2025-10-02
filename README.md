# SaaS Starter

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-5-blue?style=flat&logo=prisma)](https://prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth-v4-green?style=flat&logo=nextauth)](https://next-auth.js.org)
[![Stripe](https://img.shields.io/badge/Stripe-1.0-purple?style=flat&logo=stripe)](https://stripe.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-0.8-blue?style=flat&logo=shadcn)](https://ui.shadcn.com)
[![Vitest](https://img.shields.io/badge/Vitest-1-green?style=flat&logo=vitest)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.5-blue?style=flat&logo=playwright)](https://playwright.dev)

A full-stack SaaS starter kit built with **Next.js 14**, **Prisma**, and **Stripe**. Features multi-tenant workspaces, secure auth, and subscription billing—deploy in minutes to kickstart your next project.

## Features

- **Secure Authentication**: Passwordless login with NextAuth.js, including magic links and demo accounts for quick testing.
- **Multi-Tenant Workspaces**: Collaborative spaces with invites, member roles, and Prisma-backed data management.
- **Subscription Billing**: Stripe integration for payments, webhooks, and customer portals; stub mode for demos without keys.
- **Responsive UI**: Modern, accessible components using shadcn/ui and Tailwind CSS.
- **Comprehensive Testing**: Unit tests with Vitest, E2E with Playwright; linting and type-checking included.
- **Easy Deployment**: Optimized for Vercel; supports SQLite for dev and PostgreSQL for production.
- **Production-Ready**: Rate limiting, logging, error handling, and operational docs for scaling.

## Screenshots

### Dashboard Overview
![Dashboard](screenshots/dashboard.png)

### Workspace Management
![Workspaces](screenshots/workspaces.png)

### Billing Portal
![Billing](screenshots/billing.png)

*(Add actual screenshots or GIFs here for a live demo feel. Tools like Vercel previews or Loom can help capture them.)*

## Quick Start

### Prerequisites
- Node.js 18 or later
- PostgreSQL (or use built-in SQLite for development)

### Installation
```bash
git clone <repo-url>
cd saas-starter
cp .env.example .env.local
# Generate a secret: openssl rand -base64 32 (paste into AUTH_SECRET)
npm install
prisma db push
npm run dev
```

Visit `http://localhost:3000/login` and use the demo account (`founder@example.com`) to explore. For magic link auth, enter any email and check the terminal for the link.

Detailed setup in [docs/install.md](docs/install.md).

## Demo & Links

- **Live Demo**: [TBD](https://your-app.vercel.app) (Test with demo credentials: founder@example.com)
- **Deploy to Vercel**: One-click setup with environment variables from `.env.example`.
- **Documentation**: [Install](docs/install.md) | [Deploy](docs/deploy.md) | [Operations](docs/ops.md)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit and E2E tests |
| `npm run setup` | Sync DB and seed data |

## Contributing & Showcase

Built as a portfolio project to demonstrate end-to-end SaaS development. Open to collaborations! License: [MIT](LICENSE).