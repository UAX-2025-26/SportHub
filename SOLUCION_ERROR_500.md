# Solución al Error 500 en Registro

## Problema
El registro de usuarios está fallando con error 500 porque:
1. La tabla `profiles` no tiene las columnas necesarias
2. El `SUPABASE_SERVICE_ROLE_KEY` está incompleto

## Solución Paso a Paso

### 1. Completar la Service Role Key

Ve al archivo `backend/.env` y reemplaza la línea:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Con la clave completa que obtienes de:
1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings → API**
4. Copia la **service_role** key (NO la anon key)
5. Pégala en el `.env`

### 2. Actualizar la Base de Datos

#### Opción A: Si NO tienes la tabla profiles creada aún

En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia TODO el contenido de `backend/database-setup.sql`
4. Pégalo y haz clic en **Run**

#### Opción B: Si YA tienes la tabla profiles

En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia el contenido de `backend/migration-add-profile-fields.sql`
4. Pégalo y haz clic en **Run**

### 3. Reiniciar el Backend

Detén el servidor backend (Ctrl+C) y vuelve a iniciarlo:

```powershell
cd "C:\Users\javie_ecnbd8s\Proyectos\Ingenieria del Software\sport-hub\backend"
npm run start
```

### 4. Probar el Registro

Ejecuta el script de pruebas:

```powershell
cd "C:\Users\javie_ecnbd8s\Proyectos\Ingenieria del Software\sport-hub"
./test-auth-api.ps1
```

O prueba desde el frontend:
1. Ve a http://localhost:3000/register
2. Rellena el formulario
3. Haz clic en "Registrarse"

### 5. Verificar que Funciona

Si todo está bien, verás:
- ✅ El script de pruebas muestra "Registro exitoso" con un token
- ✅ En el frontend, te redirige a `/home` después del registro
- ✅ En Supabase Dashboard → Authentication → Users, verás el nuevo usuario
- ✅ En Supabase Dashboard → Table Editor → profiles, verás el perfil creado

## Campos de la Tabla Profiles

La tabla debe tener estas columnas:
- `id` (UUID, PK) - referencia a auth.users
- `email` (TEXT)
- `nombre` (TEXT)
- `apellidos` (TEXT)
- `telefono` (TEXT)
- `ciudad` (TEXT)
- `rol` (TEXT) - valores: 'player', 'center_admin', 'coach', 'referee', 'admin'
- `center_id` (UUID, nullable)
- `foto_url` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ)

## Problemas Comunes

### Error: "duplicate key value violates unique constraint"
- El email ya está registrado. Prueba con otro email.

### Error: "relation profiles does not exist"
- La tabla no existe. Ejecuta el SQL completo (Opción A arriba).

### Error: "column email does not exist"
- Faltan columnas. Ejecuta la migración (Opción B arriba).

### Error: "permission denied for table profiles"
- Verifica que las políticas RLS estén configuradas correctamente.
- Asegúrate de que la service_role key esté bien configurada.

## Verificación Final

Después de aplicar los cambios:

1. **Verifica la tabla:**
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'profiles';
   ```

2. **Prueba el registro:**
   ```powershell
   ./test-auth-api.ps1
   ```

3. **Verifica en Supabase:**
   - Authentication → Users (debería haber usuarios)
   - Table Editor → profiles (debería haber perfiles)

## Puertos Configurados

- **Frontend:** http://localhost:3000
- **Backend/API:** http://localhost:3001

## Contacto

Si sigues teniendo problemas, comparte:
- Los logs del backend (en la consola donde ejecutas `npm run start`)
- El mensaje de error exacto
- Una captura de la estructura de la tabla `profiles` en Supabase

