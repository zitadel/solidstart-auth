---
title: Installation
group: Getting Started
---

# Installation

Install `@zitadel/solidstart-auth` and `@auth/core`:

```bash
# npm
npm install @zitadel/solidstart-auth @auth/core

# pnpm
pnpm add @zitadel/solidstart-auth @auth/core

# yarn
yarn add @zitadel/solidstart-auth @auth/core
```

Mount the catch-all auth route at `src/routes/api/auth/[...].ts`:

```ts
// src/routes/api/auth/[...].ts
export { GET, POST } from '~/lib/auth';
```
