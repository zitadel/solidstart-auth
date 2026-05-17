import type { APIEvent } from '@solidjs/start/server';

/** Public endpoint — accessible without authentication. */
// noinspection JSUnusedGlobalSymbols
export async function GET(_event: APIEvent) {
  return Response.json({ ok: true });
}
