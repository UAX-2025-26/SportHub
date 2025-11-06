const { supabase, adminSupabase } = require('../src/supabase');
const { getRoleFromToken } = require('../src/auth');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');

async function list(req, res) {
  const { data, error } = await supabase.from('centers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function detail(req, res) {
  const { data, error } = await supabase.from('centers').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
}

async function create(req, res) {
  const client = adminSupabase || supabase;
  const { data, error } = await client.from('centers').insert(req.body).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

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

module.exports = { list, detail, create, update };
