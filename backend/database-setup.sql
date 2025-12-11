-- ============================================
-- SPORTHUB - SCHEMA COMPLETO PARA SUPABASE
-- ============================================
-- Ejecuta este script en: Supabase Dashboard → SQL Editor → New Query
-- Esto creará las tablas y datos iniciales

-- ============================================
-- 1. TABLA PROFILES
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    nombre TEXT,
    apellidos TEXT,
    telefono TEXT,
    ciudad TEXT,
    rol TEXT CHECK (rol IN ('player', 'center_admin', 'coach', 'referee', 'admin')) DEFAULT 'player',
    center_id UUID,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_rol ON profiles(rol);
CREATE INDEX IF NOT EXISTS idx_profiles_center_id ON profiles(center_id);

-- ============================================
-- 2. TABLA CENTERS
-- ============================================
CREATE TABLE IF NOT EXISTS centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    direccion TEXT,
    ciudad TEXT,
    admin_user_id UUID REFERENCES profiles(id),
    horario_apertura TIME DEFAULT '08:00',
    horario_cierre TIME DEFAULT '22:00',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para centers
CREATE INDEX IF NOT EXISTS idx_centers_ciudad ON centers(ciudad);

-- Añadir foreign key de profiles a centers (se crea después)
ALTER TABLE profiles
ADD CONSTRAINT fk_profiles_center
FOREIGN KEY (center_id) REFERENCES centers(id) ON DELETE SET NULL;

-- ============================================
-- 3. TABLA FACILITIES
-- ============================================
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id UUID REFERENCES centers(id) ON DELETE CASCADE NOT NULL,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    capacidad INTEGER DEFAULT 10,
    precio_hora DECIMAL(8,2) DEFAULT 20.00,
    facilitator_id UUID REFERENCES profiles(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para facilities
CREATE INDEX IF NOT EXISTS idx_facilities_center_id ON facilities(center_id);
CREATE INDEX IF NOT EXISTS idx_facilities_tipo ON facilities(tipo);
CREATE INDEX IF NOT EXISTS idx_facilities_activo ON facilities(activo);

-- ============================================
-- 4. TABLA BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    estado TEXT DEFAULT 'CONFIRMED' CHECK (estado IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    price_paid DECIMAL(8,2),
    payment_id UUID,
    CONSTRAINT unique_booking UNIQUE(facility_id, fecha, hora_inicio)
);

-- Índices para bookings
CREATE INDEX IF NOT EXISTS idx_bookings_facility_id ON bookings(facility_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_fecha ON bookings(fecha);
CREATE INDEX IF NOT EXISTS idx_bookings_estado ON bookings(estado);

-- ============================================
-- 5. TABLA PROMOTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS promotions (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    tipo_descuento TEXT CHECK (tipo_descuento IN ('PERCENTAGE', 'FIXED')) DEFAULT 'PERCENTAGE',
    valor_descuento DECIMAL(5,2) NOT NULL,
    center_id UUID REFERENCES centers(id),
    fecha_inicio DATE,
    fecha_fin DATE,
    uso_maximo INTEGER DEFAULT 100,
    usos_realizados INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para promotions
CREATE INDEX IF NOT EXISTS idx_promotions_codigo ON promotions(codigo);
CREATE INDEX IF NOT EXISTS idx_promotions_center_id ON promotions(center_id);
CREATE INDEX IF NOT EXISTS idx_promotions_activo ON promotions(activo);

-- ============================================
-- 6. POLÍTICAS RLS (ROW LEVEL SECURITY)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- PROFILES: Los usuarios pueden ver y actualizar su propio perfil
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Service role has full access to profiles"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- CENTERS: Todos pueden ver centros (lectura pública)
CREATE POLICY "Anyone can view centers"
ON centers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage centers"
ON centers FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.rol = 'admin'
  )
);

CREATE POLICY "Service role has full access to centers"
ON centers FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- FACILITIES: Todos pueden ver instalaciones activas
CREATE POLICY "Anyone can view active facilities"
ON facilities FOR SELECT
TO authenticated
USING (activo = true);

CREATE POLICY "Center admins can manage their facilities"
ON facilities FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (
      profiles.rol = 'admin'
      OR (profiles.rol = 'center_admin' AND profiles.center_id = facilities.center_id)
    )
  )
);

CREATE POLICY "Service role has full access to facilities"
ON facilities FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- BOOKINGS: Los usuarios pueden ver sus propias reservas
CREATE POLICY "Users can view own bookings"
ON bookings FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings for themselves"
ON bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
ON bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Center admins can view their center bookings"
ON bookings FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles p
    JOIN facilities f ON f.center_id = p.center_id
    WHERE p.id = auth.uid()
    AND p.rol = 'center_admin'
    AND f.id = bookings.facility_id
  )
);

CREATE POLICY "Service role has full access to bookings"
ON bookings FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- PROMOTIONS: Todos pueden ver promociones activas
CREATE POLICY "Anyone can view active promotions"
ON promotions FOR SELECT
TO authenticated
USING (activo = true);

CREATE POLICY "Admins can manage promotions"
ON promotions FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.rol = 'admin'
  )
);

CREATE POLICY "Service role has full access to promotions"
ON promotions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- 7. DATOS INICIALES (SEED DATA)
-- ============================================

-- Insertar centros de ejemplo
INSERT INTO centers (id, nombre, direccion, ciudad, horario_apertura, horario_cierre) VALUES
('a1111111-1111-1111-1111-111111111111', 'SportHub Madrid Centro', 'Calle Gran Vía 28', 'Madrid', '07:00', '23:00'),
('b2222222-2222-2222-2222-222222222222', 'SportHub Barcelona Nord', 'Avinguda Diagonal 500', 'Barcelona', '08:00', '22:00'),
('c3333333-3333-3333-3333-333333333333', 'SportHub Valencia Port', 'Calle Colón 15', 'Valencia', '08:00', '21:00')
ON CONFLICT (id) DO NOTHING;

-- Insertar instalaciones de ejemplo
INSERT INTO facilities (id, center_id, nombre, tipo, capacidad, precio_hora, activo) VALUES
-- Madrid
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Pista de Tenis 1', 'Cancha de Tenis', 4, 25.00, true),
('f1111111-1111-1111-1111-111111111112', 'a1111111-1111-1111-1111-111111111111', 'Pista de Tenis 2', 'Cancha de Tenis', 4, 25.00, true),
('f1111111-1111-1111-1111-111111111113', 'a1111111-1111-1111-1111-111111111111', 'Campo de Fútbol 7', 'Campo de Fútbol', 14, 60.00, true),
('f1111111-1111-1111-1111-111111111114', 'a1111111-1111-1111-1111-111111111111', 'Gimnasio Principal', 'Gimnasio', 30, 15.00, true),
-- Barcelona
('f2222222-2222-2222-2222-222222222221', 'b2222222-2222-2222-2222-222222222222', 'Pista de Pádel 1', 'Cancha de Pádel', 4, 30.00, true),
('f2222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 'Pista de Pádel 2', 'Cancha de Pádel', 4, 30.00, true),
('f2222222-2222-2222-2222-222222222223', 'b2222222-2222-2222-2222-222222222222', 'Campo de Fútbol 11', 'Campo de Fútbol', 22, 80.00, true),
('f2222222-2222-2222-2222-222222222224', 'b2222222-2222-2222-2222-222222222222', 'Piscina Olímpica', 'Piscina', 50, 20.00, true),
-- Valencia
('f3333333-3333-3333-3333-333333333331', 'c3333333-3333-3333-3333-333333333333', 'Pista de Baloncesto', 'Cancha de Baloncesto', 10, 35.00, true),
('f3333333-3333-3333-3333-333333333332', 'c3333333-3333-3333-3333-333333333333', 'Pista de Voleibol', 'Cancha de Voleibol', 12, 28.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insertar promociones de ejemplo
INSERT INTO promotions (codigo, descripcion, tipo_descuento, valor_descuento, center_id, fecha_inicio, fecha_fin, uso_maximo, activo) VALUES
('WELCOME2024', 'Descuento de bienvenida 20%', 'PERCENTAGE', 20.00, NULL, '2024-01-01', '2024-12-31', 1000, true),
('MADRID10', 'Descuento Madrid 10%', 'PERCENTAGE', 10.00, 'a1111111-1111-1111-1111-111111111111', '2024-01-01', '2024-12-31', 500, true),
('BCN15', 'Descuento Barcelona 15%', 'PERCENTAGE', 15.00, 'b2222222-2222-2222-2222-222222222222', '2024-01-01', '2024-12-31', 500, true)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- 8. FUNCIÓN PARA AUTO-CREAR PERFIL
-- ============================================
-- Esta función crea automáticamente un perfil cuando se registra un usuario nuevo

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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función al crear un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- FINALIZADO
-- ============================================
-- Las tablas, índices, políticas RLS y datos iniciales están listos
-- Ahora puedes:
-- 1. Crear usuarios en Authentication → Users
-- 2. Probar los endpoints de la API
-- 3. Los perfiles se crearán automáticamente al registrar usuarios

