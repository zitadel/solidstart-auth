import {
  Auth,
  type AuthConfig,
  setEnvDefaults,
  createActionURL,
} from '@auth/core';
import type { Session } from '@auth/core/types';

export { AuthError, CredentialsSignin } from '@auth/core/errors';
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from '@auth/core/types';

/**
 * Auth.js configuration for SolidStart applications.
 *
 * @public
 */
export type SolidAuthConfig = Omit<AuthConfig, 'raw'>;

/**
 * Creates a SolidStart Auth handler.
 *
 * Returns `{ handlers, getSession }` — the same shape as all other ZITADEL
 * framework packages. Export `handlers.GET` and `handlers.POST` from your
 * auth API route.
 *
 * @param config - Auth.js configuration
 * @returns Object containing handlers and getSession utility
 *
 * @example
 * ```ts
 * // src/lib/auth.ts
 * import { SolidAuth, type SolidAuthConfig } from '@zitadel/solidstart-auth';
 * import Zitadel from '@auth/core/providers/zitadel';
 *
 * export const { handlers, getSession } = SolidAuth({
 *   providers: [Zitadel({ ... })],
 *   secret: process.env.AUTH_SECRET,
 * });
 * ```
 *
 * @example
 * ```ts
 * // src/routes/api/auth/[...solidauth].ts
 * import { handlers } from '~/lib/auth';
 * export const { GET, POST } = handlers;
 * ```
 *
 * @public
 */
export function SolidAuth(config: SolidAuthConfig): {
  handlers: {
    GET: (event: { request: Request }) => Promise<Response>;
    POST: (event: { request: Request }) => Promise<Response>;
  };
  /** @deprecated Use `handlers.GET` instead */
  GET: (event: { request: Request }) => Promise<Response>;
  /** @deprecated Use `handlers.POST` instead */
  POST: (event: { request: Request }) => Promise<Response>;
  getSession: (request: Request) => Promise<Session | null>;
  /** @deprecated Use `getSession` instead */
  auth: (request: Request) => Promise<Session | null>;
  signIn: (
    provider?: string,
    options?: { redirectTo?: string },
  ) => Promise<Response>;
  signOut: (options?: { redirectTo?: string }) => Promise<Response>;
} {
  config.basePath ??= '/api/auth';
  setEnvDefaults(process.env, config);

  async function handler(event: { request: Request }): Promise<Response> {
    return Auth(event.request, config);
  }

  const boundGetSession = (request: Request) => getSession(request, config);

  async function signIn(
    provider?: string,
    options: { redirectTo?: string } = {},
  ): Promise<Response> {
    const basePath = (config.basePath ?? '/api/auth').replace(/\/$/, '');
    const params = new URLSearchParams();
    if (options.redirectTo) params.set('callbackUrl', options.redirectTo);
    const paramStr = params.toString();
    const url = provider
      ? `${basePath}/signin/${provider}${paramStr ? `?${paramStr}` : ''}`
      : `${basePath}/signin${paramStr ? `?${paramStr}` : ''}`;
    return Response.redirect(url, 302);
  }

  async function signOut(
    options: { redirectTo?: string } = {},
  ): Promise<Response> {
    const basePath = (config.basePath ?? '/api/auth').replace(/\/$/, '');
    const params = new URLSearchParams();
    if (options.redirectTo) params.set('callbackUrl', options.redirectTo);
    const paramStr = params.toString();
    const url = `${basePath}/signout${paramStr ? `?${paramStr}` : ''}`;
    return Response.redirect(url, 302);
  }

  return {
    handlers: { GET: handler, POST: handler },
    GET: handler,
    POST: handler,
    getSession: boundGetSession,
    auth: boundGetSession,
    signIn,
    signOut,
  };
}

/**
 * Retrieves the current session on the server side.
 *
 * Standalone two-argument form — use this when you don't have a factory
 * instance but have a request and config available directly.
 *
 * @param req - The current Request object
 * @param config - Auth.js configuration
 * @returns The session object or null
 *
 * @example
 * ```ts
 * import { getSession } from '@zitadel/solidstart-auth';
 * import { authOptions } from '~/lib/auth';
 *
 * const session = await getSession(request, authOptions);
 * ```
 *
 * @public
 */
export async function getSession(
  req: Request,
  config: SolidAuthConfig,
): Promise<Session | null> {
  config.basePath ??= '/api/auth';
  setEnvDefaults(process.env, config);

  const url = createActionURL(
    'session',
    new URL(req.url).protocol.slice(0, -1) as 'http' | 'https',
    new Headers(req.headers),
    process.env,
    config,
  );

  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.get('cookie') ?? '' } }),
    config,
  );

  const { status } = response;
  const data = (await response.json()) as Record<string, unknown> | null;
  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data as unknown as Session;
  throw new Error((data as { message?: string }).message ?? 'Session error');
}
