# SaaS Starter

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-blue?style=flat&logo=prisma)](https://prisma.io)
[![NextAuth](https://img.shields.io/badge/NextAuth-v4-green?style=flat&logo=nextauth)](https://next-auth.js.org)
[![Stripe](https://img.shields.io/badge/Stripe-18-purple?style=flat&logo=stripe)](https://stripe.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-2024-blue?style=flat&logo=shadcn)](https://ui.shadcn.com)
[![Vitest](https://img.shields.io/badge/Vitest-3-green?style=flat&logo=vitest)](https://vitest.dev)
[![Playwright](https://img.shields.io/badge/Playwright-1.55-blue?style=flat&logo=playwright)](https://playwright.dev)

A full-stack SaaS starter kit built with **Next.js 15**, **Prisma 6**, and **Stripe**. Features multi-tenant workspaces, secure auth, and subscription billing—deploy in minutes to kickstart your next project.

## Features

- **Secure Authentication**: Passwordless login with NextAuth.js, including magic links and demo accounts for quick testing.
- **Multi-Tenant Workspaces**: Collaborative spaces with invites, member roles, and Prisma-backed data management.
- **Subscription Billing**: Stripe integration for payments, webhooks, and customer portals; stub mode for demos without keys.
- **Responsive UI**: Modern, accessible components using shadcn/ui and Tailwind CSS.
- **Comprehensive Testing**: Unit tests with Vitest, E2E with Playwright; linting and type-checking included.
- **Easy Deployment**: Optimized for Vercel; supports SQLite for dev and PostgreSQL for production.
- **Documentation Hub**: In-app docs viewer renders the markdown guides shipped in `/docs`.
- **Production-Ready**: Rate limiting, logging, error handling, and operational playbooks for scaling.

## Quick Start

### Prerequisites
- Node.js 20 or later
- PostgreSQL (or use built-in SQLite for development)

### Installation
```bash
git clone <repo-url>
cd saas-starter
cp .env.example .env.local
# Generate a secret: openssl rand -base64 32 (paste into AUTH_SECRET)
npm install
npm run setup
npm run dev
```

Visit `http://localhost:3000/login` and click **Use demo account** to explore instantly. For magic link auth, enter any email and check the terminal for the link (SMTP optional).

Detailed setup in [docs/install.md](docs/install.md).

## Demo & Links

- **Live Demo**: `https://your-app.vercel.app` (replace with your deployment URL; set `DISABLE_INDEXING=true` until launch)
- **Deploy to Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/salman/saas-starter&project-name=saas-starter&repository-name=saas-starter)
- **Documentation**: In-app at [`/docs`](http://localhost:3000/docs) or in the repo at [`/docs`](docs/)

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit and E2E tests |
| `npm run setup` | Sync DB and seed data |
| `npm run package` | Build ZIP + SHA for client handoff |

## Environment Flags

| Name | Purpose |
|------|---------|
| `DISABLE_INDEXING` | Set to `true` on demo deployments to emit `noindex` + security headers. |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_WINDOW_MINUTES` | Tune server action throttling. |
| `NEXT_PUBLIC_APP_NAME` | Branding applied across marketing + app shell. |

## Contributing & Showcase

Built as a portfolio project to demonstrate end-to-end SaaS development. Open to collaborations! License: [MIT](LICENSE).
