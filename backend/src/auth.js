const createError = require('http-errors');
const { supabase } = require('./supabase');

// Middleware para verificar JWT de Supabase
async function checkJwt(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log('[JWT CHECK]', new Date().toISOString(), 'Path:', req.path);
    console.log('[JWT CHECK] Full URL:', req.originalUrl);
    console.log('[JWT CHECK] Method:', req.method);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[JWT CHECK] FAIL: No token provided or invalid format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    console.log('[JWT CHECK] Token received, validating...');

    // Verificar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('[JWT CHECK] FAIL: Invalid token', error?.message);
      return res.status(401).json({ error: 'Invalid token' });
    }

    console.log('[JWT CHECK] SUCCESS: User ID:', user.id);

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
      console.log('[JWT CHECK] User role:', profile.rol, 'Center ID:', profile.center_id);
    } else {
      console.log('[JWT CHECK] WARN: Profile not found for user', user.id);
    }

    next();
  } catch (err) {
    console.log('[JWT CHECK] ERROR:', err.message);
    return res.status(401).json({ error: 'Token verification failed' });
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
    console.log('[ROLE CHECK]', 'Path:', req.path, 'Required roles:', roles, 'User role:', role);

    if (!roles.includes(role)) {
      console.log('[ROLE CHECK] FAIL: Insufficient role. User:', role, 'Required:', roles);
      return res.status(403).json({ error: 'Insufficient role' });
    }

    console.log('[ROLE CHECK] SUCCESS: User has required role');
    next();
  };
}

module.exports = { checkJwt, requireRole, getRoleFromToken };

