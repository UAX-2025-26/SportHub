const { z } = require('zod');

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:[0-5]\d(:[0-5]\d)?$/;
const uuidSchema = z.string().uuid();
const roleEnum = z.enum(['player', 'center_admin', 'coach', 'referee', 'admin']);

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0)
});

const createCenterSchema = z.object({
  nombre: z.string().min(1),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  admin_user_id: uuidSchema.optional(),
  horario_apertura: z.string().optional(),
  horario_cierre: z.string().optional()
});

const createFacilitySchema = z.object({
  center_id: uuidSchema.optional(),
  nombre: z.string().min(1),
  tipo: z.string().min(1),
  capacidad: z.coerce.number().int().min(0).optional(),
  precio_hora: z.coerce.number().min(0).optional(),
  facilitator_id: uuidSchema.optional(),
  activo: z.boolean().optional()
});

const availabilityQuerySchema = z.object({
  fecha: z.string().regex(dateRegex)
});

const createBookingSchema = z.object({
  facility_id: uuidSchema,
  fecha: z.string().regex(dateRegex),
  hora_inicio: z.string().regex(timeRegex)
});

const updateProfileSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  telefono: z.string().min(6).max(30).optional(),
  foto_url: z.string().url().optional()
}).refine(data => Object.keys(data).length > 0, { message: 'empty_body' });

const adminUpdateUserSchema = z.object({
  nombre: z.string().min(1).max(120).optional(),
  telefono: z.string().min(6).max(30).optional(),
  foto_url: z.string().url().optional(),
  rol: roleEnum.optional(),
  center_id: uuidSchema.optional()
}).refine(data => Object.keys(data).length > 0, { message: 'empty_body' });

const createPromotionSchema = z.object({
  codigo: z.string().min(3).max(50),
  descripcion: z.string().optional(),
  tipo_descuento: z.enum(['PERCENTAGE', 'FIXED']),
  valor_descuento: z.coerce.number().positive(),
  center_id: uuidSchema.optional(),
  fecha_inicio: z.string().regex(dateRegex).optional(),
  fecha_fin: z.string().regex(dateRegex).optional(),
  uso_maximo: z.coerce.number().int().min(1).optional(),
  activo: z.boolean().optional()
});

module.exports = {
  paginationSchema,
  createCenterSchema,
  createFacilitySchema,
  availabilityQuerySchema,
  createBookingSchema,
  updateProfileSchema,
  adminUpdateUserSchema,
  createPromotionSchema
};
