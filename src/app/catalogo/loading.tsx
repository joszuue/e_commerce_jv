import { ProductGridSkeleton } from '@/components/ui/Skeletons';

export default function CatalogoLoading() {
  return (
    <div className="space-y-8" id="catalogo-loading">
      <div className="space-y-3">
        <div className="h-8 bg-slate-800 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-slate-800/60 rounded-md w-72 animate-pulse" />
      </div>
      <ProductGridSkeleton count={6} />
    </div>
  );
}
