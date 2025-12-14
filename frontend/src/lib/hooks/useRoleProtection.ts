/**
 * Hook para protección de rutas basado en roles de usuario
 */
"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getRedirectPathByRole } from '@/lib/utils/roleRedirect';

/**
 * Hook para proteger una ruta y redirigir según el rol del usuario
 * @param allowedRoles - Lista de roles permitidos para acceder a la ruta (opcional)
 * @returns Estado de carga de la autenticación
 */
export function useRoleProtection(allowedRoles?: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Esperar a que termine de cargar el estado de autenticación
    if (isLoading) return;

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      console.log('[ROLE PROTECTION] Usuario no autenticado, redirigiendo a login');
      router.push('/login');
      return;
    }

    // Si no hay roles específicos, solo verificamos autenticación
    if (!allowedRoles || allowedRoles.length === 0) {
      return;
    }

    // Verificar si el usuario tiene un rol permitido
    const userRole = user?.rol;
    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('[ROLE PROTECTION] Usuario sin permiso para esta ruta');
      console.log('[ROLE PROTECTION] Rol del usuario:', userRole);
      console.log('[ROLE PROTECTION] Roles permitidos:', allowedRoles);

      // Redirigir a la página correspondiente según su rol
      const redirectPath = getRedirectPathByRole(userRole);
      console.log('[ROLE PROTECTION] Redirigiendo a:', redirectPath);
      router.push(redirectPath);
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

  return { isLoading, isAuthenticated, user };
}

/**
 * Hook para verificar si el usuario actual tiene un rol específico
 * @param role - El rol a verificar
 * @returns true si el usuario tiene el rol especificado
 */
export function useHasRole(role: string): boolean {
  const { user } = useAuth();
  return user?.rol === role;
}

/**
 * Hook para verificar si el usuario actual tiene alguno de los roles especificados
 * @param roles - Lista de roles a verificar
 * @returns true si el usuario tiene alguno de los roles especificados
 */
export function useHasAnyRole(roles: string[]): boolean {
  const { user } = useAuth();
  return roles.includes(user?.rol || '');
}
