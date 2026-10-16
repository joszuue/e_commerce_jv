'use client';

import React, { useState, useId } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../providers/CartProvider';
import { getProductImage } from '@/lib/products/images';
import { createOrderAction } from '@/actions/order.actions';
import { createPaymentIntentAction } from '@/actions/payment.actions';
import { StripePaymentForm } from './StripePaymentForm';
import { User } from '@/types/auth';
import { Order } from '@/types/order';
import {
  ShoppingBag,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  Loader2,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const stripePublishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample_key_university_ecommerce';
const stripePromise = loadStripe(stripePublishableKey);

interface CheckoutClientProps {
  user: User;
}

export function CheckoutClient({ user }: CheckoutClientProps) {
  const { items, subtotal, totalItems } = useCart();
  const formSessionId = useId();

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // If cart is empty and no order has been placed in this session
  if (items.length === 0 && !createdOrder) {
    return (
      <div className="py-20 text-center glass-card rounded-3xl max-w-lg mx-auto p-8 shadow-xl" id="empty-checkout">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">No hay productos para pagar</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Tu carrito está vacío. Agrega productos desde el catálogo antes de ingresar al checkout.
        </p>
        <div className="mt-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30"
          >
            <span>Ir al Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Handle Step 1: Create Order in Backend via Server Action
  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    setErrorMessage(null);

    const idempotencyKey = `ord_${user.id}_${Date.now()}_${formSessionId}`;

    const orderPayload = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
    }));

    const result = await createOrderAction(orderPayload, idempotencyKey);

    if (!result.success || !result.order) {
      setErrorMessage(result.message || 'Error al generar la orden en el servidor.');
      setIsCreatingOrder(false);
      return;
    }

    setCreatedOrder(result.order);

    // Step 2: Request Stripe PaymentIntent from Server Action
    const intentResult = await createPaymentIntentAction(result.order.id);

    if (intentResult.success && intentResult.clientSecret) {
      setClientSecret(intentResult.clientSecret);
    } else {
      // Fallback message if payment intent is pending webhook or test mode
      setErrorMessage(
        intentResult.message ||
          'Orden creada con éxito, pero la pasarela de Stripe requiere configuración activa.'
      );
    }

    setIsCreatingOrder(false);
  };

  return (
    <div className="space-y-8" id="checkout-view">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Checkout Seguro</h1>
        <p className="mt-1 text-sm text-slate-400">
          Revisa tu pedido y completa el pago mediante la pasarela segura de Stripe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Form & Payment Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* User info card */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Datos del Comprador
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
              <div>
                <p className="font-bold text-white text-base">{user.name}</p>
                <p className="text-slate-400">{user.email}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
                Cuenta Verificada
              </span>
            </div>
          </div>

          {/* Error banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Payment Section */}
          {!createdOrder ? (
            /* Step 1: Create Order Trigger */
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base">Confirmar Orden de Compra</h3>
                  <p className="text-xs text-slate-400">
                    Al confirmar, el backend de Laravel validará el stock y registrará el pedido.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
                id="create-order-btn"
                className="w-full mt-4 py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isCreatingOrder ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creando orden en el servidor...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmar Orden (${subtotal.toFixed(2)} USD)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Step 2: Stripe Payment Elements */
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6" id="stripe-checkout-section">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">Orden Registrada</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      No. {createdOrder.order_number || `ORD-#${createdOrder.id}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total a Pagar</span>
                  <span className="text-lg font-black text-white">
                    ${Number(createdOrder.total || subtotal).toFixed(2)} USD
                  </span>
                </div>
              </div>

              {clientSecret ? (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'night',
                      variables: {
                        colorPrimary: '#3b82f6',
                        colorBackground: '#090d16',
                        colorText: '#f8fafc',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '12px',
                      },
                    },
                  }}
                >
                  <StripePaymentForm
                    orderId={createdOrder.id}
                    total={createdOrder.total || subtotal}
                  />
                </Elements>
              ) : (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-4">
                  <p className="text-sm text-slate-300">
                    Tu orden está creada con estado{' '}
                    <span className="font-mono text-amber-400 font-bold uppercase">
                      {createdOrder.status}
                    </span>
                    .
                  </p>
                  <Link
                    href={`/confirmacion/${createdOrder.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30"
                  >
                    <span>Consultar Estado de la Orden</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span>Resumen del Pedido</span>
          </h2>

          <div className="divide-y divide-slate-800 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.product.id} className="py-3 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                  <Image
                    src={getProductImage(item.product.sku, item.product.image_url)}
                    alt={item.product.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{item.product.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.quantity} x ${Number(item.product.price).toFixed(2)}
                  </p>
                </div>
                <span className="text-xs font-bold text-white">
                  ${(Number(item.product.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Artículos</span>
              <span className="text-white font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span className="text-white font-medium">${subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Envío estándar</span>
              <span className="text-emerald-400 font-medium">Gratis</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-white text-base">Total a Cobrar</span>
              <div className="text-right">
                <span className="text-2xl font-black text-white" id="checkout-total-val">
                  ${subtotal.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-blue-400 ml-1">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
