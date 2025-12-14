const { supabase, adminSupabase } = require('../src/supabase');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');
const { createPromotionSchema, adminUpdateUserSchema } = require('../src/validation');
const { validate } = require('../src/validator');

const centerSummary = async (req, res) => {
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
};

const getMyCenterData = async (req, res) => {
  try {
    console.log('[GET MY CENTER] Iniciando...');
    console.log('[GET MY CENTER] req.auth:', req.auth ? 'Present' : 'Missing');
    console.log('[GET MY CENTER] req.auth.user:', req.auth?.user ? req.auth.user.id : 'Missing');
    console.log('[GET MY CENTER] req.auth.profile:', req.auth?.profile ? 'Present' : 'Missing');

    const profileId = await getUserProfileId(req);
    console.log('[GET MY CENTER] Profile ID obtenido:', profileId);

    if (!profileId) {
      console.log('[GET MY CENTER] FAIL: No profile ID');
      return res.status(401).json({ error: 'No profile found' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('center_id')
      .eq('id', profileId)
      .single();

    console.log('[GET MY CENTER] Profile data:', profile);

    if (!profile || !profile.center_id) {
      console.log('[GET MY CENTER] FAIL: No center_id in profile');
      return res.status(400).json({ error: 'No tienes un centro asignado' });
    }

    // Obtener datos del centro
    const { data: center, error: centerError } = await supabase
      .from('centers')
      .select('*')
      .eq('id', profile.center_id)
      .single();

    if (centerError || !center) {
      console.log('[GET MY CENTER] FAIL: Center not found:', centerError);
      return res.status(404).json({ error: 'Centro no encontrado' });
    }

    // Obtener instalaciones del centro
    const { data: facilities, error: facilitiesError } = await supabase
      .from('facilities')
      .select('*')
      .eq('center_id', profile.center_id);

    if (facilitiesError) {
      console.log('[GET MY CENTER] FAIL: Facilities error:', facilitiesError);
      return res.status(400).json({ error: facilitiesError.message });
    }

    // Obtener reservas del centro con información de instalación y usuario
    let bookings = [];
    let stats = {
      total_facilities: facilities?.length || 0,
      total_bookings: 0,
      revenue: 0
    };

    const facilityIds = (facilities || []).map(f => f.id);
    if (facilityIds.length > 0) {
      const { data: allBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          facility:facilities(id, nombre),
          user:profiles(id, nombre, apellidos, email)
        `)
        .in('facility_id', facilityIds)
        .order('created_at', { ascending: false });

      if (!bookingsError && allBookings) {
        // Transformar los datos para que tengan los nombres en lugar de IDs
        bookings = allBookings.map(booking => ({
          ...booking,
          instalacion: booking.facility?.nombre || 'N/A',
          usuario: booking.user ? `${booking.user.nombre} ${booking.user.apellidos}` : 'N/A',
          total_precio: booking.price_paid || booking.precio_total || 0
        }));
        stats.total_bookings = allBookings.filter(b => b.estado === 'COMPLETADA').length;
        stats.revenue = allBookings
          .filter(b => b.estado === 'COMPLETADA')
          .reduce((sum, b) => sum + (b.price_paid || b.precio_total || 0), 0);
      }
    }

    console.log('[GET MY CENTER] SUCCESS: Data retrieved');
    console.log('[GET MY CENTER] Bookings count:', bookings.length);
    res.json({
      center,
      facilities,
      bookings,
      stats
    });
  } catch (error) {
    console.log('[GET MY CENTER] CATCH ERROR:', error.message);
    res.status(500).json({ error: 'Error al obtener datos del centro: ' + error.message });
  }
};

const centerBookings = async (req, res) => {
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
};

const adminStats = async (req, res) => {
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
};

const createPromotion = [
  validate(createPromotionSchema),
  async (req, res) => {
    const client = adminSupabase || supabase;
    const payload = pick(req.body, ['codigo', 'descripcion', 'tipo_descuento', 'valor_descuento', 'center_id', 'fecha_inicio', 'fecha_fin', 'uso_maximo', 'activo']);
    const { data, error } = await client.from('promotions').insert(payload).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  }
];

const listCenters = async (req, res) => {
  const client = adminSupabase || supabase;
  const { data, error } = await client.from('centers').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getUserById = async (req, res) => {
  const client = adminSupabase || supabase;
  const { data, error } = await client.from('profiles').select('*').eq('id', req.params.id).single();
  if (error || !data) return res.status(404).json({ error: 'Not found' });
  res.json(data);
};

const updateUserById = [
  validate(adminUpdateUserSchema),
  async (req, res) => {
    const client = adminSupabase || supabase;
    const allowed = pick(req.body, ['nombre', 'telefono', 'foto_url', 'rol', 'center_id']);
    const { data, error } = await client.from('profiles').update(allowed).eq('id', req.params.id).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  }
];

module.exports = {
  centerSummary,
  centerBookings,
  getMyCenterData,
  adminStats,
  createPromotion,
  listCenters,
  getUserById,
  updateUserById
};
