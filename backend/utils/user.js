// Obtener rol del usuario de forma segura
function getRoleFromTokenSafe(req) {
  const profile = req?.auth?.profile;
  const payload = req?.auth?.payload;
  return profile?.rol || payload?.role || 'player';
}

// Obtener el ID del perfil del usuario autenticado
async function getUserProfileId(req) {
  // En Supabase Auth, el user.id es directamente el UUID
  const userId = req?.auth?.user?.id || req?.auth?.payload?.sub;

  if (!userId) return null;

  // Validar que sea un UUID válido
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
  if (uuidRegex.test(userId)) {
    return userId;
  }

  return null;
}

module.exports = { getUserProfileId, getRoleFromTokenSafe };

