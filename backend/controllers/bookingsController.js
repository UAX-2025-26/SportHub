const { supabase } = require('../src/supabase');
const dayjs = require('dayjs');
const { getUserProfileId } = require('../utils/user.js');

async function availability(req, res) {
  const facilityId = req.params.id;
  const fecha = req.query.fecha;
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, hora_inicio, estado')
    .eq('facility_id', facilityId)
    .eq('fecha', fecha)
    .neq('estado', 'CANCELLED');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ date: fecha, bookings });
}

async function create(req, res) {
  const profileId = await getUserProfileId(req);
  if (!profileId) return res.status(400).json({ error: 'profile_id_missing' });
  const payload = { ...req.body, user_id: profileId };
  const { data, error } = await supabase.from('bookings').insert(payload).select('*').single();
  if (error) {
    const msg = error.message || '';
    const lower = msg.toLowerCase();
    if (lower.includes('duplicate key') || lower.includes('unique')) {
      return res.status(409).json({ error: 'duplicate_booking' });
    }
    return res.status(400).json({ error: msg });
  }
  res.status(201).json(data);
}

async function list(req, res) {
  const profileId = await getUserProfileId(req);
  const usuarioId = req.query ? req.query.usuarioId : undefined;
  const centroId = req.query ? req.query.centroId : undefined;
  let query = supabase.from('bookings').select('*');
  if (usuarioId) {
    query = query.eq('user_id', usuarioId);
  } else if (centroId) {
    const { data: facs, error: facErr } = await supabase.from('facilities').select('id').eq('center_id', centroId);
    if (facErr) return res.status(400).json({ error: facErr.message });
    const ids = (facs || []).map(f => f.id);
    if (ids.length === 0) return res.json([]);
    query = query.in('facility_id', ids);
  } else if (profileId) {
    query = query.eq('user_id', profileId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

async function cancel(req, res) {
  const profileId = await getUserProfileId(req);
  if (!profileId) return res.status(400).json({ error: 'profile_id_missing' });
  const { data, error } = await supabase
    .from('bookings')
    .update({ estado: 'CANCELLED', cancelled_at: dayjs().toISOString() })
    .eq('id', req.params.id)
    .eq('user_id', profileId)
    .select('*')
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true, booking: data });
}

module.exports = { availability, create, list, cancel };
