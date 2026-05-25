# SolidStart Auth

A [SolidStart](https://start.solidjs.com/) integration that provides seamless authentication with
multiple providers, session management, and SolidStart-native API route
patterns.

This integration brings the power and flexibility of OAuth to SolidStart
applications with full TypeScript support, SSR-friendly HTTP handling,
and SolidStart-native patterns including API routes and server actions.

### Why?

Modern web applications require robust, secure, and flexible authentication
systems. Integrating OAuth and session management with SolidStart applications requires careful consideration of
framework patterns, server-side rendering, and TypeScript integration.

However, a direct integration isn't always straightforward. Different types
of applications or deployment scenarios might warrant different approaches:

- **API Route Integration:** OAuth and auth flows operate at the HTTP level, while
  SolidStart uses file-based API routes with GET and POST handler exports. A
  proper integration should bridge this gap by providing handlers that plug
  directly into SolidStart's routing system.
- **HTTP Request Handling:** SolidStart API routes receive `APIEvent` objects
  with a standard `request` property. This integration wraps the auth handler to
  accept these event shapes without manual request bridging.
- **Session and Request Lifecycle:** Proper session handling in SolidStart
  requires SSR-friendly utilities that work with `createServerData$` and
  server actions, while also providing client-side helpers for interactive flows.
- **Route Protection:** Many applications need fine-grained authorization
  beyond simple authentication. `getSession()` provides a clean server-side
  primitive suitable for protecting routes and server functions.

This integration, `@zitadel/solidstart-auth`, aims to provide the flexibility
to handle such scenarios. It allows you to leverage the full OAuth provider ecosystem
while maintaining SolidStart best practices, ultimately leading to a more
effective and less burdensome authentication implementation.

## Installation

Install using NPM by using the following command:

```sh
npm install @zitadel/solidstart-auth @auth/core
```

## Usage

To use this integration, call `SolidAuth()` with your authentication configuration
and export the resulting `GET` and `POST` handlers from your catch-all auth
API route.

First, create your auth configuration:

```ts
// src/lib/auth.ts
import { SolidAuth, type SolidAuthConfig } from '@zitadel/solidstart-auth';
import Zitadel from '@auth/core/providers/zitadel';

const authOptions: SolidAuthConfig = {
  providers: [
    Zitadel({
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
      issuer: process.env.ZITADEL_DOMAIN,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { GET, POST } = SolidAuth(authOptions);
export { authOptions };
```

Then wire up the API route:

```ts
// src/routes/api/auth/[...solidauth].ts
export { GET, POST } from '~/lib/auth';
```

#### Using the Authentication System

The integration provides several functions and hooks for handling
authentication:

**Server Utilities:**

- `SolidAuth(config)`: Creates `{ GET, POST }` route handlers
- `getSession(request, config)`: Retrieves the current session server-side

**Client Exports** (from `@zitadel/solidstart-auth/client`):

- `signIn(provider?, options?)`: Client helper for sign-in
- `signOut(options?)`: Client helper for sign-out

**Basic Usage in a Route:**

```tsx
// src/routes/index.tsx
import { createServerData$ } from 'solid-start/server';
import { getSession } from '@zitadel/solidstart-auth';
import { authOptions } from '~/lib/auth';

export function routeData() {
  return createServerData$(async (_, { request }) => {
    return getSession(request, authOptions);
  });
}

export default function Home() {
  const session = useRouteData<typeof routeData>();

  return (
    <main>
      <Show when={session()} fallback={
        <a href="/api/auth/signin">Sign in</a>
      }>
        <p>Welcome, {session()?.user?.name}</p>
        <a href="/api/auth/signout">Sign out</a>
      </Show>
    </main>
  );
}
```

Prefer client-side navigation? Use the client helpers:

```tsx
// src/components/AuthButtons.tsx
import { signIn, signOut } from '@zitadel/solidstart-auth/client';

export function SignInButton() {
  return <button onClick={() => signIn('zitadel')}>Sign in</button>;
}

export function SignOutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
```

##### Example: Advanced Configuration with Multiple Providers

This example shows how to use the integration with multiple OAuth
providers and custom session configuration:

```ts
// src/lib/auth.ts
import { SolidAuth, type SolidAuthConfig } from '@zitadel/solidstart-auth';
import Zitadel from '@auth/core/providers/zitadel';
import Google from '@auth/core/providers/google';

const authOptions: SolidAuthConfig = {
  providers: [
    Zitadel({
      clientId: process.env.ZITADEL_CLIENT_ID,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET,
      issuer: process.env.ZITADEL_DOMAIN,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as any).roles = (user as any).roles;
      return token;
    },
    async session({ session, token }) {
      (session.user as any).roles = (token as any).roles as
        | string[]
        | undefined;
      return session;
    },
  },
};

export const { GET, POST } = SolidAuth(authOptions);
export { authOptions };
```

## Known Issues

- **SSR Required:** This integration requires SolidStart to be configured with
  a server adapter. Ensure your `app.config.ts` specifies a compatible adapter
  (e.g., `@solidjs/start/adapters/node`).
- **Environment Configuration:** The integration relies on `AUTH_SECRET` and,
  in many hosting scenarios, `AUTH_TRUST_HOST`. Ensure these are correctly set
  in your environment for production.
- **Callback URLs:** OAuth providers must be configured with the correct
  callback URL: `[origin]/api/auth/callback/[provider]`.
- **Type Augmentation:** If you attach additional properties (e.g., roles) to
  the user session object, extend your app's types accordingly so consumers of
  `session.user` remain type-safe.
- **Redirect Semantics:** OAuth providers expect real browser navigations during
  sign-in. The client helpers handle this for you — avoid manual `fetch()` calls
  to provider endpoints unless you know you need credential/email flows.

## Useful links

- **[SolidStart](https://start.solidjs.com/):** The framework this integration
  targets.

## Contributing

If you have suggestions for how this integration could be improved, or
want to report a bug, open an issue — we'd love all and any contributions.

## License

Apache-2.0
