import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-950/80 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-slate-800 text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Envíos Seguros</p>
              <p className="text-xs text-slate-400">Entrega garantizada con seguimiento en tiempo real</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Pagos Cifrados con Stripe</p>
              <p className="text-xs text-slate-400">Protocolo seguro con autenticación bancaria 3D Secure</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-white">Garantía Directa</p>
              <p className="text-xs text-slate-400">30 días de garantía con soporte técnico universitario</p>
            </div>
          </div>
        </div>

        {/* Footer Links & Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <Store className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-white">TechShop E-Commerce</span>
            </div>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-400">Denis Josué Vásquez Rodríguez</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/catalogo" className="hover:text-white transition">
              Catálogo
            </Link>
            <Link href="/carrito" className="hover:text-white transition">
              Carrito
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Mi Cuenta
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
