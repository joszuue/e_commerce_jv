'use client';

import React, { useActionState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/actions/auth.actions';
import { Mail, Lock, LogIn, AlertCircle, Loader2 } from 'lucide-react';

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/catalogo';
  const registered = searchParams.get('registered') === 'true';

  const [state, formAction, isPending] = useActionState(loginAction, null);

  // When Server Action succeeds and returns exchange ticket, hand off to Route Handler
  useEffect(() => {
    if (state?.success && state.exchangeTicket) {
      // Full navigation required so the browser processes the Route Handler's Set-Cookie response
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/api/auth/set-cookie?ticket=${encodeURIComponent(
        state.exchangeTicket
      )}&next=${encodeURIComponent(state.redirectTo || next)}`;
    }
  }, [state, next]);

  return (
    <div className="w-full max-w-md mx-auto glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Iniciar Sesión</h1>
        <p className="mt-2 text-sm text-slate-400">
          Ingresa tus credenciales para acceder a tu cuenta y gestionar tus compras.
        </p>
      </div>

      {registered && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-medium">
          ¡Cuenta creada exitosamente! Ya puedes iniciar sesión con tus credenciales.
        </div>
      )}

      {state?.message && !state?.success && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{state.message}</span>
        </div>
      )}

      <form action={formAction} className="space-y-5" id="login-form">
        <input type="hidden" name="next" value={next} />

        {/* Email Field */}
        <div>
          <label htmlFor="login-email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              defaultValue="customer@example.com"
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
          <label htmlFor="login-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={isPending}
              defaultValue="Password123!"
              placeholder="••••••••"
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

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          id="login-submit-btn"
          className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
        ¿No tienes una cuenta aún?{' '}
        <Link href="/registro" className="font-semibold text-blue-400 hover:text-blue-300 transition">
          Regístrate aquí
        </Link>
      </div>
    </div>
  );
}
