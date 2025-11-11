function getRoleFromTokenSafe(req) {
  const payload = req && req.auth && req.auth.payload ? req.auth.payload : {};
  return payload['https://sporthub/role'] || payload['role'] || payload['https://schemas.sporthub.app/role'] || 'player';
}

async function getUserProfileId(req) {
  const payload = req && req.auth && req.auth.payload ? req.auth.payload : {};
  const sub = payload.sub;
  if (!sub) return null;
  const claimUuid = payload['https://sporthub/user_id'];
  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  if (claimUuid && uuidRegex.test(claimUuid)) return claimUuid;
  if (uuidRegex.test(sub)) return sub;
  return null;
}

module.exports = { getUserProfileId, getRoleFromTokenSafe };

