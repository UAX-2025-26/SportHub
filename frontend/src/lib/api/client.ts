/**
 * Cliente HTTP para hacer peticiones a la API
 */

import { buildApiUrl } from './config';

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface RequestOptions extends RequestInit {
  token?: string;
}

/**
 * Realiza una petición HTTP genérica
 */
async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { token, headers, ...restOptions } = options;

  const url = buildApiUrl(endpoint);

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Añadir headers adicionales
  if (headers) {
    Object.assign(defaultHeaders, headers);
  }

  // Añadir token de autenticación si existe
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: defaultHeaders,
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return {
        error: data?.error || data?.message || 'Error en la petición',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('Error en la petición:', error);
    return {
      error: error instanceof Error ? error.message : 'Error de red',
      status: 0,
    };
  }
}

/**
 * GET request
 */
export function get<T = unknown>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'GET',
    ...options,
  });
}

/**
 * POST request
 */
export function post<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * PUT request
 */
export function put<T = unknown>(
  endpoint: string,
  body?: unknown,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  });
}

/**
 * DELETE request
 */
export function del<T = unknown>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: 'DELETE',
    ...options,
  });
}

const apiClient = {
  get,
  post,
  put,
  delete: del,
};

export default apiClient;

