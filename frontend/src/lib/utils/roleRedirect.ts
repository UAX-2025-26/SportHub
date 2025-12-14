/**
 * Utilidad para manejar redirecciones basadas en el rol del usuario
 */

export type UserRole = 'user' | 'center_admin' | 'admin';

/**
 * Obtiene la ruta de redirección según el rol del usuario
 * @param role - El rol del usuario
 * @returns La ruta a la que debe ser redirigido
 */
export function getRedirectPathByRole(role: string | null | undefined): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'center_admin':
      return '/admin-center';
    case 'user':
      return '/home';
    default:
      // Por defecto, redirigir a home para usuarios sin rol definido
      return '/home';
  }
}

/**
 * Verifica si un usuario tiene acceso a una ruta específica según su rol
 * @param userRole - El rol del usuario
 * @param path - La ruta a verificar
 * @returns true si el usuario tiene acceso, false en caso contrario
 */
export function hasAccessToPath(userRole: string | null | undefined, path: string): boolean {
  if (!userRole) return false;

  // Rutas públicas
  const publicPaths = ['/login', '/register', '/'];
  if (publicPaths.includes(path)) return true;

  // Rutas por rol
  switch (userRole) {
    case 'admin':
      // Admin tiene acceso a todo
      return true;
    case 'center_admin':
      // center_admin tiene acceso a su panel y a las rutas de usuario
      return path.startsWith('/admin-center') || path.startsWith('/home') || path.startsWith('/perfil') || path.startsWith('/reservas');
    case 'user':
      // User solo tiene acceso a las rutas de cliente
      return path.startsWith('/home') || path.startsWith('/perfil') || path.startsWith('/reservas') || path.startsWith('/booking') || path.startsWith('/schedule');
    default:
      return false;
  }
}

/**
 * Obtiene el nombre amigable del rol
 * @param role - El rol del usuario
 * @returns El nombre amigable del rol
 */
export function getRoleFriendlyName(role: string | null | undefined): string {
  switch (role) {
    case 'admin':
      return 'Administrador Global';
    case 'center_admin':
      return 'Administrador de Centro';
    case 'user':
      return 'Cliente';
    default:
      return 'Usuario';
  }
}

