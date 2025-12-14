const bookingsCtrl = require('../controllers/bookingsController');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('bookingsController.create', () => {
  afterEach(() => jest.resetModules());

  test('retorna 409 duplicate_booking cuando hay conflicto UNIQUE', async () => {
    jest.doMock('../utils/user.js', () => ({ getUserProfileId: async () => 'user-uuid' }));
    jest.doMock('../src/supabase', () => ({
      supabase: {
        from: () => ({
          insert: () => ({
            select: () => ({
              single: () => ({ data: null, error: { message: 'duplicate key value violates unique constraint "bookings_unique"' } })
            })
          })
        })
      }
    }));
    const ctrl = require('../controllers/bookingsController');

    const req = { body: { facility_id: 'fac-1', fecha: '2025-12-02', hora_inicio: '10:00' } };
    const res = mockRes();
    await ctrl.create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'duplicate_booking' });
  });

  test('crea una reserva y retorna 201 con el objeto creado', async () => {
    jest.doMock('../utils/user.js', () => ({ getUserProfileId: async () => 'user-uuid' }));
    jest.doMock('../src/supabase', () => ({
      supabase: {
        from: () => ({
          insert: (payload) => ({
            select: () => ({ single: () => ({ data: { id: 'bk-1', ...payload }, error: null }) })
          })
        })
      }
    }));
    const ctrl = require('../controllers/bookingsController');

    const req = { body: { facility_id: 'fac-1', fecha: '2025-12-02', hora_inicio: '10:00' } };
    const res = mockRes();

    await ctrl.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'bk-1', facility_id: 'fac-1' }));
  });
});

describe('bookingsController.cancel', () => {
  afterEach(() => jest.resetModules());

  test('retorna 400 si falta profile_id', async () => {
    jest.doMock('../utils/user.js', () => ({ getUserProfileId: async () => null }));
    const ctrl = require('../controllers/bookingsController');

    const req = { params: { id: 'bk-1' } };
    const res = mockRes();
    await ctrl.cancel(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'profile_id_missing' });
  });

  test('cancela la reserva del propietario y devuelve estado CANCELLED', async () => {
    jest.doMock('../utils/user.js', () => ({ getUserProfileId: async () => 'user-uuid' }));
    jest.doMock('../src/supabase', () => ({
      supabase: {
        from: () => ({
          update: () => ({
            eq: () => ({
              eq: () => ({
                select: () => ({ single: () => ({ data: { id: 'bk-1', estado: 'CANCELADA' }, error: null }) })
              })
            })
          })
        })
      }
    }));

    const ctrl = require('../controllers/bookingsController');
    const req = { params: { id: 'bk-1' } };
    const res = mockRes();

    await ctrl.cancel(req, res);

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, booking: expect.objectContaining({ id: 'bk-1', estado: 'CANCELADA' }) }));
  });
});
