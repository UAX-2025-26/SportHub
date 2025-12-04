/**
 * Servicio para gestión de instalaciones deportivas
 */

import { get, post, put, del } from './client';
import { API_ENDPOINTS } from './config';

export interface Facility {
  id: string;
  center_id: string;
  nombre: string;
  tipo: string;
  capacidad?: number;
  precio_hora?: number;
  activo?: boolean;
  created_at?: string;
}

export interface CreateFacilityData {
  nombre: string;
  tipo: string;
  capacidad?: number;
  precio_hora?: number;
  activo?: boolean;
}

export interface TimeSlot {
  hora_inicio: string;
  disponible: boolean;
}

/**
 * Obtiene todas las instalaciones
 */
export async function getFacilities() {
  return await get<Facility[]>(API_ENDPOINTS.facilities.list);
}

/**
 * Obtiene las instalaciones de un centro específico
 */
export async function getFacilitiesByCenter(centerId: string) {
  return await get<Facility[]>(API_ENDPOINTS.centers.facilities(centerId));
}

/**
 * Obtiene el detalle de una instalación
 */
export async function getFacilityById(id: string) {
  return await get<Facility>(API_ENDPOINTS.facilities.detail(id));
}

/**
 * Obtiene la disponibilidad de una instalación para una fecha
 */
export async function getFacilityAvailability(id: string, fecha: string) {
  return await get<TimeSlot[]>(
    `${API_ENDPOINTS.facilities.availability(id)}?fecha=${fecha}`
  );
}

/**
 * Crea una nueva instalación en un centro (requiere rol admin o center_admin)
 */
export async function createFacility(
  centerId: string,
  data: CreateFacilityData,
  token: string
) {
  return await post<Facility>(
    API_ENDPOINTS.facilities.create(centerId),
    data,
    { token }
  );
}

/**
 * Actualiza una instalación (requiere rol admin o center_admin)
 */
export async function updateFacility(
  id: string,
  data: Partial<CreateFacilityData>,
  token: string
) {
  return await put<Facility>(
    API_ENDPOINTS.facilities.update(id),
    data,
    { token }
  );
}

/**
 * Elimina una instalación (requiere rol admin o center_admin)
 */
export async function deleteFacility(id: string, token: string) {
  return await del<{ ok: boolean }>(
    API_ENDPOINTS.facilities.delete(id),
    { token }
  );
}

export const facilitiesService = {
  getFacilities,
  getFacilitiesByCenter,
  getFacilityById,
  getFacilityAvailability,
  createFacility,
  updateFacility,
  deleteFacility,
};

