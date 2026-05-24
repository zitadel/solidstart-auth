---
title: Session Access (client)
group: Application Side
---

# Client-side session access

SolidStart's preferred pattern is to fetch the session via a server
function or `createAsync`, then consume it in your component.

## With createAsync + server function

```ts
// src/lib/session.ts
import { getRequestEvent } from 'solid-js/web';
import { getSession } from '~/lib/auth';

export async function currentSession() {
  'use server';
  const event = getRequestEvent();
  return getSession(event.request);
}
```

```tsx
// src/components/UserBadge.tsx
import { createAsync } from '@solidjs/router';
import { currentSession } from '~/lib/session';

export function UserBadge() {
  const session = createAsync(() => currentSession());
  return (
    <Show when={session()} fallback={<a href="/auth/login">Sign in</a>}>
      <span>Hello, {session()!.user?.name}</span>
    </Show>
  );
}
```

## signIn / signOut

```ts
import { signIn, signOut } from '@zitadel/solidstart-auth/client';

<button onClick={() => signIn('github')}>Sign in with GitHub</button>
<button onClick={() => signOut()}>Sign out</button>
```
