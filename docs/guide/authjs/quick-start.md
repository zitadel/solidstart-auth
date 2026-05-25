---
title: Quick Start
group: OAuth Provider
children:
  - ./solidstart-auth-handler.md
  - ./session-data.md
  - ./custom-pages.md
  - ./server-side/session-access.md
  - ./server-side/rest-api.md
---

# OAuth Quick Start

This guide walks through setting up `@zitadel/solidstart-auth` with the
OAuth provider, suitable for OAuth, magic links, and credentials sign-in.

## Installation

Install `@auth/core` alongside `@zitadel/solidstart-auth`:

```bash
npm install @zitadel/solidstart-auth @auth/core
```

## Configure SolidAuth

Create `src/lib/auth.ts` and call the `SolidAuth()` factory:

```ts
// src/lib/auth.ts
import { SolidAuth } from '@zitadel/solidstart-auth';
import GitHub from '@auth/core/providers/github';

export const { handlers, getSession, signIn, signInUrl, signOut, signOutUrl } =
  SolidAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
      GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
      }),
    ],
  });
```

## Mount the catch-all route

Create the SolidStart API route:

```ts
// src/routes/api/auth/[...].ts
export { GET, POST } from '~/lib/auth';
```

All auth endpoints are now served under `/api/auth/*`.

## Set the secret

The `secret` is used to sign + encrypt session JWTs. In production this MUST
be set:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Set it as `AUTH_SECRET` in your environment.

## Next Steps

- [Customize session data](./session-data.md)
- [Override the default auth pages](./custom-pages.md)
- [Access the session server-side](./server-side/session-access.md)
