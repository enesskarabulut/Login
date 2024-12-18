const { createClient } = require('@supabase/supabase-js');

// Ortam değişkenlerinden URL ve Anonim Anahtarını al
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tüm arızaları getirme (Opsiyonel olarak status filtresi)
async function getArizalar(status) {
  let query = supabase.from('arizalar').select('*');
  if (status) {
    query = query.eq('status', status);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
}

// Tek bir arıza detayı getirme
async function getArizaById(id) {
  const { data, error } = await supabase
    .from('arizalar')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

// Yeni arıza oluşturma
async function createNewAriza({ adres, usta, status, ücret, detay }) {
  const { data, error } = await supabase
    .from('arizalar')
    .insert([{ adres, usta, status, ücret, detay, dokumanlar: [] }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Arıza güncelleme
async function updateArizaRecord(id, updates) {
  const { data, error } = await supabase
    .from('arizalar')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data;
}

async function deleteArizaById(id) {
  const { data, error } = await supabase
    .from('arizalar')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

// Arızaya döküman ekleme
async function addDokumanToAriza(id, path) {
  const ariza = await getArizaById(id);
  if (!ariza) return null;

  const dokumanlar = ariza.dokumanlar || [];
  dokumanlar.push(path);

  const { data, error } = await supabase
    .from('arizalar')
    .update({ dokumanlar })
    .eq('id', id)
    .select()
    .single();

  if (error) return null;
  return data;
}

module.exports = {
  getArizalar,
  getArizaById,
  createNewAriza,
  updateArizaRecord,
  deleteArizaById,
  addDokumanToAriza,
};
