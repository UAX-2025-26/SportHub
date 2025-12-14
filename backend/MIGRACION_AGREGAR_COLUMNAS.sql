-- Migración: Agregar columnas hora_fin y precio_total a la tabla bookings
-- Esta migración agrega las columnas necesarias para el sistema de cálculo de precio

-- Agregar columna hora_fin
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS hora_fin TIME;

-- Agregar columna precio_total
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS precio_total DECIMAL(10, 2);

-- Actualizar el índice único si es necesario (remover restricción si existe)
-- Nota: Si tienes una restricción UNIQUE en (facility_id, fecha, hora_inicio),
-- necesitarás actualizarla para incluir hora_fin también

-- Crear índice para mejorar búsquedas por centro
CREATE INDEX IF NOT EXISTS idx_bookings_facility_fecha
ON bookings(facility_id, fecha);

-- Crear índice para búsquedas por usuario
CREATE INDEX IF NOT EXISTS idx_bookings_user_fecha
ON bookings(user_id, fecha DESC);

