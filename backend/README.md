# Backend SportHub (API)

Arquitectura: Node.js + Express con estructura MVC (rutas -> controladores -> servicios/modelos). BBDD en Supabase (PostgreSQL) con RLS y Supabase Auth para JWT.

## Estructura

- app.js: bootstrap del servidor, seguridad (helmet, CORS, rate limit), vistas y montaje de rutas.
- routes/
  - api/
    - index.js: agrega routers de dominio
    - users.js, centers.js, facilities.js, bookings.js, admin.js, admin-centro.js
  - index.js: portada (Pug) e información básica
- controllers/
  - usersController.js, centersController.js, facilitiesController.js, bookingsController.js, adminController.js
- src/
  - supabase.js: cliente supabase (público y admin opcional)
  - auth.js: validación JWT (Supabase Auth) y middleware de roles
  - validation.js: esquemas Zod
  - validator.js: middleware validate(schema)
- utils/
  - user.js: helpers para extraer user_id y role del token
  - pick.js: helper para filtrar campos
## Endpoints principales

Todos los endpoints están montados bajo `/api` y requieren autenticación (excepto `/health`):

### Públicos
- `GET /health` - Health check

### Usuarios (requiere autenticación)
- `GET /api/usuarios/me` - Perfil del usuario autenticado
- `PUT /api/usuarios/me` - Actualizar perfil propio

### Centros
- `GET /api/centros` - Listar centros (paginado)
- `GET /api/centros/:id` - Detalle de un centro
- `POST /api/centros` - Crear centro (admin)
- `PUT /api/centros/:id` - Actualizar centro (admin/center_admin)

### Instalaciones
- `GET /api/centros/:id/instalaciones` - Listar instalaciones de un centro
- `POST /api/centros/:id/instalaciones` - Crear instalación (admin/center_admin)
- `PUT /api/instalaciones/:id` - Actualizar instalación
- `DELETE /api/instalaciones/:id` - Eliminar instalación

### Reservas
- `GET /api/instalaciones/:id/disponibilidad?fecha=YYYY-MM-DD` - Ver disponibilidad
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas` - Listar mis reservas
- `DELETE /api/reservas/:id` - Cancelar reserva

### Admin
- `GET /api/admin/estadisticas` - Estadísticas globales (admin)
- `GET /api/admin/centros` - Listar todos los centros (admin)
- `POST /api/admin/promociones` - Crear promoción (admin)

### Admin Centro
- `GET /api/admin-centro/resumen` - Resumen del centro (center_admin)
- `GET /api/admin-centro/reservas` - Reservas del centro (center_admin)

## Roles de usuario

Los roles se almacenan en la tabla `profiles` (columna `rol`):

- `player` - Usuario normal (puede hacer reservas)
- `center_admin` - Administrador de centro (gestiona un centro específico)
- `coach` - Entrenador (reservado para futuro)
- `referee` - Árbitro (reservado para futuro)
- `admin` - Administrador global (acceso total)

## Troubleshooting

### "Supabase env vars missing"
- Verifica que el archivo `.env` existe en la carpeta `backend/`
- Verifica que las variables `SUPABASE_URL` y `SUPABASE_ANON_KEY` están completas

### "Invalid token" o "No token provided"
- Asegúrate de incluir el header: `Authorization: Bearer TU_TOKEN`
- Verifica que el token no haya expirado
- Genera un nuevo token desde Supabase Dashboard

### "Not found" en endpoints
- Verifica que las tablas están creadas en Supabase
- Verifica que hay datos en las tablas (seed data)
- Revisa los logs del servidor para más detalles

### Errores de RLS (Row Level Security)
- Si usas `SUPABASE_SERVICE_ROLE_KEY`, bypasea RLS
- Si usas `SUPABASE_ANON_KEY`, RLS está activo
- Verifica que las políticas RLS permiten la operación para tu rol

## Estructura de base de datos

Ver archivo `database-setup.sql` para el schema completo con:
- Definición de tablas
- Índices
- Políticas RLS
- Datos iniciales
- Triggers automáticos

