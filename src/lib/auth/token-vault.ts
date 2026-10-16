import crypto from 'crypto';

interface VaultEntry {
  token: string;
  user?: unknown;
  expiresAt: number;
}

// In-memory single-use token vault with 30-second TTL
const vault = new Map<string, VaultEntry>();

// Clean expired entries periodically
function cleanExpired() {
  const now = Date.now();
  for (const [key, value] of vault.entries()) {
    if (value.expiresAt <= now) {
      vault.delete(key);
    }
  }
}

/**
 * Stores a token temporarily and returns a single-use exchange ticket (UUID).
 * The ticket is valid for 30 seconds and can only be exchanged once.
 */
export function createExchangeTicket(token: string, user?: unknown): string {
  cleanExpired();
  const ticket = crypto.randomUUID();
  vault.set(ticket, {
    token,
    user,
    expiresAt: Date.now() + 30 * 1000,
  });
  return ticket;
}

/**
 * Consumes a single-use exchange ticket, returning the stored token and removing it from the vault.
 */
export function consumeExchangeTicket(ticket: string): VaultEntry | null {
  cleanExpired();
  const entry = vault.get(ticket);
  if (!entry) {
    return null;
  }
  // Delete immediately to ensure single-use
  vault.delete(ticket);

  if (entry.expiresAt < Date.now()) {
    return null;
  }

  return entry;
}
