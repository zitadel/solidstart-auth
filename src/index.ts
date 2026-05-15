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
 */
export type SolidAuthConfig = Omit<AuthConfig, 'raw'>;

/**
 * Creates a SolidStart Auth handler.
 *
 * Returns `{ GET, POST }` handlers to be exported from your auth API route.
 *
 * @param config - Auth.js configuration
 * @returns Object with GET and POST handler functions
 *
 * @example
 * ```ts
 * // src/lib/auth.ts
 * import { SolidAuth, type SolidAuthConfig } from '@zitadel/solidstart-auth';
 * import Zitadel from '@auth/core/providers/zitadel';
 *
 * const authOptions: SolidAuthConfig = {
 *   providers: [Zitadel({ ... })],
 *   secret: process.env.AUTH_SECRET,
 * };
 *
 * export const { GET, POST } = SolidAuth(authOptions);
 * ```
 */
export function SolidAuth(config: SolidAuthConfig): {
  GET: (event: { request: Request }) => Promise<Response>;
  POST: (event: { request: Request }) => Promise<Response>;
} {
  setEnvDefaults(process.env, config);

  async function handler(event: { request: Request }): Promise<Response> {
    return Auth(event.request, config);
  }

  return {
    GET: handler,
    POST: handler,
  };
}

/**
 * Retrieves the current session on the server side.
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
 */
export async function getSession(
  req: Request,
  config: SolidAuthConfig,
): Promise<Session | null> {
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
