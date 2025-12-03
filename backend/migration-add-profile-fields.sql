-- ============================================
-- MIGRACIÓN: Agregar campos faltantes a profiles
-- ============================================
-- Ejecuta esto si ya tienes la tabla profiles creada
-- En Supabase: Dashboard → SQL Editor → New Query → Pega y ejecuta

-- Agregar columnas si no existen
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS apellidos TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ciudad TEXT;

-- Actualizar función de auto-creación de perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre, apellidos, telefono, ciudad, rol, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
    COALESCE(NEW.raw_user_meta_data->>'telefono', ''),
    COALESCE(NEW.raw_user_meta_data->>'ciudad', ''),
    COALESCE(NEW.raw_user_meta_data->>'rol', 'player'),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    nombre = EXCLUDED.nombre,
    apellidos = EXCLUDED.apellidos,
    telefono = EXCLUDED.telefono,
    ciudad = EXCLUDED.ciudad;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- COMPLETADO
-- ============================================
-- Ahora la tabla profiles tiene todos los campos necesarios
-- y los perfiles se crearán automáticamente al registrar usuarios

