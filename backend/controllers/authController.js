const createError = require('http-errors');
const { supabase, adminSupabase } = require('../src/supabase');

/**
 * Login de usuario
 * POST /api/auth/login
 * Body: { email, password }
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    console.log('[LOGIN] Intento de login para:', email);

    // Validar campos requeridos
    if (!email || !password) {
      console.log('[LOGIN] FAIL: Email o password faltante');
      return next(createError(400, 'Email y contraseña son requeridos'));
    }

    // Validar formato de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.log('[LOGIN] FAIL: Email inválido:', email);
      return next(createError(400, 'Email inválido'));
    }

    // Autenticar con Supabase
    console.log('[LOGIN] Autenticando con Supabase...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.log('[LOGIN] FAIL: Error de autenticación:', authError.message);
      return next(createError(401, 'Credenciales inválidas'));
    }

    console.log('[LOGIN] SUCCESS: Usuario autenticado, ID:', authData.user.id);

    // Obtener información del perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nombre, apellidos, email, telefono, ciudad, rol, center_id')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('[LOGIN] Error obteniendo perfil:', profileError);
      return next(createError(500, 'Error al obtener información del usuario'));
    }

    if (!profile) {
      console.log('[LOGIN] FAIL: Perfil no encontrado para usuario:', authData.user.id);
      return next(createError(500, 'Perfil de usuario no encontrado'));
    }

    console.log('[LOGIN] Perfil obtenido, rol:', profile.rol, 'center_id:', profile.center_id);

    // Devolver token y datos del usuario
    const response = {
      user: {
        id: profile.id,
        email: profile.email,
        nombre: profile.nombre,
        apellidos: profile.apellidos,
        rol: profile.rol,
        center_id: profile.center_id,
      },
      token: authData.session.access_token,
    };

    console.log('[LOGIN] Response enviada al cliente');
    res.json(response);
  } catch (error) {
    console.error('[LOGIN] Error inesperado:', error);
    return next(createError(500, 'Error en el servidor'));
  }
}

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 * Body: { email, password, nombre, apellidos, telefono, ciudad }
 */
async function register(req, res, next) {
  try {
    const { email, password, nombre, apellidos, telefono, ciudad } = req.body;
    console.log('[REGISTER] Iniciando registro para:', email);

    // Validar campos requeridos
    if (!email || !password || !nombre || !apellidos || !telefono || !ciudad) {
      console.log('[REGISTER] FAIL: Campos faltantes');
      return next(createError(400, 'Todos los campos son requeridos'));
    }

    // Validar formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      console.log('[REGISTER] FAIL: Email inválido:', email);
      return next(createError(400, 'Email inválido'));
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      console.log('[REGISTER] FAIL: Contraseña muy corta');
      return next(createError(400, 'La contraseña debe tener al menos 6 caracteres'));
    }

    // Validar formato de teléfono
    const phoneRegex = /^\d{9,}$/;
    if (!phoneRegex.test(telefono)) {
      console.log('[REGISTER] FAIL: Teléfono inválido:', telefono);
      return next(createError(400, 'Teléfono inválido (mínimo 9 dígitos)'));
    }

    // Registrar en Supabase Auth
    console.log('[REGISTER] Creando usuario en Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellidos,
          telefono,
          ciudad,
        },
      },
    });

    if (authError) {
      console.log('[REGISTER] FAIL: Error de Supabase Auth:', authError.message);
      if (authError.message.includes('already registered')) {
        return next(createError(409, 'El email ya está registrado'));
      }
      return next(createError(500, authError.message));
    }

    if (!authData.user) {
      console.log('[REGISTER] FAIL: No se creó usuario en Auth');
      return next(createError(500, 'Error al crear usuario'));
    }

    console.log('[REGISTER] Usuario creado en Auth, ID:', authData.user.id);

    // Insertar o actualizar perfil en la tabla profiles
    // Usar adminSupabase para omitir políticas RLS durante el registro
    const clientToUse = adminSupabase || supabase;

    if (!adminSupabase) {
      console.warn('[REGISTER] ⚠️ ADVERTENCIA: adminSupabase no configurado. Usando cliente normal.');
      console.warn('[REGISTER] 💡 Verifica SUPABASE_SERVICE_ROLE_KEY en .env');
    }

    console.log('[REGISTER] Creando perfil en profiles...');
    const { data: profile, error: profileError } = await clientToUse
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        nombre,
        apellidos,
        telefono,
        ciudad,
        rol: 'player', // Rol por defecto
      })
      .select()
      .single();

    if (profileError) {
      console.error('[REGISTER] FAIL: Error creando perfil:', profileError);
      // Intentar eliminar el usuario de Auth si falla la creación del perfil
      try {
        if (adminSupabase) {
          console.log('[REGISTER] Eliminando usuario de Auth por error de perfil...');
          await adminSupabase.auth.admin.deleteUser(authData.user.id);
        } else {
          console.warn('[REGISTER] adminSupabase no configurado: omitiendo deleteUser');
        }
      } catch (delErr) {
        console.error('[REGISTER] Error eliminando usuario:', delErr);
      }

      return next(createError(500, 'Error al crear perfil de usuario'));
    }

    console.log('[REGISTER] SUCCESS: Perfil creado para:', email);

    // Devolver token y datos del usuario
    const response = {
      user: {
        id: profile.id,
        email: profile.email,
        nombre: profile.nombre,
        apellidos: profile.apellidos,
        rol: profile.rol,
      },
      token: authData.session?.access_token,
    };

    console.log('[REGISTER] Response enviada al cliente');
    res.status(201).json(response);
  } catch (error) {
    console.error('[REGISTER] Error inesperado:', error);
    return next(createError(500, 'Error en el servidor'));
  }
}

/**
 * Logout
 * POST /api/auth/logout
 */
async function logout(req, res, next) {
  try {
    // En Supabase, el logout se maneja en el cliente
    // Aquí solo confirmamos que se recibió la petición
    res.json({ message: 'Logout exitoso' });
  } catch (error) {
    console.error('Error en logout:', error);
    return next(createError(500, 'Error en el servidor'));
  }
}

module.exports = {
  login,
  register,
  logout,
};
