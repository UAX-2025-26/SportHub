# Solución: Error "bookings_estado_check" constraint violation

## Problema
El error `new row for relation "bookings" violates check constraint "bookings_estado_check"` ocurrió debido a una inconsistencia entre los valores de estado permitidos en la base de datos y los usados en el código.

## Causa Raíz
1. **database-setup.sql**: Definía el constraint CHECK con valores en inglés:
   - `'PENDING_PAYMENT'`, `'CONFIRMED'`, `'CANCELLED'`, `'COMPLETED'`

2. **bookingsController.js**: Usaba valores en español:
   - `'PENDIENTE_PAGO'`, `'CANCELADA'`

3. **MIGRACION_ACTUALIZAR_ESTADOS.sql**: Intentaba actualizar los datos existentes a español, pero el constraint aún rechazaba estos valores.

## Solución Implementada

### 1. Actualización de database-setup.sql
Se actualizó el constraint CHECK de la tabla `bookings` para aceptar valores en español:

```sql
-- Antes:
estado TEXT DEFAULT 'CONFIRMED' CHECK (estado IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'COMPLETED'))

-- Después:
estado TEXT DEFAULT 'CONFIRMADA' CHECK (estado IN ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'))
```

### 2. Creación de Script de Migración
Se creó `MIGRACION_CONSTRAINT_ESTADOS.sql` para actualizar el constraint en bases de datos existentes:

```sql
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_estado_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_estado_check CHECK (estado IN ('PENDIENTE_PAGO', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'));
```

### 3. Corrección de Tests
Se actualizó `tests/bookingsController.test.js` para:
- Cambiar el estado esperado de `'CANCELLED'` a `'CANCELADA'`
- Corregir la estructura esperada de la respuesta en el test del cancel

## Valores de Estado Válidos
Después de estos cambios, los valores válidos para la columna `estado` en la tabla `bookings` son:

| Estado | Descripción |
|--------|------------|
| `PENDIENTE_PAGO` | Reserva pendiente de pago |
| `CONFIRMADA` | Reserva confirmada y pagada |
| `CANCELADA` | Reserva cancelada |
| `COMPLETADA` | Reserva completada |

## Acciones Necesarias
1. **Ejecutar la migración en Supabase**: 
   - Si la base de datos ya existe, ejecutar `MIGRACION_CONSTRAINT_ESTADOS.sql` en la consola SQL de Supabase
   - Si es una nueva instalación, el `database-setup.sql` actualizado tiene el constraint correcto

2. **Verificar que no hay datos con estados en inglés**:
   - Si hay datos existentes con estados en inglés, ejecutar primero `MIGRACION_ACTUALIZAR_ESTADOS.sql` antes de cambiar el constraint

## Archivos Modificados
- `backend/database-setup.sql` - Actualizado el constraint
- `backend/tests/bookingsController.test.js` - Corregidos los tests
- `backend/MIGRACION_CONSTRAINT_ESTADOS.sql` - Nuevo archivo de migración

## Verificación
Para verificar que el problema está resuelto:
1. Todas las nuevas reservas deben usar `estado: 'PENDIENTE_PAGO'`
2. El constraint debe aceptar los valores en español
3. No habrá más errores de "bookings_estado_check"

