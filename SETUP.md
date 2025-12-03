# Sport Hub - Guía de Configuración

## 🔧 Errores Críticos Resueltos

### ✅ 1. Dependencias del Backend
- **Estado**: Resuelto
- **Acción**: Se ejecutó `npm install` en el directorio backend/

### ✅ 2. Configuración del Frontend
- **Estado**: Resuelto
- **Acciones**:
  - ✅ `next.config.ts` actualizado con configuración de variables de entorno
  - ✅ `tsconfig.json` ya existía con alias `@/*` configurado
  - ✅ Dependencias agregadas al `package.json` del frontend (Supabase, clsx, classnames)

### ✅ 3. Autenticación Implementada
- **Estado**: Implementado
- **Acciones**:
  - ✅ Cliente de Supabase creado en `src/lib/supabase.ts`
  - ✅ Context global de autenticación en `src/contexts/AuthContext.tsx`
  - ✅ Formularios de login y registro integrados con Supabase Auth
  - ✅ Manejo de tokens JWT automático mediante Supabase
  - ✅ Estado global de autenticación mediante React Context

### ✅ 4. Variables de Entorno
- **Estado**: Configurado
- **Acciones**:
  - ✅ Creado `.env.local` en el frontend
  - ✅ Creado `.env.local.example` como plantilla
  - ✅ Variables configuradas en `next.config.ts`

### ✅ 5. Validación de TypeScript
- **Estado**: Configurado
- **Acciones**:
  - ✅ Alias `@/` funcionando correctamente
  - ✅ Tipos de Supabase disponibles

### ✅ 6. Rutas y Páginas
- **Estado**: Mejorado
- **Acciones**:
  - ✅ Página principal existe en `src/app/page.tsx`
  - ✅ Páginas de auth: `/login` y `/register`
  - ✅ Nueva página de dashboard protegida en `/dashboard`
  - ✅ Layout raíz con AuthProvider

---

## 🚀 Configuración Inicial

### 1. Configurar Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` basándote en `.env.example`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:3001

SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

NODE_ENV=development
```

### 2. Configurar Frontend

```bash
cd frontend
npm install
```

Edita el archivo `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Obtener Credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a Settings > API
4. Copia:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🏃‍♂️ Ejecutar el Proyecto

### Backend
```bash
cd backend
npm run dev
```
Servidor corriendo en: http://localhost:3000

### Frontend
```bash
cd frontend
npm run dev
```
Aplicación corriendo en: http://localhost:3001

---

## 📁 Estructura Mejorada

```
frontend/
├── src/
│   ├── app/                    # Rutas de Next.js 13+
│   │   ├── layout.tsx          # Layout raíz con AuthProvider ✅
│   │   ├── page.tsx            # Página principal ✅
│   │   ├── login/              # Página de login
│   │   ├── register/           # Página de registro
│   │   ├── dashboard/          # Dashboard protegido ✅ NUEVO
│   │   └── home/               # Página home
│   ├── components/
│   │   ├── auth/               # Componentes de autenticación ✅ NUEVO
│   │   │   └── ProtectedRoute.tsx
│   │   ├── common/             # Componentes reutilizables
│   │   └── ...
│   ├── contexts/               # ✅ NUEVO
│   │   └── AuthContext.tsx    # Context de autenticación
│   └── lib/                    # ✅ NUEVO
│       ├── supabase.ts         # Cliente de Supabase
│       └── api.ts              # Helper para llamadas API
├── .env.local                  # Variables de entorno ✅
├── .env.local.example          # Plantilla de variables ✅
├── next.config.ts              # Configuración mejorada ✅
└── tsconfig.json               # Configuración TypeScript ✅
```

---

## 🔐 Características de Autenticación

### Implementadas

- ✅ **Registro de usuarios** con metadata (nombre, apellidos, teléfono, ciudad)
- ✅ **Login de usuarios** con email y contraseña
- ✅ **Estado global** de autenticación
- ✅ **Rutas protegidas** con componente `ProtectedRoute`
- ✅ **Logout** de usuarios
- ✅ **Persistencia de sesión** automática
- ✅ **Manejo de tokens JWT** transparente

### Uso del Hook de Autenticación

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MiComponente() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  
  // user: Usuario actual o null
  // loading: true mientras se verifica la sesión
  // signIn(email, password): Función para login
  // signUp(email, password, metadata): Función para registro
  // signOut(): Función para cerrar sesión
}
```

### Proteger Rutas

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MiPaginaProtegida() {
  return (
    <ProtectedRoute>
      <div>Contenido solo para usuarios autenticados</div>
    </ProtectedRoute>
  );
}
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@supabase/supabase-js'"

```bash
cd frontend
npm install --force
```

### Error: Variables de entorno no definidas

Asegúrate de que:
1. El archivo `.env.local` existe en `frontend/`
2. Las variables empiezan con `NEXT_PUBLIC_`
3. Reinicia el servidor de desarrollo

### Error: TypeScript no reconoce alias `@/`

El `tsconfig.json` ya está configurado. Reinicia tu IDE.

---

## 📝 Próximos Pasos Recomendados

1. **Configurar Supabase Database**
   - Crear tablas para usuarios, centros deportivos, reservas, etc.
   - Configurar Row Level Security (RLS)

2. **Implementar Páginas Funcionales**
   - Lista de centros deportivos
   - Sistema de reservas
   - Perfil de usuario

3. **Mejorar UX**
   - Loading states
   - Mensajes de error más descriptivos
   - Validación en tiempo real

4. **Testing**
   - Tests unitarios
   - Tests de integración
   - Tests E2E

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

