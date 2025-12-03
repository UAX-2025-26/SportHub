const { requireRole } = require('../src/auth');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

function mockNext() { return jest.fn(); }

describe('requireRole middleware', () => {
  test('permite paso cuando el rol requerido coincide', () => {
    const mw = requireRole('admin');
    const req = { auth: { profile: { rol: 'admin' } } };
    const res = mockRes();
    const next = mockNext();

    mw(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('retorna 403 cuando el rol no está permitido', () => {
    const mw = requireRole('admin');
    const req = { auth: { profile: { rol: 'player' } } };
    const res = mockRes();
    const next = mockNext();

    mw(req, res, next);
    // requireRole usa createError(403) -> pasa por error handler del app; aquí comprobamos que next fue llamado con error 403
    expect(next).toHaveBeenCalled();
    const err = next.mock.calls[0][0];
    expect(err.status).toBe(403);
  });
});

