# Backend SportHub (API)

Arquitectura: Node.js + Express con estructura MVC (rutas -> controladores -> servicios/modelos). BBDD en Supabase (PostgreSQL) con RLS y Auth0 para JWT.

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
  - auth.js: validación JWT (Auth0) y middleware de roles
  - validation.js: esquemas Zod
  - validator.js: middleware validate(schema)
- utils/
  - user.js: helpers para extraer user_id y role del token
  - pick.js: helper para filtrar campos

## Variables de entorno (.env)

Copia `.env.example` a `.env` y completa:

- PORT, CORS_ORIGIN
- AUTH0_AUDIENCE, AUTH0_ISSUER_BASE_URL
- SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (opcional)

## Ejecutar

```cmd
cd backend
npm install
npm start
```

## Endpoints principales

Ver el README raíz del repo para la lista indicativa. Las rutas están montadas bajo `/api`.

