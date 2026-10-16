'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function CatalogoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-16 text-center max-w-md mx-auto" id="catalogo-error-boundary">
      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-bold text-white">Error al cargar el catálogo</h2>
      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
        {error.message || 'No fue posible obtener los productos desde la API. Verifique la conexión con el servidor.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition shadow-lg shadow-blue-600/30"
          id="retry-catalogo-btn"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reintentar</span>
        </button>
      </div>
    </div>
  );
}
