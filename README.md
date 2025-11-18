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
  - 7. Seguridad e identidad (Auth0 + RLS)
  - 8. Requisitos no funcionales, calidad y pruebas
  - 9. Equipo y roles
  - 10. Licencia
  - 11. Configuración de IDE (JetBrains/WebStorm/IntelliJ)

## 1. Resumen ejecutivo

SportHub es una plataforma web para la reserva y gestión de instalaciones deportivas. Esta edición, orientada a cliente y al ámbito académico, elimina integraciones de pagos y correo SMTP. La autenticación se realiza con Auth0 (OIDC), mientras que datos, tiempo real y almacenamiento se gestionan con Supabase (PostgreSQL, Realtime, Storage, Edge Functions).

El software se concibe como un producto a medida que se desarrolla de forma iterativa: análisis, diseño, desarrollo, pruebas y mantenimiento/evolución. Existen riesgos típicos (sobrecarga en horas punta, dobles reservas, problemas de seguridad o cambios de requisitos) que condicionan la planificación y obligan a priorizar el descubrimiento temprano de errores.

El objetivo del MVP es ofrecer una experiencia fluida para jugadores y administradores de centro: descubrir centros, consultar disponibilidad sin choques de horario, reservar/cancelar dentro de política y administrar la operativa del centro, con seguridad por roles y actualizaciones en tiempo real in‑app.

## 2. Alcance (incluido / fuera de alcance)

Esta sección define el alcance del proyecto y ayuda a evitar crecimiento descontrolado del sistema.

- Incluido (MVP), priorizado siguiendo una lógica tipo MoSCoW (Must/Should):
  - Gestión de usuarios y perfiles por rol (player, center_admin, coach, referee, admin).
  - Centros e instalaciones: catálogo, horarios base y bloqueos puntuales.
  - Disponibilidad y reservas con prevención de doble reserva a nivel de BBDD.
  - Panel de administración de centro y backoffice global.
  - Notificaciones in‑app (Realtime).
  - Soporte multilenguaje (ES/EN) y diseño responsive.
- Fuera de alcance (evaluar a futuro), equivalente a Could/Won't por ahora:
  - Cobros online y reembolsos.
  - Envío de correos (SMTP/servicios de e‑mail).
  - Sincronización con calendarios externos y wearables.

La separación entre incluido y excluido ayuda a que los requisitos sean claros, alcanzables y verificables, y a definir hitos concretos.

## 3. Arquitectura general y tecnologías

- Frontend: React (SPA). Estado local + Context; datos remotos con React Query/SWR; i18n con react‑i18next; estilos con Tailwind CSS.
- Backend: Node.js + Express. API REST stateless con validación de JWT de Auth0.
- Base de datos: Supabase (PostgreSQL) con RLS, integridad referencial, índices y constraints (incluyendo UNIQUE para evitar dobles reservas).
- Tiempo real: Supabase Realtime para notificaciones y actualizaciones in‑app.
- Almacenamiento: Supabase Storage (avatars, imágenes de centros).

La arquitectura se ha elegido buscando fiabilidad (integridad y restricciones en BBDD), usabilidad (SPA responsiva), eficiencia (caché y consultas optimizadas) y mantenibilidad (separación frontend/backend, tipos, linters). El enfoque es iterativo e incremental, compatible con prácticas ágiles, refactorización frecuente e integración continua.

## 4. Modelos y diagramas

Los modelos ayudan a aclarar requisitos, comportamiento y estructura antes y durante la implementación.

### 4.1 Casos de uso

![Diagrama de casos de uso](docs/Diagrama%20de%20Casos%20de%20Uso.svg)

El diagrama de casos de uso recoge los requisitos funcionales a alto nivel, mostrando las interacciones de los actores (jugadores, administradores de centro, administradores globales) con el sistema.

### 4.2 Actividad: Realizar una reserva

![Diagrama de Actividad](docs/Diagrama%20de%20Actividad.svg)

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

La seguridad se trata de forma defensiva, asumiendo errores y accesos no deseados y aplicando controles en distintas capas (frontend, backend y base de datos) para reducir riesgos.

## 8. Requisitos no funcionales, calidad y pruebas

- Seguridad: HTTPS, CORS restringido, Helmet, rate limiting, RLS en BBDD.
- Calidad: TypeScript, ESLint + Prettier, tests (Jest/RTL, Supertest, Cypress).
- Rendimiento: API stateless, caché en cliente (React Query/SWR), índices y EXPLAIN en Postgres.
- Accesibilidad y UX: ARIA, navegación por teclado, responsive mobile‑first.
- Observabilidad: logs estructurados y trazas básicas; métricas según necesidad.

Se combinan análisis estático (tipos, linters) y dinámico (profiling, métricas en ejecución), y se contemplan distintos tipos de pruebas (unitarias, integración, sistema, aceptación, rendimiento/estrés, regresión). El proyecto es adecuado para aplicar desarrollo guiado por pruebas y para usar métricas (como cobertura o tiempos de respuesta) en la mejora de la calidad.

## 9. Equipo y roles

Javier · Rares · Pablo · Mario

El equipo puede asumir distintos roles:
- **Ingeniería**: definición de requisitos, arquitectura, modelo de datos, diagramas.
- **Programación**: implementación de frontend, backend y scripts de despliegue.
- **Gestión**: planificación (Gantt/PERT), seguimiento de hitos, coordinación de tareas y gestión de riesgos.

Se fomenta la programación sin ego, la revisión de código por pares y la comunicación frecuente (reuniones breves y retrospectivas), favoreciendo la difusión del conocimiento dentro del equipo.

## 10. Licencia

Apache License 2.0

## 11. Configuración de IDE (JetBrains/WebStorm/IntelliJ)

Configura el proyecto como un monorepo con al menos dos módulos/carpetas principales (`frontend` y `backend`). Asegúrate de instalar las dependencias usando el gestor correspondiente (por ejemplo, `npm install` o `pnpm install`) en cada una de ellas y configura las **Run Configurations** necesarias para arrancar cliente y servidor en paralelo.
