import type { APIEvent } from '@solidjs/start/server';
import { getSession } from '~/lib/auth';

/** Middleware-protected endpoint — returns 403 when the request is unauthenticated. */
// noinspection JSUnusedGlobalSymbols
export async function GET(event: APIEvent) {
  const session = await getSession(event.request);
  if (!session) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  return Response.json({ ok: true });
}
