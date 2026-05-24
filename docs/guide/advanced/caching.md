---
title: Caching
group: Advanced
children:
  - ./url-resolutions.md
  - ./deployment/self-hosted.md
  - ./deployment/vercel.md
  - ./deployment/netlify.md
---

# Caching content

Hosting providers often offer caching at the edge. Most sites see big
speed wins (and cost savings) by taking advantage of it — no cold
start, no request processing, no JavaScript parsing, just HTML served
straight from a CDN.

By default the user's session is read server-side in a `query` /
`'use server'` function and rendered into the HTML. That's fine for
personalised pages, but it's a footgun the moment those pages are
cached: a cached response containing user A's session will be served to
user B.

To add caching in SolidStart, return a `Cache-Control` header from a
server function or middleware. See the
[SolidStart server docs](https://docs.solidjs.com/solid-start/reference/server/use-server).

:::warning
If you cache a route, that route MUST NOT call `getSession()` or render
session data server-side. Otherwise the first user's session leaks into
the cached HTML served to everyone else.
:::

## Page specific cache rules

For a single cached route, set `Cache-Control` from a server function
and avoid touching the session there. Read the session on the client
instead.

```ts
// src/routes/index.tsx
import { getRequestEvent } from 'solid-js/web';
import { createAsync } from '@solidjs/router';

const getPosts = async () => {
  'use server';
  const event = getRequestEvent();
  event!.response.headers.set(
    'cache-control',
    'public, max-age=86400, s-maxage=86400',
  );
  // Do not call getSession() here. Read session client-side via the
  // useSession() helper if you need it.
  return await fetchPosts();
};

export default function Home() {
  const posts = createAsync(() => getPosts());
  return <main>{/* ... */}</main>;
}
```

## Global cache rules

To cache most pages by default, set `Cache-Control` from middleware and
only override it on routes (like `/profile`) that must stay dynamic.

```ts
// src/middleware.ts
import { createMiddleware } from '@solidjs/start/middleware';

export default createMiddleware({
  onBeforeResponse: [
    ({ response }) => {
      response.headers.set(
        'cache-control',
        'public, max-age=86400, s-maxage=86400',
      );
    },
  ],
});
```

## Combining rules

Headers set later in the request lifecycle (in a route handler or
server function) override headers set in middleware. So you can flip
the default per route.

For example: cache every page except `/profile`.

```ts
// src/middleware.ts — global default: cached
export default createMiddleware({
  onBeforeResponse: [
    ({ response }) => {
      response.headers.set('cache-control', 'public, max-age=86400, s-maxage=86400');
    },
  ],
});

// src/routes/profile.tsx — opt this route back into dynamic rendering
import { getSession } from '~/lib/auth';

const getProfile = async () => {
  'use server';
  const event = getRequestEvent();
  event!.response.headers.set('cache-control', 'private, no-store');
  return await getSession(event!);
};
```
