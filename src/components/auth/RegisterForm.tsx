'use client';

import React, { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerAction } from '@/actions/auth.actions';
import { User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, null);

  useEffect(() => {
    if (state?.success) {
      if (state.exchangeTicket) {
        window.location.href = `/api/auth/set-cookie?ticket=${encodeURIComponent(
          state.exchangeTicket
        )}&next=${encodeURIComponent(state.redirectTo || '/catalogo')}`;
      } else if (state.redirectTo) {
        router.push(state.redirectTo);
      }
    }
  }, [state, router]);

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Crear Cuenta</h1>
        <p className="mt-2 text-sm text-slate-400">
          Únete a TechShop para disfrutar de compras seguras y seguimiento de tus pedidos.
        </p>
      </div>

      {state?.message && !state?.success && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-4" id="register-form">
        {/* Name Field */}
        <div>
          <label htmlFor="register-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Nombre Completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="register-name"
              name="name"
              type="text"
              required
              disabled={isPending}
              placeholder="Ej. Juan Pérez"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 ${
                state?.errors?.name ? 'border-red-500' : 'border-slate-800'
              }`}
            />
          </div>
          {state?.errors?.name && (
            <p className="mt-1.5 text-xs text-red-400 font-medium">
              {state.errors.name[0]}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="register-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="register-email"
              name="email"
              type="email"
              required
              disabled={isPending}
              placeholder="tu@correo.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 ${
                state?.errors?.email ? 'border-red-500' : 'border-slate-800'
              }`}
            />
          </div>
          {state?.errors?.email && (
            <p className="mt-1.5 text-xs text-red-400 font-medium">
              {state.errors.email[0]}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="register-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password"
              name="password"
              type="password"
              required
              disabled={isPending}
              placeholder="Mínimo 8 caracteres"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 ${
                state?.errors?.password ? 'border-red-500' : 'border-slate-800'
              }`}
            />
          </div>
          {state?.errors?.password && (
            <p className="mt-1.5 text-xs text-red-400 font-medium">
              {state.errors.password[0]}
            </p>
          )}
        </div>

        {/* Password Confirmation Field */}
        <div>
          <label htmlFor="register-password-conf" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="register-password-conf"
              name="password_confirmation"
              type="password"
              required
              disabled={isPending}
              placeholder="Repite tu contraseña"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-60 ${
                state?.errors?.password_confirmation ? 'border-red-500' : 'border-slate-800'
              }`}
            />
          </div>
          {state?.errors?.password_confirmation && (
            <p className="mt-1.5 text-xs text-red-400 font-medium">
              {state.errors.password_confirmation[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          id="register-submit-btn"
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registrando...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Crear Cuenta</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
        ¿Ya tienes una cuenta?{' '}
        <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition">
          Inicia sesión aquí
        </Link>
      </div>
    </div>
  );
}
