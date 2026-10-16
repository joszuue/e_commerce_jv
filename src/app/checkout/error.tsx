'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ShoppingCart } from 'lucide-react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center max-w-md mx-auto" id="checkout-error">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold text-white">Error en el proceso de checkout</h2>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
        {error.message || 'No fue posible iniciar el checkout. Verifique su conexión y vuelva a intentarlo.'}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-600/30"
          id="retry-checkout-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
        <Link
          href="/carrito"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 text-sm font-medium transition"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Regresar al Carrito</span>
        </Link>
      </div>
    </div>
  );
}
