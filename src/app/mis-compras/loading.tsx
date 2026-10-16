import React from 'react';

export default function MisComprasLoading() {
  return (
    <div className="space-y-6" id="history-loading">
      <div className="space-y-2">
        <div className="h-8 bg-slate-800 rounded-lg w-48 animate-pulse" />
        <div className="h-4 bg-slate-800/60 rounded-md w-72 animate-pulse" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card p-6 rounded-2xl animate-pulse space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-slate-800 rounded w-40" />
              <div className="h-6 bg-slate-800 rounded-full w-24" />
            </div>
            <div className="h-4 bg-slate-800/60 rounded w-64" />
          </div>
        ))}
      </div>
    </div>
  );
}
