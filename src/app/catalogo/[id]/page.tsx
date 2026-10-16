import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getProductById } from '@/lib/api/products';
import { getProductImage } from '@/lib/products/images';
import { ProductDetailClient } from '@/components/products/ProductDetailClient';
import { ChevronRight, CheckCircle2, AlertTriangle, XCircle, Tag } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: 'Producto no encontrado',
    };
  }

  return {
    title: product.name,
    description: product.description || `Compra ${product.name} en TechShop al mejor precio.`,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const imageUrl = getProductImage(product.sku, product.image_url);
  const priceNumber = Number(product.price);
  const formattedPrice = isNaN(priceNumber) ? '$0.00' : `$${priceNumber.toFixed(2)}`;

  const isAvailable = (Number(product.is_active) === 1 || product.is_active === true) && product.stock > 0;
  const isLowStock = isAvailable && product.stock <= 5;

  return (
    <div className="space-y-8" id="product-detail-view">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/catalogo" className="hover:text-white transition">
          Catálogo
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-200 font-medium truncate max-w-[200px] sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left: Product Image */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-900 shadow-2xl">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-cover"
          />

          {/* Floating Availability Badge */}
          <div className="absolute top-4 left-4">
            {!isAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-950/90 border border-red-800 text-red-200 backdrop-blur-md shadow-lg">
                <XCircle className="w-4 h-4 text-red-400" />
                Agotado
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-950/90 border border-amber-800 text-amber-200 backdrop-blur-md shadow-lg">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                ¡Pocas unidades disponibles! ({product.stock})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-950/90 border border-emerald-800 text-emerald-200 backdrop-blur-md shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Disponible en inventario ({product.stock} u.)
              </span>
            )}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-xs font-mono mb-3">
              <Tag className="w-3.5 h-3.5 text-blue-400" />
              <span>SKU: {product.sku}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price Card */}
          <div className="p-5 glass-card rounded-2xl flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {formattedPrice}
            </span>
            <span className="text-sm font-semibold text-blue-400">USD</span>
            <span className="text-xs text-slate-400 ml-auto">Impuestos y validación en checkout</span>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Descripción del Producto
            </h2>
            <p className="text-base text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description || 'Este producto no cuenta con descripción detallada registrada.'}
            </p>
          </div>

          {/* Interactive Client Section (Quantity selector + AddToCart) */}
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
