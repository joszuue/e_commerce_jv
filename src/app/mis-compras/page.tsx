import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { OrderHistoryList } from '@/components/orders/OrderHistoryList';
import MisComprasLoading from './loading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mis Compras',
  description: 'Historial de órdenes y comprobantes de compra.',
};

export default async function MisComprasPage() {
  const user = await getCurrentUser();

  // Strict server-side route protection
  if (!user) {
    redirect('/login?next=/mis-compras');
  }

  return (
    <div className="space-y-8" id="mis-compras-view">
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Historial de Compras</h1>
        <p className="mt-1 text-sm text-slate-400">
          Consulta tus pedidos registrados, comprobantes y estado de pago en tiempo real.
        </p>
      </div>

      {/* Asynchronous Order History with Suspense Fallback */}
      <Suspense fallback={<MisComprasLoading />}>
        <OrderHistoryList />
      </Suspense>
    </div>
  );
}
