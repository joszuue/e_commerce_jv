import 'server-only';
import { cookies } from 'next/headers';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/api/v1';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;
  data?: unknown;

  constructor(message: string, status: number, errors?: Record<string, string[]>, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.data = data;
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
  timeoutMs?: number;
}

/**
 * Centralized server-only fetch client for Laravel API
 */
export async function serverFetch<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    body,
    params,
    requiresAuth = false,
    timeoutMs = 8000,
    headers: customHeaders = {},
    ...fetchOptions
  } = options;

  // Build secure URL
  const cleanBase = BASE_URL.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const url = new URL(`${cleanBase}/${cleanEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, String(val));
      }
    });
  }

  const headers = new Headers(customHeaders as HeadersInit);
  headers.set('Accept', 'application/json');

  if (body && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Inject Sanctum Bearer token if requested or available
  if (requiresAuth || requiresAuth === undefined) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (requiresAuth) {
      throw new ApiError('Sesión no encontrada o expirada', 401);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parse response
    const text = await response.text();
    let data: unknown = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!response.ok) {
      const errObj = (typeof data === 'object' && data !== null) ? (data as Record<string, unknown>) : {};
      const errorMessage = (errObj.message as string) || `Error ${response.status} en el servidor`;
      const validationErrors = (errObj.errors as Record<string, string[]>) || undefined;

      switch (response.status) {
        case 401:
          throw new ApiError(errorMessage || 'No autorizado. Por favor inicia sesión.', 401, validationErrors, data);
        case 403:
          throw new ApiError(errorMessage || 'Acceso denegado.', 403, validationErrors, data);
        case 404:
          throw new ApiError(errorMessage || 'Recurso no encontrado.', 404, validationErrors, data);
        case 422:
          throw new ApiError(errorMessage || 'Error de validación en los datos enviados.', 422, validationErrors, data);
        case 500:
        default:
          throw new ApiError(errorMessage || 'Error interno del servidor API.', response.status, validationErrors, data);
      }
    }

    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('Tiempo de espera agotado al conectar con el servidor (Timeout).', 504);
    }

    // Connection failure (e.g. backend server not running)
    const originalMessage = error instanceof Error ? error.message : 'Fallo de red desconocido';
    throw new ApiError(
      `No se pudo establecer conexión con el backend (${cleanBase}). Verifique que la API Laravel esté en ejecución. Detalle: ${originalMessage}`,
      503
    );
  }
}
