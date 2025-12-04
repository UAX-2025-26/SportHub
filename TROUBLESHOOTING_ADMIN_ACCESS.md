# 🔧 Solución: No Puedo Acceder a /admin/centers

## 🎯 Problema

Te redirige a `/home` cuando intentas acceder a `/admin/centers`

---

## ✅ Soluciones (en orden)

### 1. Verificar tu Rol en la Base de Datos

**Problema:** Tu usuario no tiene el rol 'admin'

**Solución:**
```sql
-- Primero, verifica tu rol actual
SELECT email, rol FROM profiles WHERE email = 'tu-email@ejemplo.com';

-- Si NO es 'admin', actualízalo:
UPDATE profiles 
SET rol = 'admin' 
WHERE email = 'tu-email@ejemplo.com';

-- Verifica que se actualizó correctamente
SELECT email, rol FROM profiles WHERE email = 'tu-email@ejemplo.com';
-- Debe mostrar: rol = 'admin'
```

### 2. Cerrar Sesión y Volver a Iniciar

**Problema:** El localStorage tiene datos antiguos

**Solución:**
1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Application" o "Almacenamiento"
3. En "Local Storage", busca tu dominio (localhost:3000)
4. Borra `auth_token` y `user_data`
5. O ejecuta en consola:
   ```javascript
   localStorage.removeItem('auth_token');
   localStorage.removeItem('user_data');
   ```
6. Haz logout y login nuevamente

### 3. Verificar en la Consola del Navegador

**Problema:** Quieres ver qué está pasando

**Solución:**
1. Abre `/admin/centers` 
2. Abre DevTools (F12)
3. Ve a la pestaña "Console"
4. Busca mensajes que digan:
   - `🔐 Auth Debug:` - Te muestra tu estado de autenticación
   - `❌ No autenticado` - No has iniciado sesión
   - `❌ Usuario no es admin` - Tu rol no es 'admin'

### 4. Ver Debug Info en la Página

**Problema:** Quieres ver la información de debug visualmente

**Solución:**
1. Intenta acceder a `/admin/centers`
2. Si te muestra el mensaje "Acceso denegado"
3. Haz clic en el botón **"Mostrar Debug Info"**
4. Verás:
   - Tu información de usuario
   - Tu rol actual
   - Estado de autenticación

---

## 📋 Checklist de Verificación

Marca cada paso que hayas verificado:

- [ ] **Paso 1:** Ejecuté el SQL para cambiar mi rol a 'admin'
- [ ] **Paso 2:** Verifiqué en la BD que mi rol es 'admin'
- [ ] **Paso 3:** Cerré sesión completamente
- [ ] **Paso 4:** Borré localStorage (auth_token y user_data)
- [ ] **Paso 5:** Inicié sesión nuevamente
- [ ] **Paso 6:** Verifiqué en la consola que mi rol es 'admin'
- [ ] **Paso 7:** Intenté acceder a /admin/centers
- [ ] **Resultado:** ✅ Ya puedo acceder

---

## 🔍 Diagnóstico Paso a Paso

### Paso 1: Verificar Autenticación

```javascript
// Abre la consola del navegador (F12) y ejecuta:
localStorage.getItem('auth_token')
// Si retorna NULL → No estás autenticado → Haz login

// También ejecuta:
localStorage.getItem('user_data')
// Si retorna NULL → No hay datos de usuario → Haz login
// Si retorna algo → Verifica el JSON para ver tu rol
```

### Paso 2: Verificar Rol en LocalStorage

```javascript
// En la consola del navegador:
const userData = JSON.parse(localStorage.getItem('user_data'));
console.log('Mi rol:', userData?.rol);
// Si dice 'player' o algo diferente a 'admin' → Necesitas actualizar en BD
```

### Paso 3: Verificar en la Base de Datos

```sql
-- En tu cliente de BD (pgAdmin, DBeaver, etc.)
SELECT * FROM profiles WHERE email = 'tu-email@ejemplo.com';
-- Verifica la columna 'rol', debe ser 'admin'
```

---

## 🚨 Errores Comunes

### Error 1: "Cambié el rol pero sigue sin funcionar"

**Causa:** El localStorage tiene datos viejos

**Solución:**
```javascript
// En consola del navegador:
localStorage.clear();
// O específicamente:
localStorage.removeItem('auth_token');
localStorage.removeItem('user_data');
// Luego haz login nuevamente
```

### Error 2: "No encuentro mi email en la tabla profiles"

**Causa:** El perfil no se creó al registrarse

**Solución:**
```sql
-- Crea el perfil manualmente
INSERT INTO profiles (id, email, nombre, apellidos, rol)
VALUES (
  'tu-auth-user-id',  -- Obtén esto de auth.users
  'tu-email@ejemplo.com',
  'Tu Nombre',
  'Tus Apellidos',
  'admin'
);
```

### Error 3: "Me dice que no estoy autenticado"

**Causa:** El token expiró o no existe

**Solución:**
1. Cierra sesión
2. Vuelve a iniciar sesión
3. Intenta de nuevo

### Error 4: "La página se queda cargando infinitamente"

**Causa:** Problema con el contexto de Auth

**Solución:**
1. Refresca la página (F5)
2. Si persiste, borra localStorage
3. Haz login nuevamente

---

## 🎯 Solución Rápida (La Más Común)

**90% de los casos se resuelven así:**

```bash
# 1. En tu BD:
UPDATE profiles SET rol = 'admin' WHERE email = 'tu-email@ejemplo.com';

# 2. En la consola del navegador (F12):
localStorage.clear();

# 3. En tu app:
- Haz logout
- Haz login
- Intenta acceder a /admin/centers

# ✅ Debería funcionar!
```

---

## 📊 Tabla de Diagnóstico

| Síntoma | Causa Probable | Solución |
|---------|---------------|----------|
| Redirige a `/home` inmediatamente | Rol no es 'admin' | UPDATE profiles SET rol = 'admin' |
| Redirige a `/login` | No autenticado | Haz login |
| Muestra "Verificando permisos..." infinito | Problema de carga | Refresca página |
| Dice "No definido" en rol | localStorage corrupto | Borra localStorage y re-login |
| Funciona en BD pero no en app | Cache viejo | Borra localStorage |

---

## 🔬 Depuración Avanzada

Si nada funciona, ejecuta esto en la consola:

```javascript
// Diagnóstico completo
const token = localStorage.getItem('auth_token');
const userData = localStorage.getItem('user_data');
const parsedUser = userData ? JSON.parse(userData) : null;

console.log('=== DIAGNÓSTICO COMPLETO ===');
console.log('Token existe:', !!token);
console.log('Token valor:', token ? token.substring(0, 20) + '...' : 'NULL');
console.log('User data existe:', !!userData);
console.log('User data:', parsedUser);
console.log('Rol:', parsedUser?.rol);
console.log('Email:', parsedUser?.email);
console.log('===========================');

// Si el rol NO es 'admin', este es tu problema
if (parsedUser?.rol !== 'admin') {
  console.error('❌ TU ROL NO ES ADMIN');
  console.log('Tu rol actual:', parsedUser?.rol);
  console.log('Ejecuta en tu BD:');
  console.log(`UPDATE profiles SET rol = 'admin' WHERE email = '${parsedUser?.email}';`);
}
```

---

## ✅ Verificación Final

Después de aplicar la solución, verifica:

1. ✅ En BD: `SELECT rol FROM profiles WHERE email = 'tu@email.com';` → debe ser 'admin'
2. ✅ En consola: `JSON.parse(localStorage.getItem('user_data')).rol` → debe ser 'admin'
3. ✅ En la app: Ve a `/admin/centers` → debe cargar la lista de centros
4. ✅ En consola de la app: Debe decir `🔐 Auth Debug: { userRole: 'admin', ... }`

---

## 📞 Si Aún No Funciona

1. Comparte el output del "Diagnóstico Completo" (de arriba)
2. Comparte el resultado del SQL: `SELECT * FROM profiles WHERE email = 'tu@email.com';`
3. Comparte los logs de la consola del navegador
4. Indica qué navegador usas y la versión

---

## 🎓 Resumen

**El problema más común:**
Tu usuario existe pero su rol NO es 'admin' en la base de datos.

**La solución más común:**
```sql
UPDATE profiles SET rol = 'admin' WHERE email = 'tu-email@ejemplo.com';
```
Luego: Borra localStorage, re-login, y prueba de nuevo.

**Tiempo estimado:** 2-5 minutos para resolverlo.

