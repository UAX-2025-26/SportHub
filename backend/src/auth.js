const { auth } = require('express-oauth2-jwt-bearer');
const createError = require('http-errors');

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

// role claim could be in custom namespace; adjust as needed
function getRoleFromToken(req) {
  const claims = req.auth?.payload || {};
  const role = claims['https://sporthub/role'] || claims['role'] || claims['https://schemas.sporthub.app/role'];
  return role || 'player';
}

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

