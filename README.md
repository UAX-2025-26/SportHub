# SportHub – Documentación Unificada

Documentación del proyecto SportHub. Contiene el resumen ejecutivo, el alcance, la arquitectura propuesta, los modelos y diagramas (casos de uso, actividad, secuencia y clases), el esquema de datos en SQL, endpoints indicativos, requisitos no funcionales, equipo y licencia.

- Índice
  - 1. Resumen ejecutivo
  - 2. Alcance (incluido / fuera de alcance)
  - 3. Arquitectura general y tecnologías
  - 4. Modelos y diagramas
    - 4.1 Casos de uso
    - 4.2 Actividad: Realizar reserva
    - 4.3 Secuencia: Realizar reserva
    - 4.4 Diagrama de clases
  - 5. Modelo de datos (SQL en Supabase/PostgreSQL)
  - 6. Endpoints indicativos
  - 7. Seguridad e identidad (Auth0 + RLS)
  - 8. Requisitos no funcionales
  - 9. Equipo
  - 10. Licencia
  - 11. Configuración de IDE (JetBrains/WebStorm/IntelliJ)

## 1. Resumen ejecutivo

SportHub es una plataforma web para la reserva y gestión de instalaciones deportivas. Esta edición, orientada a cliente y al ámbito académico, elimina integraciones de pagos y correo SMTP. La autenticación se realiza con Auth0 (OIDC), mientras que datos, tiempo real y almacenamiento se gestionan con Supabase (PostgreSQL, Realtime, Storage, Edge Functions).

El objetivo del MVP es ofrecer una experiencia fluida para jugadores y administradores de centro: descubrir centros, consultar disponibilidad sin choques de horario, reservar/cancelar dentro de política y administrar la operativa del centro — todo con seguridad por roles y actualizaciones en tiempo real in‑app.

## 2. Alcance (incluido / fuera de alcance)

- Incluido (MVP):
  - Gestión de usuarios y perfiles por rol (player, center_admin, coach, referee, admin).
  - Centros e instalaciones: catálogo, horarios base y bloqueos puntuales.
  - Disponibilidad y reservas con prevención de doble reserva a nivel de BBDD.
  - Panel de administración de centro y backoffice global.
  - Notificaciones in‑app (Realtime).
  - Soporte multilenguaje (ES/EN) y diseño responsive.
- Fuera de alcance (evaluar a futuro):
  - Cobros online y reembolsos.
  - Envío de correos (SMTP/servicios de e‑mail).
  - Sincronización con calendarios externos y wearables.

## 3. Arquitectura general y tecnologías

- Frontend: React (SPA). Estado local + Context; datos remotos con React Query/SWR; i18n con react‑i18next; estilos con Tailwind CSS.
- Backend: Node.js + Express. API REST stateless con validación de JWT de Auth0.
- Base de datos: Supabase (PostgreSQL) con RLS, integridad referencial, índices y constraints (incluyendo UNIQUE para evitar dobles reservas).
- Tiempo real: Supabase Realtime para notificaciones y actualizaciones in‑app.
- Almacenamiento: Supabase Storage (avatars, imágenes de centros).

## 4. Modelos y diagramas

A continuación se incluyen los diagramas en formato SVG integrados en este documento.

### 4.1 Casos de uso

![Diagrama de casos de uso](docs/Diagrama%20de%20Casos%20de%20Uso.svg)

### 4.2 Actividad: Realizar una reserva

![Diagrama de Actividad](docs/Diagrama%20de%20Actividad.svg)

### 4.3 Secuencia: Realizar una reserva

![Diagrama de Secuencia](docs/Diagrama%20de%20Secuencia.svg)

### 4.4 Diagrama de clases

![Diagrama de Clases](docs/Diagrama%20de%20Clases.svg)

## 5. Modelo de datos (SQL en Supabase/PostgreSQL)

Fragmentos principales del esquema propuesto:

```sql
-- Tabla profiles (información adicional a auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- coincide con auth.users.id
    nombre TEXT,
    rol TEXT CHECK (rol IN ('player', 'center_admin', 'coach', 'referee', 'admin')),
    center_id UUID REFERENCES centers(id),
    telefono TEXT,
    foto_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla centers
CREATE TABLE centers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    direccion TEXT,
    ciudad TEXT,
    admin_user_id UUID REFERENCES profiles(id),
    horario_apertura TIME,
    horario_cierre TIME,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla facilities
CREATE TABLE facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id UUID REFERENCES centers(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT, -- enum: tenis, futbol, gimnasio, etc.
    capacidad INTEGER,
    precio_hora DECIMAL(8,2),
    facilitator_id UUID REFERENCES profiles(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla bookings (con constraint UNIQUE para evitar duplicados)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    estado TEXT DEFAULT 'CONFIRMED' CHECK (estado IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    price_paid DECIMAL(8,2),
    payment_id UUID,
    UNIQUE(facility_id, fecha, hora_inicio)
);

-- Tabla promotions (opcional/global por centro)
CREATE TABLE promotions (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    tipo_descuento TEXT CHECK (tipo_descuento IN ('PERCENTAGE', 'FIXED')),
    valor_descuento DECIMAL(5,2),
    center_id UUID REFERENCES centers(id), -- null si global
    fecha_inicio DATE,
    fecha_fin DATE,
    uso_maximo INTEGER,
    usos_realizados INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true
);
```

## 6. Endpoints indicativos

- Auth: gestionado en frontend con Auth0; el backend valida JWT.
- Usuarios: `GET /usuarios/me`, `PUT /usuarios/me`, (admin) `GET/PUT /admin/usuarios/:id`.
- Centros: `GET /centros`, `GET /centros/:id`, `POST/PUT /centros/:id`.
- Instalaciones: `GET /centros/:id/instalaciones`, `POST /centros/:id/instalaciones`, `PUT/DELETE /instalaciones/:id`.
- Disponibilidad: `GET /instalaciones/:id/disponibilidad?fecha=YYYY-MM-DD`.
- Reservas: `POST /reservas`, `GET /reservas?usuarioId=...`, `GET /reservas?centroId=...`, `DELETE /reservas/:id`.
- Admin-Centro: `GET /admin-centro/resumen`, `GET /admin-centro/reservas`, `POST /admin-centro/personal`.
- Backoffice: `GET /admin/estadisticas`, `POST /admin/promociones`, `GET /admin/centros`.

## 7. Seguridad e identidad (Auth0 + RLS)

- Validación de JWT emitido por Auth0 (firma via JWKS, expiración, scopes/roles).
- RLS en Postgres para limitar acceso por usuario/rol. Ejemplos:

```sql
-- Ejemplo de políticas RLS para bookings
CREATE POLICY "Players can view own bookings" 
ON bookings FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "Players can create bookings for self" 
ON bookings FOR INSERT
TO authenticated 
WITH CHECK (user_id = auth.uid());
```

## 8. Requisitos no funcionales

- Seguridad: HTTPS, CORS restringido, Helmet, rate limiting, RLS en BBDD.
- Calidad: TypeScript, ESLint + Prettier, tests (Jest/RTL, Supertest, Cypress).
- Rendimiento: API stateless, caché en cliente (React Query/SWR), índices y EXPLAIN en Postgres.
- Accesibilidad y UX: ARIA, navegación por teclado, responsive mobile‑first.
- Observabilidad: logs estructurados y trazas básicas; métricas según necesidad.

## 9. Equipo

Javier · Rares · Pablo · Mario

## 10. Licencia

Apache License 2.0
