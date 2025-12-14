/**
 * Servicio para gestión de centros deportivos
 */

import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './config';

export interface Center {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  email?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  descripcion?: string;
  created_at?: string;
}

export interface CreateCenterData {
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  email?: string;
  horario_apertura?: string;
  horario_cierre?: string;
  descripcion?: string;
}

export type UpdateCenterData = Partial<CreateCenterData>;

/**
 * Obtiene la lista de centros
 */
export async function getCenters() {
  return await get<Center[]>(API_ENDPOINTS.centers.list);
}

/**
 * Obtiene el detalle de un centro
 */
export async function getCenterById(id: string) {
  return await get<Center>(API_ENDPOINTS.centers.detail(id));
}

/**
 * Crea un nuevo centro (requiere rol admin)
 */
export async function createCenter(data: CreateCenterData, token: string) {
  return await post<Center>(API_ENDPOINTS.centers.create, data, { token });
}

/**
 * Actualiza un centro (requiere rol admin o center_admin)
 */
export async function updateCenter(id: string, data: UpdateCenterData, token: string) {
  return await put<Center>(API_ENDPOINTS.centers.update(id), data, { token });
}

/**
 * Elimina un centro (requiere rol admin)
 */
export async function deleteCenter(id: string, token: string) {
  return await del<{ ok: boolean }>(API_ENDPOINTS.centers.delete(id), { token });
}

export const centersService = {
  getCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
};
