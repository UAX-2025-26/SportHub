const { z } = require('zod');

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

const createCenterSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  admin_user_id: z.string().uuid().optional(),
  horario_apertura: z.string().optional(),
  horario_cierre: z.string().optional()
});

const createFacilitySchema = z.object({
  center_id: z.string().uuid(),
  nombre: z.string().min(1),
  tipo: z.string().min(1),
  capacidad: z.number().int().nonnegative().optional(),
  precio_hora: z.number().nonnegative().optional(),
  facilitator_id: z.string().uuid().optional(),
  activo: z.boolean().optional()
});

const availabilityQuerySchema = z.object({
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
});

const createBookingSchema = z.object({
  facility_id: z.string().uuid(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hora_inicio: z.string().regex(/^\d{2}:[0-5]\d(:[0-5]\d)?$/)
});

module.exports = {
  paginationSchema,
  createCenterSchema,
  createFacilitySchema,
  availabilityQuerySchema,
  createBookingSchema
};

