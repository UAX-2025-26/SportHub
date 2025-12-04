-- ========================================
-- Script para Convertir Usuario a Admin
-- ========================================

-- PASO 1: Ver todos los usuarios y sus roles actuales
SELECT id, email, nombre, rol, created_at
FROM profiles
ORDER BY created_at DESC;

-- PASO 2: Identificar tu email y convertirlo a admin
-- IMPORTANTE: Reemplaza 'tu-email@ejemplo.com' con tu email real

-- Opción A: Si conoces tu email exacto
UPDATE profiles
SET rol = 'admin'
WHERE email = 'tu-email@ejemplo.com';

-- Opción B: Si no estás seguro del email, busca por nombre
UPDATE profiles
SET rol = 'admin'
WHERE nombre LIKE '%tu-nombre%';

-- Opción C: Si acabas de registrarte (convertir el usuario más reciente)
UPDATE profiles
SET rol = 'admin'
WHERE id = (
  SELECT id
  FROM profiles
  ORDER BY created_at DESC
  LIMIT 1
);

-- PASO 3: Verificar que el cambio se aplicó correctamente
SELECT email, rol
FROM profiles
WHERE email = 'tu-email@ejemplo.com';
-- Debería mostrar: rol = 'admin'

-- PASO 4 (Opcional): Ver todos los admins actuales
SELECT id, email, nombre, rol
FROM profiles
WHERE rol = 'admin';

-- ========================================
-- Solución de Problemas Comunes
-- ========================================

-- Problema: El perfil no existe (no aparece en la tabla)
-- Solución: Verificar en la tabla auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'tu-email@ejemplo.com';
-- Si aparece aquí pero no en profiles, el perfil no se creó

-- Crear perfil manualmente si falta:
INSERT INTO profiles (id, email, nombre, apellidos, rol, created_at)
SELECT
  id,
  email,
  SPLIT_PART(email, '@', 1), -- Usa parte del email como nombre
  'Usuario',
  'admin',
  created_at
FROM auth.users
WHERE email = 'tu-email@ejemplo.com'
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE email = 'tu-email@ejemplo.com'
);

-- ========================================
-- Verificación Final
-- ========================================

-- Esto debería mostrar tu usuario con rol = 'admin'
SELECT
  id,
  email,
  nombre,
  apellidos,
  rol,
  created_at,
  CASE
    WHEN rol = 'admin' THEN '✅ ADMIN CORRECTO'
    ELSE '❌ NO ES ADMIN - EJECUTA UPDATE'
  END as estado
FROM profiles
WHERE email = 'tu-email@ejemplo.com';

-- ========================================
-- Comandos Útiles
-- ========================================

-- Ver estructura de la tabla profiles
\d profiles;

-- Ver todos los roles disponibles
SELECT DISTINCT rol FROM profiles WHERE rol IS NOT NULL;

-- Contar cuántos admins hay
SELECT COUNT(*) as total_admins
FROM profiles
WHERE rol = 'admin';

-- Ver últimos 10 usuarios registrados
SELECT email, nombre, rol, created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;

-- Cambiar múltiples usuarios a admin (útil para testing)
UPDATE profiles
SET rol = 'admin'
WHERE email IN (
  'admin@ejemplo.com',
  'test@ejemplo.com',
  'tu-email@ejemplo.com'
);

-- ========================================
-- DESPUÉS DE EJECUTAR ESTE SCRIPT
-- ========================================

/*
1. Verifica que tu email aparece con rol = 'admin'
2. En tu navegador, abre la consola (F12)
3. Ejecuta: localStorage.clear();
4. Cierra sesión en la app
5. Inicia sesión nuevamente
6. Intenta acceder a /admin/centers
7. ¡Debería funcionar! ✅
*/

