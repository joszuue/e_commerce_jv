'use server';

import { serverFetch, ApiError } from '@/lib/api/client';
import { getCurrentUser } from '@/lib/auth/session';
import { PaymentIntentResponse } from '@/types/payment';
import { Order } from '@/types/order';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface PaymentIntentResult {
  success: boolean;
  message?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  order?: Order;
}

/**
 * Server Action to request a Stripe PaymentIntent client secret for an existing order
 */
export async function createPaymentIntentAction(orderId: number): Promise<PaymentIntentResult> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      message: 'Sesión no válida. Inicia sesión para proceder con el pago.',
    };
  }

  if (!orderId || orderId <= 0) {
    return {
      success: false,
      message: 'Identificador de orden no válido.',
    };
  }

  try {
    let rawRes: unknown;
    try {
      rawRes = await serverFetch<unknown>(`/orders/${orderId}/payment-intent`, {
        method: 'POST',
        requiresAuth: true,
        cache: 'no-store',
      });
    } catch {
      rawRes = await serverFetch<unknown>('/payments/payment-intent', {
        method: 'POST',
        body: { order_id: orderId },
        requiresAuth: true,
        cache: 'no-store',
      });
    }

    const payload = (rawRes && typeof rawRes === 'object' && 'data' in rawRes && (rawRes as { data: PaymentIntentResponse }).data)
      ? (rawRes as { data: PaymentIntentResponse }).data
      : (rawRes as PaymentIntentResponse);

    const clientSecret = payload?.client_secret || payload?.clientSecret;

    if (!clientSecret) {
      return {
        success: false,
        message: 'No se recibió la clave secreta de cliente de Stripe desde el servidor.',
      };
    }

    return {
      success: true,
      clientSecret,
      paymentIntentId: payload.payment_intent_id,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message || 'Error al iniciar la pasarela de pago.',
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error de comunicación con la pasarela de pago.',
    };
  }
}

/**
 * Server Action to verify order payment status against the backend
 * Guarantees that only backend-verified purchases are confirmed.
 */
export async function verifyOrderPaymentAction(orderId: number): Promise<{
  success: boolean;
  isPaid: boolean;
  status: string;
  message?: string;
  order?: Order;
}> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      success: false,
      isPaid: false,
      status: 'unauthenticated',
      message: 'Sesión expirada.',
    };
  }

  try {
    const res = await serverFetch<{ order?: Order; data?: Order } | Order>(`/orders/${orderId}`, {
      requiresAuth: true,
      cache: 'no-store',
    });

    const order =
      ('order' in res && res.order) ||
      ('data' in res && res.data) ||
      (res as Order);

    if (!order) {
      return {
        success: false,
        isPaid: false,
        status: 'not_found',
        message: 'Orden no encontrada.',
      };
    }

    // Verify ownership: order.user_id must match authenticated user
    if (Number(order.user_id) !== Number(user.id)) {
      return {
        success: false,
        isPaid: false,
        status: 'forbidden',
        message: 'No tienes autorización para consultar esta orden.',
      };
    }

    const isPaid = order.status === 'paid' || order.status === 'completed';

    if (isPaid) {
      revalidatePath('/mis-compras');
      revalidatePath(`/confirmacion/${orderId}`);
      revalidateTag('orders', 'max');
    }

    return {
      success: true,
      isPaid,
      status: order.status,
      order,
    };
  } catch (error) {
    return {
      success: false,
      isPaid: false,
      status: 'error',
      message: error instanceof Error ? error.message : 'Error al verificar la orden.',
    };
  }
}
