'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center max-w-md mx-auto" id="product-detail-error">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold text-white">Error al cargar el producto</h2>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
        {error.message || 'No fue posible obtener la información del producto. Intente nuevamente.'}
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-600/30"
          id="retry-detail-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 text-sm font-medium transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Catálogo</span>
        </Link>
      </div>
    </div>
  );
}
