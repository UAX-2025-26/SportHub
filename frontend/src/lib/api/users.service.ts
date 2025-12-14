/**
 * Servicio para gestión de usuarios
 */

import { get, put } from './client';
import { API_ENDPOINTS } from './config';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
  rol: string;
  created_at?: string;
}

export interface UpdateUserData {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  ciudad?: string;
}

/**
 * Obtiene el perfil del usuario actual
 */
export async function getCurrentUser(token: string) {
  return await get<User>(API_ENDPOINTS.users.me, { token });
}

/**
 * Actualiza el perfil del usuario actual
 */
export async function updateCurrentUser(data: UpdateUserData, token: string) {
  return await put<User>(API_ENDPOINTS.users.updateMe, data, { token });
}

export const usersService = {
  getCurrentUser,
  updateCurrentUser,
};
