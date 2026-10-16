import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Cpu, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-in fade-in-50 duration-500">
        <Sparkles className="w-3.5 h-3.5" />
        <span>E-Commerce Universitario Next.js 16 + Laravel 12</span>
      </div>

      {/* Hero Headline */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
        Periféricos y Hardware de Alto Rendimiento para Profesionales
      </h1>

      <p className="mt-6 text-lg text-slate-400 max-w-2xl leading-relaxed">
        Descubre teclados mecánicos, monitores de alta tasa de refresco y accesorios ergonómicos diseñados para máxima productividad y gaming competitivo.
      </p>

      {/* Call to action buttons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link
          href="/catalogo"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
          id="hero-cta-catalogo"
        >
          <span>Explorar Catálogo Completo</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/carrito"
          className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl glass-card hover:bg-slate-800 text-slate-200 font-medium transition"
          id="hero-cta-carrito"
        >
          Ver Mi Carrito
        </Link>
      </div>

      {/* Feature highlights grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
        <div className="glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Arquitectura App Router</h3>
          <p className="mt-2 text-sm text-slate-400">
            Renderizado híbrido con Server Components para lectura ultra-rápida y Server Actions para mutaciones seguras.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Stripe Payment Intents</h3>
          <p className="mt-2 text-sm text-slate-400">
            Integración de pagos con verificación en dos fases, 3D Secure y validación criptográfica en backend.
          </p>
        </div>

        <div className="glass-card p-6 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Cookies httpOnly</h3>
          <p className="mt-2 text-sm text-slate-400">
            Flujo coordinado entre Server Action y Route Handler con tickets efímeros para proteger el token Sanctum.
          </p>
        </div>
      </div>
    </div>
  );
}
