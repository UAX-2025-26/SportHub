const { supabase } = require('../src/supabase');
const { getRoleFromToken } = require('../src/auth');
const { getUserProfileId } = require('../utils/user.js');
const { pick } = require('../utils/pick.js');
const { updateProfileSchema } = require('../src/validation');
const { validate } = require('../src/validator');

async function me(req, res) {
  const profileId = await getUserProfileId(req);
  if (!profileId) return res.status(400).json({ error: 'profile_id_missing' });
  const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single();
  if (error || !data) return res.status(404).json({ error: 'Not found' });
  res.json({ ...data, role: getRoleFromToken(req) });
}

const updateMe = [
  validate(updateProfileSchema),
  async (req, res) => {
    const profileId = await getUserProfileId(req);
    if (!profileId) return res.status(400).json({ error: 'profile_id_missing' });
    const updates = pick(req.body, ['nombre', 'telefono', 'foto_url']);
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', profileId).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  }
];

module.exports = { me, updateMe };
