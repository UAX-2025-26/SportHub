const { supabase, adminSupabase } = require('../src/supabase');
const { getRoleFromToken } = require('../src/auth');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');
const { paginationSchema, createCenterSchema } = require('../src/validation');
const { validate } = require('../src/validator');

const list = [
  validate(paginationSchema, 'query'),
  async (req, res) => {
    const { limit, offset } = req.query;
    const { data, error } = await supabase
      .from('centers')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  }
];

async function detail(req, res) {
  const { data, error } = await supabase.from('centers').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
}

const create = [
  validate(createCenterSchema),
  async (req, res) => {
    const client = adminSupabase || supabase;
    const role = getRoleFromToken(req);
    const profileId = await getUserProfileId(req);

    // Si es center_admin, solo puede crear un centro y se asigna a sí mismo
    if (role === 'center_admin') {
      // Verificar si ya tiene un centro asignado
      const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
      if (profile && profile.center_id) {
        return res.status(400).json({ error: 'Ya tienes un centro asignado. No puedes crear otro.' });
      }

      // Crear el centro con el admin_user_id del usuario actual
      const centerData = {
        ...req.body,
        admin_user_id: profileId
      };

      const { data: center, error: centerError } = await client
        .from('centers')
        .insert(centerData)
        .select('*')
        .single();

      if (centerError) return res.status(400).json({ error: centerError.message });

      // Asignar el centro al perfil del usuario
      const { error: profileError } = await client
        .from('profiles')
        .update({ center_id: center.id })
        .eq('id', profileId);

      if (profileError) {
        // Si falla la asignación del centro al perfil, eliminar el centro creado
        await client.from('centers').delete().eq('id', center.id);
        return res.status(400).json({ error: 'Error al asignar centro al perfil' });
      }

      res.status(201).json(center);
    } else if (role === 'admin') {
      // Los admins globales pueden crear centros normalmente
      const { data, error } = await client.from('centers').insert(req.body).select('*').single();
      if (error) return res.status(400).json({ error: error.message });
      res.status(201).json(data);
    } else {
      return res.status(403).json({ error: 'No tienes permiso para crear centros' });
    }
  }
];

async function update(req, res) {
  const client = adminSupabase || supabase;
  const role = getRoleFromToken(req);
  const centerId = req.params.id;
  if (role === 'center_admin') {
    const profileId = await getUserProfileId(req);
    const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
    if (!profile || !profile.center_id || profile.center_id !== centerId) {
      return res.status(403).json({ error: 'forbidden_center' });
    }
  }
  const updates = pick(req.body, ['nombre', 'direccion', 'ciudad', 'admin_user_id', 'horario_apertura', 'horario_cierre']);
  const { data, error } = await client.from('centers').update(updates).eq('id', centerId).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

async function deletCenter(req, res) {
  const client = adminSupabase || supabase;
  const role = getRoleFromToken(req);
  const centerId = req.params.id;

  // Verificar permisos
  if (role === 'center_admin') {
    const profileId = await getUserProfileId(req);
    const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
    if (!profile || !profile.center_id || profile.center_id !== centerId) {
      return res.status(403).json({ error: 'forbidden_center' });
    }
  } else if (role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para eliminar centros' });
  }

  // Eliminar instalaciones asociadas primero (por cascada, pero mejor ser explícito)
  const { error: facilitiesError } = await client
    .from('facilities')
    .delete()
    .eq('center_id', centerId);

  if (facilitiesError) {
    return res.status(400).json({ error: 'Error al eliminar instalaciones: ' + facilitiesError.message });
  }

  // Desasignar el centro de los perfiles
  const { error: profileError } = await client
    .from('profiles')
    .update({ center_id: null })
    .eq('center_id', centerId);

  if (profileError) {
    return res.status(400).json({ error: 'Error al desasignar centro: ' + profileError.message });
  }

  // Eliminar el centro
  const { error } = await client.from('centers').delete().eq('id', centerId);

  if (error) return res.status(400).json({ error: error.message });

  res.json({ ok: true, message: 'Centro eliminado correctamente' });
}

module.exports = { list, detail, create, update, deletCenter };
