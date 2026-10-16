'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../providers/CartProvider';
import { verifyOrderPaymentAction } from '@/actions/payment.actions';
import { CheckCircle2, Clock, AlertTriangle, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ConfirmationStatusClientProps {
  orderId: number;
  initialStatus: string;
}

export function ConfirmationStatusClient({
  orderId,
  initialStatus,
}: ConfirmationStatusClientProps) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [status, setStatus] = useState(initialStatus);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isPaid = status === 'paid' || status === 'completed';
  const isPending = status === 'pending_payment' || status === 'processing';

  // Automatically clear cart when payment is confirmed by the backend
  useEffect(() => {
    if (isPaid) {
      clearCart();
    }
  }, [isPaid, clearCart]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setMessage(null);

    const res = await verifyOrderPaymentAction(orderId);

    if (res.success) {
      setStatus(res.status);
      if (res.isPaid) {
        clearCart();
        setMessage('¡Pago verificado y acreditado exitosamente por el servidor!');
      } else {
        setMessage('La orden continúa en procesamiento. Si acabas de autorizar el pago, espera unos segundos.');
      }
    } else {
      setMessage(res.message || 'No fue posible actualizar el estado del pago.');
    }

    setIsVerifying(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Status Banner */}
      {isPaid ? (
        <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">¡Compra Confirmada y Pagada!</h2>
            <p className="mt-1 text-sm text-slate-300">
              El backend ha registrado y validado satisfactoriamente el cobro a través de Stripe. Tu pedido está en preparación para entrega.
            </p>
          </div>
        </div>
      ) : isPending ? (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Pago en Proceso de Verificación</h2>
            <p className="mt-1 text-sm text-slate-300">
              La orden ha sido creada pero aún no se recibe la confirmación definitiva del webhook de Stripe. Puedes actualizar para consultar el estado más reciente.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                id="verify-payment-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Consultando backend...' : 'Verificar Pago Ahora'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-slate-400 shrink-0 mt-1" />
          <div>
            <h2 className="text-lg font-bold text-white">Estado de la Orden: {status}</h2>
            <p className="mt-1 text-sm text-slate-400">
              La orden no registra un pago exitoso en el sistema.
            </p>
          </div>
        </div>
      )}

      {message && (
        <p className="text-xs font-medium text-slate-400 px-2 animate-in fade-in-50">
          {message}
        </p>
      )}

      {/* Action links */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link
          href="/mis-compras"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30"
          id="confirm-to-history-btn"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ver en Mis Compras</span>
        </Link>
        <Link
          href="/catalogo"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-medium text-sm transition"
        >
          <span>Regresar al Catálogo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
