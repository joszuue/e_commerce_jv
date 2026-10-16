import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] w-full bg-slate-800/60" />
      <div className="p-5 space-y-4">
        <div className="h-5 bg-slate-800/80 rounded-md w-3/4" />
        <div className="space-y-2">
          <div className="h-3.5 bg-slate-800/50 rounded-md w-full" />
          <div className="h-3.5 bg-slate-800/50 rounded-md w-4/5" />
        </div>
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="h-6 bg-slate-800/80 rounded-md w-24" />
          <div className="h-10 bg-slate-800 rounded-xl w-32" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="product-grid-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-6 animate-pulse" id="product-detail-skeleton">
      <div className="aspect-square rounded-2xl bg-slate-800/60 w-full" />
      <div className="space-y-6">
        <div className="h-8 bg-slate-800/80 rounded-md w-3/4" />
        <div className="h-6 bg-slate-800/60 rounded-md w-32" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-800/50 rounded w-full" />
          <div className="h-4 bg-slate-800/50 rounded w-full" />
          <div className="h-4 bg-slate-800/50 rounded w-2/3" />
        </div>
        <div className="h-14 bg-slate-800 rounded-2xl w-full" />
      </div>
    </div>
  );
}
