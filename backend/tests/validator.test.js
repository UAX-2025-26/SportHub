const { validate } = require('../src/validator');
const { z } = require('zod');

function mockRes() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

function mockNext() { return jest.fn(); }

describe('validate middleware', () => {
  test('retorna 400 con detalles cuando el schema falla', () => {
    const schema = z.object({ name: z.string().min(3) });
    const mw = validate(schema);

    const req = { body: { name: 'ab' } };
    const res = mockRes();
    const next = mockNext();

    mw(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'validation_error' }));
  });

  test('pasa al siguiente middleware con datos parseados cuando es válido', () => {
    const schema = z.object({ age: z.coerce.number().int().min(18) });
    const mw = validate(schema);

    const req = { body: { age: '21' } };
    const res = mockRes();
    const next = mockNext();

    mw(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.body.age).toBe(21);
  });
});
