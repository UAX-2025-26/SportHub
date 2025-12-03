# ✅ Checklist de Acción Inmediata

## 🚨 PASO 1: Completar Service Role Key (URGENTE)

Abre el archivo: `backend\.env`

Reemplaza la línea:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Con tu clave completa de Supabase:
1. Ve a https://supabase.com/dashboard
2. Settings → API
3. Copia la **service_role key** (la larga, NO la anon)
4. Pégala completa en el `.env`

---

## 🗄️ PASO 2: Ejecutar SQL en Supabase

### Si NO tienes tabla profiles:
1. Abre Supabase Dashboard → SQL Editor
2. New Query
3. Copia TODO el archivo: `backend/database-setup.sql`
4. Run

### Si YA tienes tabla profiles:
1. Abre Supabase Dashboard → SQL Editor
2. New Query
3. Copia el archivo: `backend/migration-add-profile-fields.sql`
4. Run

---

## 🔄 PASO 3: Reiniciar Servidores

### Backend:
```powershell
cd "C:\Users\javie_ecnbd8s\Proyectos\Ingenieria del Software\sport-hub\backend"
# Presiona Ctrl+C para detener si está corriendo
npm run start
```

### Frontend:
```powershell
cd "C:\Users\javie_ecnbd8s\Proyectos\Ingenieria del Software\sport-hub\frontend"
# Presiona Ctrl+C para detener si está corriendo
npm run dev
```

---

## ✅ PASO 4: Verificar que Funciona

### Opción 1: Script de Pruebas
```powershell
cd "C:\Users\javie_ecnbd8s\Proyectos\Ingenieria del Software\sport-hub"
./test-auth-api.ps1
```

**Resultado Esperado:**
```
✓ Health check exitoso
✓ Registro exitoso
✓ Login exitoso
✓ Perfil obtenido exitosamente
```

### Opción 2: Frontend
1. Abre: http://localhost:3000/register
2. Rellena el formulario con datos de prueba
3. Clic en "Registrarse"
4. **Resultado esperado:** Redirige a /home sin errores

---

## 🎯 ¿Qué se ha Arreglado?

✅ **Puertos alineados:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

✅ **Error 500 en registro:** Solucionado
- Tabla `profiles` actualizada con todas las columnas
- Controlador usa `adminSupabase` correctamente

✅ **Botones consistentes:**
- Dimensiones fijas en todos los dispositivos
- Sin zoom automático
- Proporciones idénticas

✅ **Autenticación funcional:**
- Login/Register conectados al backend
- Context global de autenticación
- Redirección automática después de login/registro

---

## 📄 Archivos de Referencia

Si algo falla, consulta:
- `SOLUCION_ERROR_500.md` - Guía detallada
- `RESUMEN_CAMBIOS.md` - Lista completa de cambios
- `SETUP.md` - Configuración general del proyecto

---

## 🆘 Si Aún Hay Problemas

1. **Error 500 persiste:**
   - Verifica que ejecutaste el SQL correcto en Supabase
   - Revisa que `SUPABASE_SERVICE_ROLE_KEY` esté completa
   - Mira los logs del backend en la consola

2. **Frontend no conecta:**
   - Verifica que backend esté corriendo en puerto 3001
   - Revisa `frontend/.env.local` tenga `NEXT_PUBLIC_API_URL=http://localhost:3001`
   - Mira la consola del navegador (F12)

3. **Botones se ven diferentes:**
   - Refresca con Ctrl+Shift+R (forzar recarga)
   - Cierra y abre el navegador
   - Verifica que `globals.css` tenga los cambios

---

## 🎉 Una Vez Todo Funcione

Puedes empezar a:
- Crear nuevas páginas funcionales
- Implementar el sistema de reservas
- Desarrollar la gestión de centros deportivos
- Agregar más features

**Todo está listo para desarrollo productivo! 🚀**

