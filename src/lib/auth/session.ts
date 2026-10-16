import 'server-only';
import { cookies } from 'next/headers';
import { serverFetch, ApiError } from '../api/client';
import { User } from '@/types/auth';

/**
 * Returns the currently authenticated user by checking the httpOnly cookie
 * and validating against Laravel's /auth/me or /user endpoint.
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    // Try /auth/me first, fallback to /user if needed
    try {
      const response = await serverFetch<{ user?: User; data?: User } | User>('/auth/me', {
        requiresAuth: true,
        cache: 'no-store',
      });

      if ('user' in response && response.user) return response.user;
      if ('data' in response && response.data) return response.data;
      return response as User;
    } catch {
      const response = await serverFetch<{ user?: User; data?: User } | User>('/user', {
        requiresAuth: true,
        cache: 'no-store',
      });

      if ('user' in response && response.user) return response.user;
      if ('data' in response && response.data) return response.data;
      return response as User;
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null;
    }
    // In case of network error, return null so we don't break public pages
    return null;
  }
}

/**
 * Helper to check if a user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}
