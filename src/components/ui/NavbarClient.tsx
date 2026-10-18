'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, LogOut, Package, Store } from 'lucide-react';
import { useCart } from '../providers/CartProvider';
import { User } from '@/types/auth';

interface NavbarClientProps {
  user: User | null;
}

export function NavbarClient({ user }: NavbarClientProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-header">
      {/* Top Academic Banner */}
      <div className="bg-slate-950/95 border-b border-slate-800/80 py-1.5 px-4 text-center text-xs text-slate-400">
        <span className="font-semibold text-white tracking-wide">Denis Josué Vásquez Rodríguez</span>
        <span className="mx-2 text-slate-600 hidden sm:inline">|</span>
        <span className="text-blue-400 font-medium block sm:inline mt-0.5 sm:mt-0">
          Optimización Avanzada de Rendimiento: Dominio de Web Vitals y Mutaciones Asíncronas en el Servidor
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/catalogo"
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-white hover:text-blue-400 transition"
              id="nav-logo"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Store className="w-5 h-5" />
              </div>
              <span>TechShop</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/catalogo"
              className={`text-sm font-medium transition ${
                isActive('/catalogo')
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
              id="nav-link-catalogo"
            >
              Catálogo
            </Link>

            {user && (
              <Link
                href="/mis-compras"
                className={`text-sm font-medium flex items-center gap-1.5 transition ${
                  isActive('/mis-compras')
                    ? 'text-blue-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                id="nav-link-mis-compras"
              >
                <Package className="w-4 h-4" />
                Mis Compras
              </Link>
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4">
            {/* Cart Link with Badge */}
            <Link
              href="/carrito"
              className="relative p-2 text-slate-300 hover:text-white transition rounded-lg hover:bg-slate-800/60"
              aria-label="Ver carrito de compras"
              id="nav-cart-btn"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50"
                  id="cart-badge-count"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Session */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                      {user.email}
                    </span>
                  </div>
                  <a
                    href="/api/auth/clear-cookie?next=/login"
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    title="Cerrar sesión"
                    id="nav-logout-btn"
                  >
                    <LogOut className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800/60 transition"
                    id="nav-login-btn"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/registro"
                    className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-lg shadow-sm transition"
                    id="nav-register-btn"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
              aria-label="Abrir menú"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-slate-800 px-4 pt-3 pb-5 space-y-3">
          <Link
            href="/catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Catálogo
          </Link>
          <Link
            href="/carrito"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            <span>Carrito</span>
            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
              {totalItems}
            </span>
          </Link>

          {user ? (
            <>
              <Link
                href="/mis-compras"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                Mis Compras
              </Link>
              <div className="pt-3 border-t border-slate-800">
                <div className="px-3 mb-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <a
                  href="/api/auth/clear-cookie?next=/login"
                  className="flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-md text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </a>
              </div>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 rounded-lg"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
