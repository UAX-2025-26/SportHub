/**
 * Servicio para gestión de reservas
 */

import { get, post, del } from './client';
import { API_ENDPOINTS } from './config';

export interface Booking {
  id: string;
  user_id: string;
  facility_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin?: string;
  estado: 'PENDIENTE_PAGO' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA';
  precio_total?: number;
  price_paid?: number;
  payment_id?: string;
  cancelled_at?: string;
  created_at?: string;
}

export interface CreateBookingData {
  facility_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

/**
 * Obtiene las reservas del usuario actual
 */
export async function getMyBookings(token: string) {
  return await get<Booking[]>(API_ENDPOINTS.bookings.list, { token });
}

/**
 * Crea una nueva reserva (requiere autenticación)
 */
export async function createBooking(data: CreateBookingData, token: string) {
  return await post<Booking>(API_ENDPOINTS.bookings.create, data, { token });
}

/**
 * Cancela una reserva (requiere autenticación)
 */
export async function cancelBooking(id: string, token: string) {
  return await del<{ ok: boolean }>(API_ENDPOINTS.bookings.cancel(id), { token });
}

export const bookingsService = {
  getMyBookings,
  createBooking,
  cancelBooking,
};

