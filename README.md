# SportHub – Documentación Unificada

Repositorio Github: https://github.com/UAX-2025-26/SportHub.git

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
  - 7. Seguridad e identidad (Supabase Auth + RLS)
  - 8. Requisitos no funcionales, calidad y pruebas
  - 9. Equipo y roles
  - 10. Licencia
  - 11. Metodología de desarrollo (Modelo en V)
  - 12. Estrategia de pruebas y calidad (tests)

## 1. Resumen ejecutivo

SportHub es una plataforma web para la reserva y gestión de instalaciones deportivas. Esta edición, orientada a cliente y al ámbito académico, elimina integraciones de pagos y correo SMTP. La autenticación se realiza con Supabase Auth (OIDC/JWT), mientras que datos, tiempo real y almacenamiento se gestionan con Supabase (PostgreSQL, Realtime, Storage, Edge Functions).

El software se concibe como un producto a medida que se desarrolla de forma iterativa a través de las fases del modelo en V: requisitos y diseño en el lado izquierdo, e implementación y verificación/validación en el lado derecho. Existen riesgos típicos (sobrecarga en horas punta, dobles reservas, seguridad o cambios de requisitos) que condicionan la planificación y obligan a priorizar el descubrimiento temprano de errores.

El objetivo del MVP es ofrecer una experiencia fluida para jugadores y administradores de centro: descubrir centros, consultar disponibilidad sin choques de horario, reservar/cancelar dentro de política y administrar la operativa del centro, con seguridad por roles y actualizaciones en tiempo real in‑app.

## 2. Alcance (incluido / fuera de alcance)

Esta sección define el alcance del proyecto y ayuda a evitar crecimiento descontrolado del sistema.

- Incluido (MVP), priorizado siguiendo una lógica tipo MoSCoW (Must/Should):
  - Gestión de usuarios y perfiles por rol (player, center_admin, coach, referee, admin).
  - Centros e instalaciones: catálogo, horarios base y bloqueos puntuales.
  - Disponibilidad y reservas con prevención de doble reserva a nivel de BBDD.
  - Panel de administración de centro y backoffice global.
  - Diseño responsive.
- Fuera de alcance (evaluar a futuro), equivalente a Could/Won't por ahora:
  - Cobros online y reembolsos.
  - Envío de correos (SMTP/servicios de e‑mail).
  - Sincronización con calendarios externos y wearables.

La separación entre incluido y excluido ayuda a que los requisitos sean claros, alcanzables y verificables, y a definir hitos concretos.

## 3. Arquitectura general y tecnologías

- Frontend: Next.js (React). Estado local + Context; datos remotos con fetch/React Query; estilos con CSS Modules/Tailwind.
- Backend: Node.js + Express. API REST stateless.
- Base de datos: Supabase (PostgreSQL) con RLS, integridad referencial, índices y constraints (incluyendo UNIQUE para evitar dobles reservas).
- Tiempo real: Supabase Realtime para notificaciones y actualizaciones in‑app.
- Almacenamiento: Supabase Storage (avatars, imágenes de centros).

La arquitectura se ha elegido buscando fiabilidad (integridad y restricciones en BBDD), usabilidad (SPA responsiva), eficiencia (caché y consultas optimizadas) y mantenibilidad (separación frontend/backend, linters). En coherencia con el modelo en V, el diseño se formaliza antes de su implementación y las pruebas se planifican en paralelo a cada nivel de diseño.

### 3.1 Integración Backend-Frontend

El frontend y backend están completamente sincronizados a través de servicios API tipados con TypeScript:

- **Servicios API**: Ubicados en `frontend/src/lib/api/`, proporcionan métodos para todas las operaciones del backend
- **Configuración**: Los endpoints están centralizados en `config.ts` y se configuran mediante variables de entorno
- **Cliente HTTP**: Un cliente genérico en `client.ts` maneja autenticación, errores y respuestas
- **Tipado completo**: Todas las interfaces TypeScript coinciden con los modelos del backend

Documentación detallada:
- [Mapeo completo Backend-Frontend](docs/BACKEND_FRONTEND_MAPPING.md)
- [Documentación de Rutas API](docs/API_ROUTES.md)
- [Guía de Servicios Frontend](frontend/src/lib/api/README.md)

El diagrama de actividad describe el flujo de interacción para realizar una reserva, permitiendo ver decisiones, bifurcaciones y sincronizaciones.

### 4.3 Secuencia: Realizar una reserva

![Diagrama de Secuencia](docs/Diagrama%20de%20Secuencia.svg)

El diagrama de secuencia detalla el intercambio de mensajes entre usuario, frontend, backend y base de datos a lo largo del tiempo, útil para razonar sobre el comportamiento dinámico y posibles cuellos de botella.

### 4.4 Diagrama de clases

![Diagrama de Clases](docs/Diagrama%20de%20Clases.svg)

El diagrama de clases refleja el modelo de dominio y las relaciones entre entidades (dependencia, asociación, agregación, composición, herencia).

## 5. Modelo de datos (SQL en Supabase/PostgreSQL)

El esquema SQL corresponde al modelo lógico del sistema, derivado de un modelo conceptual (centros, instalaciones, reservas, usuarios) y que se materializa en un modelo físico concreto en PostgreSQL.

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

Se busca que el modelo sea relevante (solo información necesaria), claro (nombres significativos), coherente (tipos y relaciones correctas), completo (tablas y campos suficientes) y razonable en coste (sin sobreingeniería innecesaria).

## 6. Endpoints indicativos

Los endpoints listados implementan los requisitos funcionales derivados de los casos de uso e historias de usuario.

- Auth: gestionado con Supabase Auth en frontend; el backend valida JWT con Supabase.
- Usuarios: `GET /usuarios/me`, `PUT /usuarios/me`, (admin) `GET/PUT /admin/usuarios/:id`.
- Centros: `GET /centros`, `GET /centros/:id`, `POST/PUT /centros/:id`.
- Instalaciones: `GET /centros/:id/instalaciones`, `POST /centros/:id/instalaciones`, `PUT/DELETE /instalaciones/:id`.
- Disponibilidad: `GET /instalaciones/:id/disponibilidad?fecha=YYYY-MM-DD`.
- Reservas: `POST /reservas`, `GET /reservas?usuarioId=...`, `GET /reservas?centroId=...`, `DELETE /reservas/:id`.
- Admin-Centro: `GET /admin-centro/resumen`, `GET /admin-centro/reservas`, `POST /admin-centro/personal`.
- Backoffice: `GET /admin/estadisticas`, `POST /admin/promociones`, `GET /admin/centros`.

## 7. Seguridad e identidad (Supabase Auth + RLS)

- Validación de JWT emitido por Supabase (firma, expiración) vía SDK; datos de perfil complementarios en tabla `profiles`.
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

La seguridad se trata de forma defensiva, aplicando controles en distintas capas (frontend, backend y base de datos) para reducir riesgos.

## 8. Requisitos no funcionales, calidad y pruebas

- Seguridad: HTTPS, CORS restringido, Helmet, rate limiting, RLS en BBDD.
- Calidad: ESLint + Prettier; tests automatizados con Jest (backend).
- Rendimiento: API stateless, caché en cliente (React Query), índices y EXPLAIN en Postgres.
- Accesibilidad y UX: ARIA, navegación por teclado, responsive mobile‑first.
- Observabilidad: logs estructurados y trazas básicas; métricas según necesidad.

## 9. Equipo y roles

Javier · Rares · Pablo · Mario

El equipo puede asumir distintos roles:
- **Ingeniería**: definición de requisitos, arquitectura, modelo de datos, diagramas.
- **Programación**: implementación de frontend, backend y scripts de despliegue.
- **Gestión**: planificación, seguimiento de hitos, coordinación y gestión de riesgos.

## 10. Licencia

Apache License 2.0

## 11. Metodología de desarrollo (Modelo en V)

Se ha seguido un Modelo en V, que alinea cada nivel de diseño con sus pruebas correspondientes:

- Requisitos del sistema ↔ Pruebas de aceptación (validación con usuario/cliente).
- Requisitos software ↔ Pruebas de sistema (verificación del sistema completo).
- Diseño arquitectónico ↔ Pruebas de integración (interacción entre módulos/servicios y BBDD).
- Diseño detallado ↔ Pruebas unitarias (funciones/controladores/middlewares).

Artefactos y flujo:
- Especificación de requisitos (incluyendo prioridades MoSCoW y alcance controlado para evitar scope creep).
- Modelado UML (casos de uso, actividad, secuencia y clases en `docs/`).
- Diseño de datos y API (esquema SQL y rutas/contratos indicativos).
- Plan de pruebas por nivel, definido en paralelo al diseño correspondiente.
- Gestión de riesgos basada en detección temprana y revisión en hitos (dobles reservas, cargas punta, seguridad, cambios de requisitos).

## 12. Estrategia de pruebas y calidad (tests)

La calidad se asegura mediante pruebas planificadas y ejecutadas conforme al modelo en V.

### 12.1 Tipos y niveles de prueba (implementados en backend)

- Unitarias: controladores y middlewares (Jest) con mocks de Supabase y utilidades.
- Integración: (pendiente) endpoints con Supertest contra app Express con dobles de BBDD.
- E2E/aceptación: (pendiente) flujos críticos desde el navegador.

### 12.2 Casos de prueba implementados (backend)

- Reserva sin solapamiento: inserción duplicada retorna 409 `duplicate_booking`.
- Política de cancelación: transición a `CANCELLED` y restricciones de propietario.
- Autorización por rol: `requireRole` niega acceso (403) a roles no permitidos.
- Validación de entrada: middleware `validate` responde 400 en formatos inválidos.

### 12.3 Despliegue de la aplicación
- Backend: usaremos microsoft azure para desplegar un contenedor con el back, generando un punto de acceso desde el frontend
- Frontend: desplegaremos la app en vercel aprovechando la alta compatibilidad con Next.js
- BBDD: La base de datos ya está en producción desde un inicio habiendo usado supabase
