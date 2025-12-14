-- Script de migración: Actualizar estados existentes de inglés a español
-- Ejecutar después de agregar las columnas hora_fin y precio_total

-- Cambiar estados de inglés a español
UPDATE bookings SET estado = 'PENDIENTE_PAGO' WHERE estado = 'PENDING_PAYMENT';
UPDATE bookings SET estado = 'CONFIRMADA' WHERE estado = 'CONFIRMED';
UPDATE bookings SET estado = 'CANCELADA' WHERE estado = 'CANCELLED';
UPDATE bookings SET estado = 'COMPLETADA' WHERE estado = 'COMPLETED';

-- Verificar que la migración funcionó correctamente
SELECT DISTINCT estado FROM bookings;

