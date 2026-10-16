import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/api/products';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeletons';
import { PackageX } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogo de Productos',
  description: 'Explora nuestra selección completa de periféricos y hardware de alto rendimiento.',
};

// Revalidation strategy: 60s ISR / tag-based invalidation
export const revalidate = 60;

async function ProductCatalogList() {
  const products = await getProducts();

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center glass-card rounded-2xl max-w-lg mx-auto p-8" id="empty-catalog-state">
        <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">No hay productos disponibles</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Actualmente no se encontraron productos en el inventario. Por favor vuelve a consultar más tarde.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      id="product-catalog-grid"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Catálogo de Productos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Periféricos de computación y accesorios gamer con envío inmediato.
          </p>
        </div>
      </div>

      {/* Asynchronous Section with Suspense & Visible Skeleton Fallback */}
      <Suspense fallback={<ProductGridSkeleton count={6} />}>
        <ProductCatalogList />
      </Suspense>
    </div>
  );
}
