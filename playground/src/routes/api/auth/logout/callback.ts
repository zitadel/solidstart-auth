import { redirect } from '@solidjs/router';
import { APIEvent } from '@solidjs/start/server';
import { deleteCookie, parseCookies } from 'vinxi/http';

// noinspection JSUnusedGlobalSymbols
/**
 * Handles the logout callback by clearing all Auth.js session cookies and
 * redirecting to the success page. Used by Playwright tests to verify cookie
 * clearing. State validation is omitted in the playground.
 */
export async function GET(event: APIEvent) {
  for (const name of Object.keys(parseCookies(event.nativeEvent))) {
    if (name.startsWith('authjs.')) {
      deleteCookie(event.nativeEvent, name, { path: '/' });
    }
  }
  return redirect('/');
}
