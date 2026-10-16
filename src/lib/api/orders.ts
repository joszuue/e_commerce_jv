import 'server-only';
import { serverFetch } from './client';
import { Order } from '@/types/order';

/**
 * Fetches authenticated user's order history from Laravel API
 */
export async function getUserOrders(): Promise<Order[]> {
  try {
    const res = await serverFetch<Order[] | { data: Order[] }>('/orders', {
      requiresAuth: true,
      next: { tags: ['orders'], revalidate: 0 },
      cache: 'no-store',
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    throw error;
  }
}
