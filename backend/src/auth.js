const createError = require('http-errors');
const { supabase } = require('./supabase');

// Middleware para verificar JWT de Supabase
async function checkJwt(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(createError(401, 'No token provided'));
    }

    const token = authHeader.substring(7);

    // Verificar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next(createError(401, 'Invalid token'));
    }

    // Adjuntar información del usuario al request
    req.auth = {
      payload: {
        sub: user.id,
        email: user.email
      },
      user: user
    };

    // Obtener el rol del usuario desde la tabla profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol, center_id, nombre')
      .eq('id', user.id)
      .single();

    if (profile) {
      req.auth.profile = profile;
      req.auth.payload.role = profile.rol;
    }

    next();
  } catch (err) {
    return next(createError(401, 'Token verification failed'));
  }
}

// Obtener rol del usuario autenticado
function getRoleFromToken(req) {
  const role = req.auth?.profile?.rol || req.auth?.payload?.role;
  return role || 'player';
}

// Middleware para requerir roles específicos
function requireRole(...roles) {
  return (req, res, next) => {
    const role = getRoleFromToken(req);
    if (!roles.includes(role)) {
      return next(createError(403, 'Insufficient role'));
    }
    next();
  };
}

module.exports = { checkJwt, requireRole, getRoleFromToken };

