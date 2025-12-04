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
      const storedToken = authService.getStoredToken();
      const storedUser = authService.getStoredUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }

      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await authService.login({ email, password });

      if (error) {
        return { success: false, error };
      }

      if (data) {
        setToken(data.token);
        setUser(data.user);
        authService.setStoredToken(data.token);
        authService.setStoredUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Error desconocido' };
    } catch (error) {
      console.error('Error en login:', error);
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

