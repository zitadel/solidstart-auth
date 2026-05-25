---
title: Custom Pages
group: OAuth Provider
---

# Custom auth pages

Point `pages.signIn` and `pages.error` at your custom routes:

## Config

```ts
// src/lib/auth.ts
SolidAuth({
  pages: { signIn: '/auth/login', error: '/auth/error' },
})
```

## Custom sign-in page

```tsx
// src/routes/auth/login.tsx
import { createSignal, onMount } from 'solid-js';

export default function LoginPage() {
  const [csrfToken, setCsrfToken] = createSignal('');
  onMount(async () => {
    const r = await fetch('/api/auth/csrf');
    setCsrfToken((await r.json()).csrfToken);
  });
  return (
    <form action="/api/auth/signin/github" method="post">
      <input type="hidden" name="csrfToken" value={csrfToken()} />
      <button type="submit">Sign in with GitHub</button>
    </form>
  );
}
```

## Custom error page

```tsx
// src/routes/auth/error.tsx
import { useSearchParams } from '@solidjs/router';

export default function ErrorPage() {
  const [params] = useSearchParams();
  return (
    <main>
      <h1>Sign-in error</h1>
      <p>Code: {params.error ?? 'default'}</p>
    </main>
  );
}
```
