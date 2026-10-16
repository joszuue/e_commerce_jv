import 'server-only';
import { serverFetch, ApiError } from './client';
import { Product, ProductsResponse } from '@/types/product';

/**
 * Fetches the public products list with Next.js revalidation
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await serverFetch<ProductsResponse | { data: Product[] } | Product[]>('/products', {
      next: { revalidate: 60, tags: ['products'] },
    });

    if (Array.isArray(res)) {
      return res;
    }
    if (res && 'data' in res && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    // If backend is unreachable or errored, rethrow so error.tsx handles it with retry
    throw error;
  }
}

/**
 * Fetches a single product by ID
 */
export async function getProductById(id: string | number): Promise<Product | null> {
  try {
    const res = await serverFetch<{ data: Product } | Product>(`/products/${id}`, {
      next: { revalidate: 60, tags: [`product-${id}`] },
    });

    if (res && 'data' in res && res.data) {
      return res.data;
    }
    return res as Product;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}
