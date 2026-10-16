import { NextRequest, NextResponse } from 'next/server';
import { consumeExchangeTicket } from '@/lib/auth/token-vault';

export const dynamic = 'force-dynamic';

/**
 * Route Handler to establish the httpOnly auth cookie from a single-use exchange ticket.
 * Fulfills academic requirement: Server Action authenticates and yields control to a Route Handler
 * using an ephemeral one-time ticket, keeping the real Laravel token strictly on the server.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ticket = searchParams.get('ticket');
  const next = searchParams.get('next') || '/catalogo';

  if (!ticket) {
    return NextResponse.redirect(new URL('/login?error=ticket_missing', request.url));
  }

  const entry = consumeExchangeTicket(ticket);
  if (!entry) {
    return NextResponse.redirect(new URL('/login?error=ticket_expired_or_invalid', request.url));
  }

  // Create redirect response
  // Safe redirect sanitization
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/catalogo';
  const redirectUrl = new URL(safeNext, request.url);
  const response = NextResponse.redirect(redirectUrl, 303);

  // Set the httpOnly cookie securely
  response.cookies.set({
    name: 'auth_token',
    value: entry.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
