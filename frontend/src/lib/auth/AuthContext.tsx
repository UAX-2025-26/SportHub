"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, RegisterData } from '@/lib/api';

interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  rol: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userRole: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el usuario desde localStorage al inicio
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        console.log('[AUTH CONTEXT] Cargando usuario desde localStorage...');
        const storedToken = authService.getStoredToken();
        const storedUser = authService.getStoredUser();

        console.log('[AUTH CONTEXT] Token en storage:', storedToken ? 'Present' : 'Missing');
        console.log('[AUTH CONTEXT] User en storage:', storedUser ? 'Present' : 'Missing');

        if (storedToken && storedUser) {
          console.log('[AUTH CONTEXT] Usuario restaurado:', storedUser.email);
          setToken(storedToken);
          setUser(storedUser);
        } else {
          console.log('[AUTH CONTEXT] No hay sesión guardada');
        }
      } catch (error) {
        console.error('[AUTH CONTEXT] Error cargando usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[AUTH CONTEXT] Iniciando login para:', email);
      const { data, error } = await authService.login({ email, password });

      console.log('[AUTH CONTEXT] Respuesta de login:', { hasData: !!data, hasError: !!error });

      if (error) {
        console.error('[AUTH CONTEXT] Error de login:', error);
        return { success: false, error };
      }

      if (data) {
        console.log('[AUTH CONTEXT] Login exitoso, guardando datos...');
        console.log('[AUTH CONTEXT] Token recibido:', data.token.substring(0, 20) + '...');
        console.log('[AUTH CONTEXT] Usuario:', data.user);

        setToken(data.token);
        setUser(data.user);
        authService.setStoredToken(data.token);
        authService.setStoredUser(data.user);

        console.log('[AUTH CONTEXT] Datos guardados en localStorage');
        return { success: true };
      }

      console.error('[AUTH CONTEXT] No hay datos en la respuesta');
      return { success: false, error: 'Error desconocido' };
    } catch (error) {
      console.error('[AUTH CONTEXT] Error inesperado en login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { data: responseData, error } = await authService.register(data);

      if (error) {
        return { success: false, error };
      }

      if (responseData) {
        setToken(responseData.token);
        setUser(responseData.user);
        authService.setStoredToken(responseData.token);
        authService.setStoredUser(responseData.user);
        return { success: true };
      }

      return { success: false, error: 'Error desconocido' };
    } catch (error) {
      console.error('Error en register:', error);
      return { success: false, error: 'Error al registrarse' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        userRole: user?.rol || null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

