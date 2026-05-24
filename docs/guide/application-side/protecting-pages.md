---
title: Protecting Pages
group: Application Side
---

# Protecting pages

SolidStart's pattern is to redirect from inside a route's data loader or
server function. The redirect bubbles up and the client never renders the
guarded component.

## In a route component

```tsx
// src/routes/profile.tsx
import { createAsync, redirect, type RouteDefinition } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { getSession } from '~/lib/auth';

const fetchSession = async () => {
  'use server';
  const event = getRequestEvent();
  const session = await getSession(event.request);
  if (!session) throw redirect('/auth/login');
  return session;
};

export const route: RouteDefinition = {
  preload: () => fetchSession(),
};

export default function Profile() {
  const session = createAsync(() => fetchSession());
  return <h1>Hello, {session()?.user?.name}</h1>;
}
```

## Reusable helper

```ts
// src/lib/require-session.ts
'use server';
import { redirect } from '@solidjs/router';
import { getRequestEvent } from 'solid-js/web';
import { getSession } from '~/lib/auth';

export async function requireSession() {
  const event = getRequestEvent();
  const session = await getSession(event.request);
  if (!session) throw redirect('/auth/login');
  return session;
}
```
