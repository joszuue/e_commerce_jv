import React from 'react';
import Link from 'next/link';
import { getUserOrders } from '@/lib/api/orders';
import { Package, Calendar, ArrowRight, ShoppingBag, ExternalLink } from 'lucide-react';

export async function OrderHistoryList() {
  const orders = await getUserOrders();

  if (!orders || orders.length === 0) {
    return (
      <div className="py-20 text-center glass-card rounded-3xl max-w-lg mx-auto p-8 shadow-xl" id="empty-history-view">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No tienes compras registradas</h2>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Aún no has completado ninguna orden en nuestra tienda. ¡Explora nuestro catálogo para encontrar el mejor hardware!
        </p>
        <div className="mt-6">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30"
            id="empty-history-to-catalogo"
          >
            <span>Explorar Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4" id="orders-history-container">
      {orders.map((order) => {
        const items = order.items || order.order_items || [];
        const isPaid = order.status === 'paid' || order.status === 'completed';

        return (
          <div
            key={order.id}
            className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition shadow-lg space-y-4"
            id={`order-row-${order.id}`}
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Orden #{order.order_number || order.id}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isPaid
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-lg font-black text-white">
                  ${Number(order.total).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Items summary */}
            {items.length > 0 && (
              <div className="text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300 block">Artículos:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {items.map((item, i) => (
                    <li key={item.id || i} className="truncate">
                      {item.quantity}x {item.product_name || `Producto #${item.product_id}`} (${Number(item.unit_price).toFixed(2)} c/u)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action link */}
            <div className="pt-2 flex justify-end">
              <Link
                href={`/confirmacion/${order.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition"
                id={`view-order-detail-${order.id}`}
              >
                <span>Ver Comprobante Completo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
