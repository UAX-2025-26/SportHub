const { supabase, adminSupabase } = require('../src/supabase');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');

async function centerSummary(req, res) {
  const profileId = await getUserProfileId(req);
  const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
  if (!profile || !profile.center_id) return res.status(400).json({ error: 'center_id_missing' });
  const { data: facs, error: facErr } = await supabase.from('facilities').select('id').eq('center_id', profile.center_id);
  if (facErr) return res.status(400).json({ error: facErr.message });
  const ids = (facs || []).map(x => x.id);
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .in('facility_id', ids)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ center_id: profile.center_id, recent: data });
}

async function centerBookings(req, res) {
  const profileId = await getUserProfileId(req);
  const { data: profile } = await supabase.from('profiles').select('center_id').eq('id', profileId).single();
  if (!profile || !profile.center_id) return res.status(400).json({ error: 'center_id_missing' });
  const { data: facs, error: facErr } = await supabase.from('facilities').select('id').eq('center_id', profile.center_id);
  if (facErr) return res.status(400).json({ error: facErr.message });
  const ids = (facs || []).map(x => x.id);
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .in('facility_id', ids)
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

async function adminStats(req, res) {
  const client = adminSupabase || supabase;
  const [bookings, centers, users] = await Promise.all([
    client.from('bookings').select('id', { count: 'exact', head: true }),
    client.from('centers').select('id', { count: 'exact', head: true }),
    client.from('profiles').select('id', { count: 'exact', head: true })
  ]);
  res.json({
    bookings: bookings && bookings.count ? bookings.count : 0,
    centers: centers && centers.count ? centers.count : 0,
    users: users && users.count ? users.count : 0
  });
}

async function createPromotion(req, res) {
  const client = adminSupabase || supabase;
  const payload = pick(req.body, ['codigo', 'descripcion', 'tipo_descuento', 'valor_descuento', 'center_id', 'fecha_inicio', 'fecha_fin', 'uso_maximo', 'activo']);
  const { data, error } = await client.from('promotions').insert(payload).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
}

async function listCenters(req, res) {
  const client = adminSupabase || supabase;
  const { data, error } = await client.from('centers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

async function getUserById(req, res) {
  const client = adminSupabase || supabase;
  const { data, error } = await client.from('profiles').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
}

async function updateUserById(req, res) {
  const client = adminSupabase || supabase;
  const allowed = pick(req.body, ['nombre', 'telefono', 'foto_url', 'rol', 'center_id']);
  const { data, error } = await client.from('profiles').update(allowed).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

module.exports = {
  centerSummary,
  centerBookings,
  adminStats,
  createPromotion,
  listCenters,
  getUserById,
  updateUserById
};
