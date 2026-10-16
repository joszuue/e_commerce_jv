import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { serverFetch, ApiError } from '@/lib/api/client';
import { Order } from '@/types/order';
import { ConfirmationStatusClient } from '@/components/checkout/ConfirmationStatusClient';
import type { Metadata } from 'next';
import { Receipt, Calendar, CreditCard, ShieldAlert } from 'lucide-react';

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: 'Confirmación de Compra',
  description: 'Detalle y estado de verificación de tu orden de compra.',
};

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=/confirmacion/${id}`);
  }

  let order: Order | null = null;
  let isForbidden = false;

  try {
    const res = await serverFetch<{ order?: Order; data?: Order } | Order>(`/orders/${id}`, {
      requiresAuth: true,
      cache: 'no-store',
    });

    order =
      ('order' in res && res.order) ||
      ('data' in res && res.data) ||
      (res as Order);

    // Validate ownership on server
    if (order && Number(order.user_id) !== Number(user.id)) {
      isForbidden = true;
    }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    if (error instanceof ApiError && error.status === 403) {
      isForbidden = true;
    }
  }

  if (isForbidden) {
    return (
      <div className="py-20 text-center max-w-md mx-auto glass-card p-8 rounded-3xl border border-red-500/20">
        <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white">Acceso no autorizado</h1>
        <p className="mt-2 text-sm text-slate-400">
          Esta orden pertenece a otra cuenta. Por razones de seguridad no puedes ver este recibo.
        </p>
      </div>
    );
  }

  if (!order) {
    notFound();
  }

  const items = order.items || order.order_items || [];

  return (
    <div className="max-w-3xl mx-auto space-y-8" id="confirmation-view">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Comprobante de Transacción
        </span>
        <h1 className="text-3xl font-extrabold text-white">Detalle de la Orden</h1>
        <p className="text-sm text-slate-400 font-mono">
          Identificador: {order.order_number || `ORD-#${order.id}`}
        </p>
      </div>

      {/* Dynamic Status Component */}
      <ConfirmationStatusClient orderId={order.id} initialStatus={order.status} />

      {/* Order Summary Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Fecha de emisión:</span>
            <span className="font-semibold text-white">
              {new Date(order.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Estado:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                order.status === 'paid' || order.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            <span>Productos Adquiridos</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            {items.map((item, idx) => (
              <div key={item.id || idx} className="py-3 flex items-center justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-white">{item.product_name || `Producto #${item.product_id}`}</p>
                  <p className="text-xs text-slate-400 font-mono">SKU: {item.product_sku || 'N/A'}</p>
                  <p className="text-xs text-slate-400">
                    {item.quantity} x ${Number(item.unit_price).toFixed(2)} USD
                  </p>
                </div>
                <span className="font-bold text-white text-base">
                  ${Number(item.subtotal || Number(item.unit_price) * item.quantity).toFixed(2)} USD
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total breakdown */}
        <div className="pt-6 border-t border-slate-800 space-y-2 text-sm">
          <div className="flex justify-between items-baseline pt-2">
            <span className="text-base font-bold text-white">Total Pagado</span>
            <div className="text-right">
              <span className="text-2xl font-black text-white">
                ${Number(order.total).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-blue-400 ml-1">
                {order.currency?.toUpperCase() || 'USD'}
              </span>
            </div>
          </div>
        </div>

        {/* Security watermark */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>Transacción cifrada con Stripe & TLS 1.3</span>
          <span className="flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            Modo de Prueba Seguro
          </span>
        </div>
      </div>
    </div>
  );
}
