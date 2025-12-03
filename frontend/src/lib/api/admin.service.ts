/**
 * Servicio para funciones de administración
 */

import { get, post, put } from './client';
import { API_ENDPOINTS } from './config';
import type { User } from './users.service';
import type { Center } from './centers.service';
import type { Booking } from './bookings.service';

export interface CenterSummary {
  total_reservas: number;
  reservas_pendientes: number;
  reservas_confirmadas: number;
  ingresos_totales: number;
  ingresos_mes_actual: number;
}

export interface AdminStats {
  total_usuarios: number;
  total_centros: number;
  total_instalaciones: number;
  total_reservas: number;
  ingresos_totales: number;
  usuarios_activos_mes: number;
}

export interface Promotion {
  id: string;
  titulo: string;
  descripcion: string;
  descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
}

export interface CreatePromotionData {
  titulo: string;
  descripcion: string;
  descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
}

// ===== Center Admin Routes =====

/**
 * Obtiene el resumen del centro (center_admin o admin)
 */
export async function getCenterSummary(token: string) {
  return await get<CenterSummary>(API_ENDPOINTS.admin.centerSummary, { token });
}

/**
 * Obtiene las reservas del centro (center_admin o admin)
 */
export async function getCenterBookings(token: string) {
  return await get<Booking[]>(API_ENDPOINTS.admin.centerBookings, { token });
}

// ===== Global Admin Routes =====

/**
 * Obtiene estadísticas globales (admin)
 */
export async function getAdminStats(token: string) {
  return await get<AdminStats>(API_ENDPOINTS.admin.adminStats, { token });
}

/**
 * Crea una nueva promoción (admin)
 */
export async function createPromotion(data: CreatePromotionData, token: string) {
  return await post<Promotion>(API_ENDPOINTS.admin.createPromotion, data, { token });
}

/**
 * Lista todos los centros (admin)
 */
export async function listAllCenters(token: string) {
  return await get<Center[]>(API_ENDPOINTS.admin.listCenters, { token });
}

/**
 * Obtiene un usuario por ID (admin)
 */
export async function getUserById(id: string, token: string) {
  return await get<User>(API_ENDPOINTS.admin.getUserById(id), { token });
}

/**
 * Actualiza un usuario por ID (admin)
 */
export async function updateUserById(
  id: string,
  data: Partial<User>,
  token: string
) {
  return await put<User>(API_ENDPOINTS.admin.updateUserById(id), data, { token });
}

// ===== Admin Centro (rutas alternativas) =====

/**
 * Obtiene el resumen del centro - ruta alternativa (center_admin o admin)
 */
export async function getCenterSummaryAlt(token: string) {
  return await get<CenterSummary>(API_ENDPOINTS.adminCenter.summary, { token });
}

/**
 * Obtiene las reservas del centro - ruta alternativa (center_admin o admin)
 */
export async function getCenterBookingsAlt(token: string) {
  return await get<Booking[]>(API_ENDPOINTS.adminCenter.bookings, { token });
}

export const adminService = {
  // Center admin
  getCenterSummary,
  getCenterBookings,
  getCenterSummaryAlt,
  getCenterBookingsAlt,

  // Global admin
  getAdminStats,
  createPromotion,
  listAllCenters,
  getUserById,
  updateUserById,
};

