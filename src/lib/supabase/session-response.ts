import { NextResponse } from 'next/server';

/** Preserve refreshed session cookies when Proxy changes a response to a redirect. */
export function redirectWithSession(url: URL, sessionResponse: NextResponse) {
  const response = NextResponse.redirect(url);
  for (const cookie of sessionResponse.cookies.getAll())
    response.cookies.set(cookie);
  for (const name of ['Cache-Control', 'Expires', 'Pragma']) {
    const value = sessionResponse.headers.get(name);
    if (value) response.headers.set(name, value);
  }
  return response;
}
