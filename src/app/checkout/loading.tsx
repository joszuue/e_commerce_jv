import React from 'react';
import { Loader2 } from 'lucide-react';

export default function CheckoutLoading() {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-4" id="checkout-loading">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto" />
      <h2 className="text-xl font-bold text-white">Preparando tu pasarela de checkout...</h2>
      <p className="text-sm text-slate-400">
        Verificando sesión segura y conectando con el servidor.
      </p>
    </div>
  );
}
