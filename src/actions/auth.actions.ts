'use server';

import { serverFetch, ApiError } from '@/lib/api/client';
import { createExchangeTicket } from '@/lib/auth/token-vault';
import { AuthResponse } from '@/types/auth';

export interface AuthActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  exchangeTicket?: string;
  redirectTo?: string;
}

/**
 * Server Action for User Login
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const next = (formData.get('next') as string)?.trim() || '/catalogo';

  // Server-side validation
  const errors: Record<string, string[]> = {};
  if (!email) {
    errors.email = ['El correo electrónico es obligatorio.'];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['El formato del correo electrónico no es válido.'];
  }

  if (!password) {
    errors.password = ['La contraseña es obligatoria.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Por favor corrija los campos marcados.',
      errors,
    };
  }

  try {
    const res = await serverFetch<AuthResponse | { access_token?: string; token?: string; user: unknown }>(
      '/auth/login',
      {
        method: 'POST',
        body: { email, password },
        cache: 'no-store',
      }
    );

    const token =
      ('token' in res && res.token) ||
      ('access_token' in res && res.access_token) ||
      '';

    if (!token) {
      return {
        success: false,
        message: 'Respuesta inválida del servidor: no se recibió token de autenticación.',
      };
    }

    // Generate ephemeral, single-use ticket in secure server-side vault (TTL: 30s)
    const ticket = createExchangeTicket(token, 'user' in res ? res.user : undefined);

    const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/catalogo';

    return {
      success: true,
      exchangeTicket: ticket,
      redirectTo: safeNext,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message || 'Credenciales incorrectas.',
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error inesperado al conectar con el servidor.',
    };
  }
}

/**
 * Server Action for User Registration
 */
export async function registerAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;
  const password_confirmation = formData.get('password_confirmation') as string;

  // Server-side validation
  const errors: Record<string, string[]> = {};
  if (!name) {
    errors.name = ['El nombre es obligatorio.'];
  } else if (name.length < 2) {
    errors.name = ['El nombre debe tener al menos 2 caracteres.'];
  }

  if (!email) {
    errors.email = ['El correo electrónico es obligatorio.'];
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ['El formato del correo electrónico no es válido.'];
  }

  if (!password) {
    errors.password = ['La contraseña es obligatoria.'];
  } else if (password.length < 8) {
    errors.password = ['La contraseña debe tener al menos 8 caracteres.'];
  }

  if (password !== password_confirmation) {
    errors.password_confirmation = ['Las contraseñas no coinciden.'];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Por favor corrija los campos indicados.',
      errors,
    };
  }

  try {
    const res = await serverFetch<AuthResponse | { access_token?: string; token?: string; user: unknown }>(
      '/auth/register',
      {
        method: 'POST',
        body: { name, email, password, password_confirmation },
        cache: 'no-store',
      }
    );

    const token =
      ('token' in res && res.token) ||
      ('access_token' in res && res.access_token) ||
      '';

    if (token) {
      // If backend auto-authenticates upon registration
      const ticket = createExchangeTicket(token, 'user' in res ? res.user : undefined);
      return {
        success: true,
        exchangeTicket: ticket,
        redirectTo: '/catalogo',
      };
    }

    return {
      success: true,
      message: 'Registro exitoso. Ya puedes iniciar sesión con tus credenciales.',
      redirectTo: '/login?registered=true',
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message || 'No fue posible completar el registro.',
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error al conectar con el servidor de autenticación.',
    };
  }
}
