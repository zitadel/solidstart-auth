---
title: Session Access
group: OAuth Provider
category: Server Side
---

# Server-side session access

Access the current session from any server context (API route, server
function, route loader) using the factory-bound `getSession`:

## In an API route

```ts
// src/routes/api/me.ts
import { getSession } from '~/lib/auth';
import type { APIEvent } from '@solidjs/start/server';

export async function GET(event: APIEvent) {
  const session = await getSession(event.request);
  if (!session) return new Response(JSON.stringify({ error: 'unauthorised' }), { status: 401 });
  return new Response(JSON.stringify({ user: session.user }));
}
```

## In a server function

```ts
import { getSession } from '~/lib/auth';
import { getRequestEvent } from 'solid-js/web';

export async function getMe() {
  'use server';
  const event = getRequestEvent();
  const session = await getSession(event.request);
  if (!session) throw new Error('unauthorised');
  return session.user;
}
```

## Return shape

`getSession()` returns the `Session` object OAuth builds in the `session`
callback, or `null` when no valid session exists. It throws when OAuth
returns a non-200 (e.g. on signature/decode failure).
