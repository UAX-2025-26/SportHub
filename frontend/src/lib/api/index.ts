/**
 * Punto de entrada para todos los servicios de API
 */

export * from './config';
export * from './client';
export * from './auth.service';
export * from './users.service';
export * from './centers.service';
export * from './facilities.service';
export * from './bookings.service';
export * from './admin.service';

// Re-exportar servicios como objetos
export { authService } from './auth.service';
export { usersService } from './users.service';
export { centersService } from './centers.service';
export { facilitiesService } from './facilities.service';
export { bookingsService } from './bookings.service';
export { adminService } from './admin.service';

