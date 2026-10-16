import Link from 'next/link';
import { ArrowLeft, PackageSearch } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="py-20 text-center max-w-lg mx-auto" id="product-not-found">
      <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <PackageSearch className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-white">Producto no encontrado</h1>
      <p className="mt-3 text-base text-slate-400 leading-relaxed">
        El producto que estás buscando no existe, ha sido descontinuado o el identificador proporcionado no es válido.
      </p>
      <div className="mt-8">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition shadow-lg shadow-blue-600/30"
          id="not-found-back-to-catalogo"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>
      </div>
    </div>
  );
}
