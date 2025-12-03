# Servicios API - Frontend SportHub

Este directorio contiene todos los servicios para comunicarse con la API del backend.

## 📁 Estructura

```
src/lib/api/
├── config.ts              # Configuración de endpoints y URLs
├── client.ts              # Cliente HTTP genérico
├── index.ts              # Exportaciones principales
├── users.service.ts      # Servicio de usuarios
├── centers.service.ts    # Servicio de centros deportivos
├── facilities.service.ts # Servicio de instalaciones
├── bookings.service.ts   # Servicio de reservas
└── admin.service.ts      # Servicio de administración
```

## 🚀 Inicio Rápido

### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Importar servicios

```typescript
import { centersService, bookingsService } from '@/lib/api';
```

### 3. Usar servicios

```typescript
// Obtener centros (público)
const { data, error } = await centersService.getCenters();

// Crear reserva (requiere autenticación)
const token = 'tu-jwt-token';
const { data, error } = await bookingsService.createBooking({
  instalacion_id: '123',
  fecha: '2025-12-03',
  hora_inicio: '10:00',
  hora_fin: '11:00'
}, token);
```

## 📚 Servicios Disponibles

### usersService

Gestión de usuarios y perfiles.

```typescript
import { usersService } from '@/lib/api';

// Obtener perfil actual
const { data, error } = await usersService.getCurrentUser(token);

// Actualizar perfil
const { data, error } = await usersService.updateCurrentUser({
  nombre: 'Juan',
  apellidos: 'Pérez'
}, token);
```

### centersService

Gestión de centros deportivos.

```typescript
import { centersService } from '@/lib/api';

// Listar todos los centros (público)
const { data, error } = await centersService.getCenters();

// Obtener detalle de un centro (público)
const { data, error } = await centersService.getCenterById('centro-id');

// Crear centro (requiere admin)
const { data, error } = await centersService.createCenter({
  nombre: 'Centro Deportivo',
  direccion: 'Calle Principal 123',
  ciudad: 'Madrid'
}, token);

// Actualizar centro (requiere admin o center_admin)
const { data, error } = await centersService.updateCenter('centro-id', {
  nombre: 'Nuevo Nombre'
}, token);
```

### facilitiesService

Gestión de instalaciones deportivas.

```typescript
import { facilitiesService } from '@/lib/api';

// Listar todas las instalaciones (público)
const { data, error } = await facilitiesService.getFacilities();

// Obtener instalaciones de un centro (público)
const { data, error } = await facilitiesService.getFacilitiesByCenter('centro-id');

// Obtener disponibilidad (público)
const { data, error } = await facilitiesService.getFacilityAvailability(
  'instalacion-id',
  '2025-12-03'
);

// Crear instalación (requiere admin o center_admin)
const { data, error } = await facilitiesService.createFacility('centro-id', {
  nombre: 'Pista de Tenis 1',
  tipo: 'tenis',
  precio_hora: 25.00
}, token);

// Actualizar instalación (requiere admin o center_admin)
const { data, error } = await facilitiesService.updateFacility('instalacion-id', {
  estado: 'mantenimiento'
}, token);

// Eliminar instalación (requiere admin o center_admin)
const { data, error } = await facilitiesService.deleteFacility('instalacion-id', token);
```

### bookingsService

Gestión de reservas.

```typescript
import { bookingsService } from '@/lib/api';

// Obtener mis reservas (requiere autenticación)
const { data, error } = await bookingsService.getMyBookings(token);

// Crear reserva (requiere autenticación)
const { data, error } = await bookingsService.createBooking({
  instalacion_id: 'instalacion-id',
  fecha: '2025-12-03',
  hora_inicio: '10:00',
  hora_fin: '11:00'
}, token);

// Cancelar reserva (requiere autenticación)
const { data, error } = await bookingsService.cancelBooking('reserva-id', token);
```

### adminService

Funciones de administración.

```typescript
import { adminService } from '@/lib/api';

// === Center Admin ===

// Obtener resumen del centro
const { data, error } = await adminService.getCenterSummary(token);

// Obtener reservas del centro
const { data, error } = await adminService.getCenterBookings(token);

// === Global Admin ===

// Obtener estadísticas globales
const { data, error } = await adminService.getAdminStats(token);

// Crear promoción
const { data, error } = await adminService.createPromotion({
  titulo: 'Descuento Verano',
  descripcion: '20% en todas las reservas',
  descuento: 20,
  fecha_inicio: '2025-06-01',
  fecha_fin: '2025-08-31'
}, token);

// Listar todos los centros
const { data, error } = await adminService.listAllCenters(token);

// Obtener usuario por ID
const { data, error } = await adminService.getUserById('user-id', token);

// Actualizar usuario
const { data, error } = await adminService.updateUserById('user-id', {
  rol: 'center_admin'
}, token);
```

## 🔐 Autenticación

Todos los servicios que requieren autenticación aceptan un token JWT:

```typescript
// Obtener token (depende de tu implementación de auth)
const token = localStorage.getItem('token');

// O desde Auth0, Supabase, etc.
const token = await auth.getAccessToken();

// Usar en servicios
const { data, error } = await usersService.getCurrentUser(token);
```

## ⚠️ Manejo de Errores

Todas las respuestas tienen la estructura:

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
```

Ejemplo de manejo:

```typescript
const { data, error, status } = await centersService.getCenters();

if (error) {
  if (status === 401) {
    // No autenticado - redirigir al login
    router.push('/login');
  } else if (status === 403) {
    // No autorizado
    alert('No tienes permisos');
  } else if (status === 404) {
    // No encontrado
    alert('Recurso no encontrado');
  } else {
    // Otro error
    alert(`Error: ${error}`);
  }
} else if (data) {
  // Éxito
  console.log('Datos:', data);
}
```

## 🎨 Uso en Componentes React

### Ejemplo con useState y useEffect

```typescript
'use client';

import { useEffect, useState } from 'react';
import { centersService, type Center } from '@/lib/api';

export default function CentersList() {
  const [centers, setCenters] = useState<Center[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCenters() {
      const response = await centersService.getCenters();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setCenters(response.data);
      }
      
      setLoading(false);
    }

    loadCenters();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {centers.map(center => (
        <div key={center.id}>
          <h2>{center.nombre}</h2>
          <p>{center.direccion}, {center.ciudad}</p>
        </div>
      ))}
    </div>
  );
}
```

### Ejemplo con formulario

```typescript
'use client';

import { useState } from 'react';
import { bookingsService } from '@/lib/api';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    instalacion_id: '',
    fecha: '',
    hora_inicio: '',
    hora_fin: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión');
      return;
    }

    const { data, error } = await bookingsService.createBooking(formData, token);

    if (error) {
      alert(`Error: ${error}`);
    } else if (data) {
      alert('Reserva creada exitosamente');
      // Redirigir o actualizar UI
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
      <button type="submit" disabled={loading}>
        {loading ? 'Reservando...' : 'Reservar'}
      </button>
    </form>
  );
}
```

## 📝 Tipos TypeScript

Todos los servicios están completamente tipados. Puedes importar los tipos:

```typescript
import type { 
  User,
  Center,
  Facility,
  Booking,
  CreateBookingData,
  AdminStats
} from '@/lib/api';

// Usar tipos en tus componentes
const [user, setUser] = useState<User | null>(null);
const [centers, setCenters] = useState<Center[]>([]);
```

## 🔗 Enlaces Útiles

- [Documentación completa de rutas](../../docs/API_ROUTES.md)
- [Documentación del backend](../../../backend/README.md)

## 📋 Checklist de Implementación

Cuando uses estos servicios en tu aplicación:

- [ ] Configurar `.env.local` con `NEXT_PUBLIC_API_URL`
- [ ] Implementar sistema de autenticación (Auth0, Supabase, etc.)
- [ ] Crear contexto/hook para gestionar el token
- [ ] Implementar manejo de errores global
- [ ] Crear componentes de carga y error reutilizables
- [ ] Implementar refresh de token si es necesario
- [ ] Agregar interceptores para logging (opcional)
- [ ] Implementar caché si es necesario (React Query, SWR, etc.)

## 🚀 Mejoras Futuras

Considera agregar:

- **React Query / SWR**: Para caché y sincronización automática
- **Axios**: Si necesitas interceptores más avanzados
- **Retry logic**: Reintentar peticiones fallidas
- **Request cancellation**: Cancelar peticiones en progreso
- **Offline support**: Soporte para modo sin conexión
