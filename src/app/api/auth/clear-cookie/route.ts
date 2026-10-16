import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Route Handler to delete the httpOnly auth cookie on logout.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const next = searchParams.get('next') || '/login';
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/login';

  const redirectUrl = new URL(safeNext, request.url);
  const response = NextResponse.redirect(redirectUrl, 303);

  response.cookies.delete('auth_token');

  return response;
}
