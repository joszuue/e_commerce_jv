import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product';
import { getProductImage } from '@/lib/products/images';
import { AddToCartButton } from './AddToCartButton';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getProductImage(product.sku, product.image_url);
  const priceNumber = Number(product.price);
  const formattedPrice = isNaN(priceNumber) ? '$0.00' : `$${priceNumber.toFixed(2)}`;

  const isAvailable = (Number(product.is_active) === 1 || product.is_active === true) && product.stock > 0;
  const isLowStock = isAvailable && product.stock <= 5;

  return (
    <div
      className="group glass-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-950/20"
      id={`product-card-${product.id}`}
    >
      {/* Product Image Link */}
      <Link
        href={`/catalogo/${product.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-slate-900"
        tabIndex={-1}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />

        {/* Stock Badge */}
        <div className="absolute top-3 left-3">
          {!isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 border border-red-800 text-red-300 backdrop-blur-md">
              <XCircle className="w-3.5 h-3.5" />
              Agotado
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 border border-amber-800 text-amber-300 backdrop-blur-md">
              <AlertTriangle className="w-3.5 h-3.5" />
              Últimas {product.stock} unidades
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800 text-emerald-300 backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              En Stock ({product.stock})
            </span>
          )}
        </div>

        {/* SKU tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950/70 text-slate-400 border border-slate-800 backdrop-blur-md">
            {product.sku}
          </span>
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/catalogo/${product.id}`}
            className="block text-lg font-bold text-white hover:text-blue-400 transition leading-snug"
            id={`product-title-${product.id}`}
          >
            {product.name}
          </Link>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {product.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Price & Action */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Precio</span>
            <span className="text-xl font-extrabold text-white tracking-tight">
              {formattedPrice}{' '}
              <span className="text-xs font-semibold text-slate-400">USD</span>
            </span>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
