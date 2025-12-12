/**
 * Configuración de la API
 */

// URL base del backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Root
  root: '/',
  health: '/health',

  // Autenticación
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
  },

  // Usuarios
  users: {
    me: '/api/usuarios/me',
    updateMe: '/api/usuarios/me',
  },

  // Centros
  centers: {
    list: '/api/centros',
    detail: (id: string) => `/api/centros/${id}`,
    create: '/api/centros',
    update: (id: string) => `/api/centros/${id}`,
    delete: (id: string) => `/api/centros/${id}`,
    facilities: (id: string) => `/api/centros/${id}/instalaciones`,
    createFacility: (id: string) => `/api/centros/${id}/instalaciones`,
  },

  // Instalaciones
  facilities: {
    list: '/api/instalaciones',
    detail: (id: string) => `/api/instalaciones/${id}`,
    availability: (id: string) => `/api/instalaciones/${id}/disponibilidad`,
    create: (centerId: string) => `/api/instalaciones/centros/${centerId}`,
    update: (id: string) => `/api/instalaciones/${id}`,
    delete: (id: string) => `/api/instalaciones/${id}`,
    byCenter: (centerId: string) => `/api/centros/${centerId}/instalaciones`,
  },

  // Reservas
  bookings: {
    list: '/api/reservas',
    create: '/api/reservas',
    cancel: (id: string) => `/api/reservas/${id}`,
    availability: (facilityId: string) => `/api/instalaciones/${facilityId}/disponibilidad`,
  },

  // Admin
  admin: {
    // Center admin routes
    myCenter: '/api/admin/mi-centro',
    centerSummary: '/api/admin/centro/resumen',
    centerBookings: '/api/admin/centro/reservas',

    // Global admin routes
    adminStats: '/api/admin/estadisticas',
    createPromotion: '/api/admin/promociones',
    listCenters: '/api/admin/centros',
    getUserById: (id: string) => `/api/admin/usuarios/${id}`,
    updateUserById: (id: string) => `/api/admin/usuarios/${id}`,
  },

  // Admin Centro (rutas alternativas)
  adminCenter: {
    summary: '/api/admin-centro/resumen',
    bookings: '/api/admin-centro/reservas',
  },
} as const;

/**
 * Construye la URL completa del endpoint
 */
export function buildApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
