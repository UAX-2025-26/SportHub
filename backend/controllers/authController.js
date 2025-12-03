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

    // Validar campos requeridos
    if (!email || !password) {
      return next(createError(400, 'Email y contraseña son requeridos'));
    }

    // Autenticar con Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return next(createError(401, 'Credenciales inválidas'));
    }

    // Obtener información del perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, nombre, apellidos, email, telefono, ciudad, rol')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Error obteniendo perfil:', profileError);
      return next(createError(500, 'Error al obtener información del usuario'));
    }

    // Devolver token y datos del usuario
    res.json({
      user: profile,
      token: authData.session.access_token,
    });
  } catch (error) {
    console.error('Error en login:', error);
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

    // Validar campos requeridos
    if (!email || !password || !nombre || !apellidos || !telefono || !ciudad) {
      return next(createError(400, 'Todos los campos son requeridos'));
    }

    // Validar formato de email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return next(createError(400, 'Email inválido'));
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return next(createError(400, 'La contraseña debe tener al menos 6 caracteres'));
    }

    // Validar formato de teléfono
    const phoneRegex = /^\d{9,}$/;
    if (!phoneRegex.test(telefono)) {
      return next(createError(400, 'Teléfono inválido (mínimo 9 dígitos)'));
    }

    // Registrar en Supabase Auth
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
      if (authError.message.includes('already registered')) {
        return next(createError(409, 'El email ya está registrado'));
      }
      console.error('Error en registro:', authError);
      return next(createError(500, authError.message));
    }

    if (!authData.user) {
      return next(createError(500, 'Error al crear usuario'));
    }

    // Insertar o actualizar perfil en la tabla profiles
    const { data: profile, error: profileError } = await supabase
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
      console.error('Error creando perfil:', profileError);
      // Intentar eliminar el usuario de Auth si falla la creación del perfil
      try {
        if (adminSupabase) {
          await adminSupabase.auth.admin.deleteUser(authData.user.id);
        } else {
          console.warn('adminSupabase no configurado: omitiendo deleteUser. Define SUPABASE_SERVICE_ROLE_KEY para habilitarlo.');
        }
      } catch (delErr) {
        console.error('Error eliminando usuario tras fallo de perfil:', delErr);
      }
      return next(createError(500, 'Error al crear perfil de usuario'));
    }

    // Devolver token y datos del usuario
    res.status(201).json({
      user: profile,
      token: authData.session?.access_token,
    });
  } catch (error) {
    console.error('Error en registro:', error);
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
