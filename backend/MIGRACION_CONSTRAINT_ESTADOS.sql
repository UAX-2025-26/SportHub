-- Script de migración: Actualizar constraint de estados en la tabla bookings
-- Este script actualiza el constraint CHECK para aceptar valores en español
-- Ejecutar en la consola SQL de Supabase

-- Paso 1: Eliminar el constraint antiguo
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_estado_check;

-- Paso 2: Agregar el nuevo constraint con valores en español
ALTER TABLE bookings ADD CONSTRAINT bookings_estado_check CHECK (estado IN ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'));

-- Paso 3: Verificar que el constraint fue creado correctamente
-- Esta consulta debe ejecutarse sin errores
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'bookings' AND constraint_name = 'bookings_estado_check';

