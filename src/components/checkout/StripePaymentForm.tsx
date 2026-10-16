'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../providers/CartProvider';
import { Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface StripePaymentFormProps {
  orderId: number;
  total: number | string;
}

export function StripePaymentForm({ orderId, total }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const returnUrl = `${window.location.origin}/confirmacion/${orderId}`;

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: 'if_required',
    });

    if (error) {
      setErrorMessage(error.message || 'Ocurrió un error al procesar el pago.');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push(`/confirmacion/${orderId}?payment_intent=${paymentIntent.id}`);
      }, 1000);
    } else {
      // Default to confirmation redirect
      clearCart();
      router.push(`/confirmacion/${orderId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="stripe-payment-form">
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>¡Pago autorizado exitosamente! Redirigiendo a tu confirmación...</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing || success}
        id="stripe-pay-btn"
        className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base transition shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Procesando pago con Stripe...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            <span>Pagar ${Number(total).toFixed(2)} USD</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5" />
        <span>Pagos procesados en modo de prueba mediante Stripe Elements.</span>
      </p>
    </form>
  );
}
