'use server';

import { serverFetch, ApiError } from '@/lib/api/client';
import { getCurrentUser } from '@/lib/auth/session';
import { Order } from '@/types/order';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface CreateOrderResult {
  success: boolean;
  message?: string;
  order?: Order;
  errors?: Record<string, string[]>;
}

interface OrderItemInput {
  product_id: number;
  quantity: number;
}

/**
 * Server Action to create a new order in Laravel API
 * Enforces session authentication and input validation on each invocation.
 */
export async function createOrderAction(
  items: OrderItemInput[],
  idempotencyKey?: string
): Promise<CreateOrderResult> {
  // 1. Session verification
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: 'Debes iniciar sesión para completar tu orden de compra.',
    };
  }

  // 2. Cart items validation
  if (!Array.isArray(items) || items.length === 0) {
    return {
      success: false,
      message: 'El carrito de compras está vacío. Agrega productos antes de continuar.',
    };
  }

  const validItems = items.filter(
    (item) => item.product_id && Number(item.product_id) > 0 && item.quantity > 0
  );

  if (validItems.length === 0) {
    return {
      success: false,
      message: 'Los productos seleccionados no son válidos.',
    };
  }

  // 3. Coordinate with Laravel API
  try {
    const payload = {
      items: validItems.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
      idempotency_key: idempotencyKey || undefined,
    };

    const res = await serverFetch<{ order?: Order; data?: Order } | Order>('/orders', {
      method: 'POST',
      body: payload,
      requiresAuth: true,
      headers: idempotencyKey
        ? { 'Idempotency-Key': idempotencyKey, 'X-Idempotency-Key': idempotencyKey }
        : {},
      cache: 'no-store',
    });

    const order =
      ('order' in res && res.order) ||
      ('data' in res && res.data) ||
      (res as Order);

    if (!order || !order.id) {
      return {
        success: false,
        message: 'No fue posible generar la orden de compra.',
      };
    }

    // Invalidate caches related to orders and products
    revalidatePath('/mis-compras');
    revalidateTag('orders', 'max');

    return {
      success: true,
      order,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message || 'Error al procesar la orden en el servidor.',
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de comunicación al crear la orden.',
    };
  }
}
