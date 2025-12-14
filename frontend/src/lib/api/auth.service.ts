/**
 * Servicio de autenticación con Supabase
 */

import { post } from './client';
import { API_ENDPOINTS } from './config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  ciudad: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    nombre: string;
    apellidos: string;
    rol: string;
  };
  token: string;
}

/**
 * Iniciar sesión
 */
export async function login(credentials: LoginCredentials) {
  return await post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
}

/**
 * Registrar nuevo usuario
 */
export async function register(data: RegisterData) {
  return await post<AuthResponse>(API_ENDPOINTS.auth.register, data);
}

/**
 * Cerrar sesión
 */
export async function logout() {
  // Limpiar el token del almacenamiento local
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  // Llamar al endpoint de logout
  return await post(API_ENDPOINTS.auth.logout);
}

/**
 * Obtener token almacenado
 */
export function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

/**
 * Guardar token
 */
export function setStoredToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

/**
 * Obtener datos de usuario almacenados
 */
export function getStoredUser() {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
}

/**
 * Guardar datos de usuario
 */
export function setStoredUser(user: AuthResponse['user']) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user));
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

export const authService = {
  login,
  register,
  logout,
  getStoredToken,
  setStoredToken,
  getStoredUser,
  setStoredUser,
  isAuthenticated,
};
