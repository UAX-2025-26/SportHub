/**
 * Servicio para funciones administrativas
 */

import { get, post, put } from './client';
import { API_ENDPOINTS } from './config';
import { Center } from './centers.service';

/**
 * Obtiene datos del centro actual (para center_admin)
 */
export async function getMyCenterData(token: string) {
  return await get<any>(API_ENDPOINTS.admin.myCenter, { token });
}

/**
 * Obtiene estadísticas generales (requiere rol admin)
 */
export async function getAdminStats(token: string) {
  return await get<any>(API_ENDPOINTS.admin.adminStats, { token });
}

/**
 * Obtiene lista de centros (requiere rol admin)
 */
export async function listCenters(token: string) {
  return await get<Center[]>(API_ENDPOINTS.admin.listCenters, { token });
}

/**
 * Obtiene un usuario por ID (requiere rol admin)
 */
export async function getUserById(id: string, token: string) {
  return await get<any>(API_ENDPOINTS.admin.getUserById(id), { token });
}

/**
 * Actualiza un usuario por ID (requiere rol admin)
 */
export async function updateUserById(id: string, data: any, token: string) {
  return await put<any>(API_ENDPOINTS.admin.updateUserById(id), data, { token });
}

export const adminService = {
  getMyCenterData,
  getAdminStats,
  listCenters,
  getUserById,
  updateUserById,
};

