'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/providers/CartProvider';
import { getProductImage } from '@/lib/products/images';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center glass-card rounded-3xl max-w-lg mx-auto p-8 shadow-xl" id="empty-cart-view">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-white">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Parece que aún no has agregado productos a tu carrito de compras.
        </p>
        <div className="mt-8">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30"
            id="empty-cart-to-catalogo"
          >
            <span>Explorar Productos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="cart-view">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Carrito de Compras</h1>
          <p className="mt-1 text-sm text-slate-400">
            Tienes {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu lista de compra.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
          id="clear-cart-btn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vaciar Carrito</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4" id="cart-items-container">
          {items.map((item) => {
            const product = item.product;
            const imageUrl = getProductImage(product.sku, product.image_url);
            const itemPrice = Number(product.price);
            const itemTotal = itemPrice * item.quantity;

            return (
              <div
                key={product.id}
                className="glass-card p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 transition hover:border-slate-700"
                id={`cart-item-${product.id}`}
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/catalogo/${product.id}`}
                    className="font-bold text-white hover:text-blue-400 transition text-base line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
                  <p className="text-sm font-semibold text-slate-300 mt-1">
                    ${itemPrice.toFixed(2)} USD c/u
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1">
                  <button
                    onClick={() => updateQuantity(product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    aria-label="Reducir cantidad"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-7 text-center font-bold text-white text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, item.quantity + 1)}
                    disabled={item.quantity >= product.stock}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition"
                    aria-label="Incrementar cantidad"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <span className="text-base font-extrabold text-white">
                    ${itemTotal.toFixed(2)} USD
                  </span>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Eliminar producto"
                    id={`remove-item-${product.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continuar comprando</span>
            </Link>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="glass-card p-6 rounded-3xl space-y-6 lg:sticky lg:top-24 border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-white">Resumen del Pedido</h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal estimado</span>
              <span className="font-semibold text-white">${subtotal.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Envío</span>
              <span className="text-emerald-400 font-medium">Calculado en checkout</span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-white text-base">Total Estimado</span>
              <div className="text-right">
                <span className="text-2xl font-black text-white" id="cart-total-amount">
                  ${subtotal.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-blue-400 ml-1">USD</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            * Nota: El importe final y la disponibilidad de stock son validados y confirmados por la API de Laravel al generar la orden de compra.
          </p>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/30"
            id="proceed-to-checkout-btn"
          >
            <span>Continuar al Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
