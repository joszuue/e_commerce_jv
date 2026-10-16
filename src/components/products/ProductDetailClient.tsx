'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../providers/CartProvider';
import { Product } from '@/types/product';

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isAvailable = (Number(product.is_active) === 1 || product.is_active === true) && product.stock > 0;
  const maxStock = product.stock;

  const handleIncrement = () => {
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Quantity & Add to Cart Controls */}
      <div className="p-6 glass-card rounded-2xl space-y-4">
        {isAvailable ? (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-300">Cantidad</span>
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  id="detail-qty-decrement"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-white text-sm" id="detail-qty-value">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={quantity >= maxStock}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  id="detail-qty-increment"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition shadow-lg ${
                added
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
              id="detail-add-to-cart-btn"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 animate-in zoom-in-50" />
                  <span>¡{quantity} {quantity === 1 ? 'unidad agregada' : 'unidades agregadas'}!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="text-center py-2">
            <button
              disabled
              className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50"
            >
              Producto Agotado Temporalmente
            </button>
          </div>
        )}
      </div>

      {/* Feature perks */}
      <div className="grid grid-cols-1 gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <Truck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Entrega rápida con empaque de protección para hardware</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Garantía de 12 meses contra defectos de fábrica</span>
        </div>
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
          <RefreshCw className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Devolución garantizada en caso de inconformidad</span>
        </div>
      </div>
    </div>
  );
}
