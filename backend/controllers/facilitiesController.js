const { supabase, adminSupabase } = require('../src/supabase');
const { getRoleFromToken } = require('../src/auth');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');

async function listByCenter(req, res) {
  const { data, error } = await supabase
    .from('facilities')
    .select('*')
    .eq('center_id', req.params.id)
    .eq('activo', true)
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function create(req, res) {
  const client = adminSupabase || supabase;
  const centerId = req.params.id;
  const role = getRoleFromToken(req);
  if (role === 'center_admin') {
    const profileId = await getUserProfileId(req);
    const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
    if (!profile || !profile.center_id || profile.center_id !== centerId) {
      return res.status(403).json({ error: 'forbidden_center' });
    }
  }
  const payload = { ...req.body, center_id: centerId };
  const { data, error } = await client.from('facilities').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

async function update(req, res) {
  const client = adminSupabase || supabase;
  const facilityId = req.params.id;
  const { data: fac, error: fErr } = await supabase.from('facilities').select('id, center_id').eq('id', facilityId).single();
  if (fErr || !fac) return res.status(404).json({ error: 'Not found' });
  const role = getRoleFromToken(req);
  if (role === 'center_admin') {
    const profileId = await getUserProfileId(req);
    const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
    if (!profile || !profile.center_id || profile.center_id !== fac.center_id) {
      return res.status(403).json({ error: 'forbidden_center' });
    }
  }
  const updates = pick(req.body, ['nombre', 'tipo', 'capacidad', 'precio_hora', 'facilitator_id', 'activo']);
  const { data, error } = await client.from('facilities').update(updates).eq('id', facilityId).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

async function remove(req, res) {
  const client = adminSupabase || supabase;
  const facilityId = req.params.id;
  const { data: fac, error: fErr } = await supabase.from('facilities').select('id, center_id').eq('id', facilityId).single();
  if (fErr || !fac) return res.status(404).json({ error: 'Not found' });
  const role = getRoleFromToken(req);
  if (role === 'center_admin') {
    const profileId = await getUserProfileId(req);
    const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
    if (!profile || !profile.center_id || profile.center_id !== fac.center_id) {
      return res.status(403).json({ error: 'forbidden_center' });
    }
  }
  const { error } = await client.from('facilities').delete().eq('id', facilityId);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
}

module.exports = { listByCenter, create, update, remove };
