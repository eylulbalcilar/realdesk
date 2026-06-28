# Contributing to Realdesk

Thanks for your interest in improving Realdesk. This document covers how to get set up and what is expected from a contribution.

## Getting started

1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Start the dev server with `npm run dev`.

## Before you open a pull request

Run the same checks that CI runs:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

All four should pass.

## Guidelines

- Keep all code, comments, and commit messages in English.
- Match the existing code style (the project uses ESLint, run `npm run lint`).
- Keep pull requests focused on a single concern. Smaller is easier to review.
- Do not commit secrets or API keys. All data comes from public DeFiLlama endpoints.
- Update the README or in-app methodology page if your change affects behavior or scoring.

## Reporting issues

Use the issue templates for bug reports and feature requests. Include steps to reproduce, expected behavior, and environment details where relevant.
