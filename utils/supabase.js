const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tüm arızaları getirme
async function getArizalar(status) {
  let query = supabase.from('arizalar').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Tek bir arıza getirme
async function getArizaById(id) {
  const { data, error } = await supabase.from('arizalar').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

// Yeni arıza oluşturma
async function createNewAriza(ariza) {
  const { data, error } = await supabase.from('arizalar').insert([ariza]).select().single();
  if (error) throw error;
  return data;
}

// Arıza güncelleme
async function updateArizaRecord(id, updates) {
  const { data, error } = await supabase.from('arizalar').update(updates).eq('id', id).select().single();
  if (error) return null;
  return data;
}

// Arıza silme
async function deleteArizaById(id) {
  const { data, error } = await supabase.from('arizalar').delete().eq('id', id).select().single();
  if (error) return null;
  return data;
}

// Arızaya döküman ekleme
async function addDokumanToAriza(id, filePath) {
  const ariza = await getArizaById(id);
  if (!ariza) return null;

  const dokumanlar = ariza.dokumanlar || [];
  dokumanlar.push(filePath);

  const { data, error } = await supabase.from('arizalar').update({ dokumanlar }).eq('id', id).select().single();
  if (error) return null;
  return data;
}

module.exports = {
  supabase,
  getArizalar,
  getArizaById,
  createNewAriza,
  updateArizaRecord,
  deleteArizaById,
  addDokumanToAriza,
};
