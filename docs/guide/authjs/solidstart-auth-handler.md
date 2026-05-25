---
title: SolidAuth Factory
group: OAuth Provider
---

# SolidAuth Factory

The `SolidAuth()` factory wires up the auth handler and returns helpers
bound to your config. Call it once in `src/lib/auth.ts`:

```ts
import { SolidAuth } from '@zitadel/solidstart-auth';

export const {
  handlers,     // { GET, POST } for the catch-all route
  GET, POST,    // top-level aliases
  getSession,   // server-side session reader
  signIn, signInUrl, signOut, signOutUrl,
  auth,         // deprecated alias for getSession
} = SolidAuth({
  secret: process.env.AUTH_SECRET,
  providers: [/* ... */],
});
```

## Return values

| Key | Type | Use |
|---|---|---|
| `handlers` | `{ GET, POST }` | Mount in the catch-all API route |
| `getSession` | `(request: Request) => Promise<Session \| null>` | Read the session in routes/server fns |
| `signIn`, `signInUrl`, `signOut`, `signOutUrl` | helpers | Compute or perform the redirect |

## Mounting the handlers

```ts
// src/routes/api/auth/[...].ts
export { GET, POST } from '~/lib/auth';
```

## Server-side reads

See [Server-side session access](./server-side/session-access.md).
