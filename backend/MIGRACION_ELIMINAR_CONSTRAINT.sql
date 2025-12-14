-- Script de migración: Eliminar constraint de estados en la tabla bookings
-- Este script elimina el constraint CHECK que validaba los estados
-- Ejecutar en la consola SQL de Supabase si la tabla ya existe

-- Eliminar el constraint si existe
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_estado_check;

-- Verificar que el constraint fue eliminado
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'bookings' AND constraint_name = 'bookings_estado_check';

