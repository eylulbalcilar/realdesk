# Realdesk

[![CI](https://github.com/eylulbalcilar/realdesk/actions/workflows/ci.yml/badge.svg)](https://github.com/eylulbalcilar/realdesk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-7c3aed.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000.svg?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

An analyst terminal for real-world asset (RWA) protocols. Realdesk compares yield, total value locked, and a proprietary risk grade across the leading RWA protocols, with 90-day historical trends so you can see whether a protocol is growing or shrinking, not just its current snapshot.

Live data is sourced from the [DeFiLlama](https://defillama.com) API.

## Features

- **Protocol comparison.** A single table ranking Ondo, Maple, Centrifuge, and Goldfinch by APY, TVL, risk grade, and pool count.
- **Risk grading.** Each protocol is scored across 7 weighted dimensions (collateral, smart contract, counterparty, regulatory, transparency, liquidity, oracle) and rolled up into a letter grade. See the in-app methodology page for the full rubric.
- **90-day history.** Every protocol detail page charts its historical TVL and APY, with a toggle between the two and a period change indicator.
- **Chain distribution.** A breakdown of where each protocol's TVL sits across chains.
- **Live and themed.** TVL-weighted aggregates, animated counters, and a dark/light terminal aesthetic with a violet accent.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) with TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org) for charts
- [Framer Motion](https://www.framer.com/motion/) for animation
- [next-themes](https://github.com/pacocoursey/next-themes) for dark/light switching

## Data sources

All data comes from public DeFiLlama endpoints, fetched server-side and revalidated hourly:

| Purpose | Endpoint |
| --- | --- |
| Current pools (APY, TVL per pool) | `https://yields.llama.fi/pools` |
| Historical protocol TVL | `https://api.llama.fi/protocol/{slug}` |
| Historical pool APY | `https://yields.llama.fi/chart/{poolId}` |

Risk scores are maintained manually in `lib/risk-scores.ts` and reflect a point-in-time assessment.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To build and run a production bundle:

```bash
npm run build
npm run start
```

Run the same checks as CI:

```bash
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest unit tests
npm run build      # production build
```

## Security and resilience

- **Static detail pages.** Each protocol page is prerendered and served with hourly ISR (`generateStaticParams` with `dynamicParams = false`), so traffic and unknown ids hit the CDN or return a 404 at the edge instead of invoking a function on every request.
- **Upstream timeouts.** Every DeFiLlama request carries a 15s abort timeout so a slow or unresponsive origin cannot tie up server resources.
- **Response headers.** Strict security headers on every route (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a frame-ancestors CSP). The X-Powered-By header is removed.
- **Supply chain.** CI runs lint, typecheck, tests, and build on every push and pull request. Dependabot tracks npm and GitHub Actions updates.

## Project structure

```
app/                     App Router pages
  page.tsx               Overview (metrics strip + comparison table)
  protocol/[id]/page.tsx Protocol detail (stats, history charts, risk breakdown, pools)
  methodology/page.tsx   Risk scoring methodology
components/              UI components (charts, table, header, footer)
lib/
  defillama.ts           DeFiLlama fetchers (current + historical)
  risk-scores.ts         Risk rubric, weights, and grading
  types.ts               Shared types
  ui.ts                  Formatting and color helpers
  *.test.ts              Vitest unit tests
.github/                 CI workflow, Dependabot, and community templates
```

## Disclaimer

Realdesk is an analytical tool, not investment advice. Risk grades are subjective and provided for research purposes only. Always do your own due diligence before allocating capital.
