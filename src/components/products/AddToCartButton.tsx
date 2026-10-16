'use client';

import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../providers/CartProvider';
import { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  showIcon?: boolean;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  showIcon = true,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isAvailable = (Number(product.is_active) === 1 || product.is_active === true) && product.stock > 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAvailable) return;

    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={!isAvailable}
      id={`add-to-cart-${product.id}`}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 active:scale-95 ${
        !isAvailable
          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          : added
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
      } ${className}`}
      aria-label={`Agregar ${product.name} al carrito`}
    >
      {added ? (
        <>
          <Check className="w-4 h-4 animate-in zoom-in-50" />
          <span>¡Agregado!</span>
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4" />}
          <span>{!isAvailable ? 'Agotado' : 'Agregar al Carrito'}</span>
        </>
      )}
    </button>
  );
}
