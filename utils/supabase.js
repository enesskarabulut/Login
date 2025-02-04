const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tüm arızaları getirme
async function getArizalar(status, offset = 0, limit = 10) {
  let query = supabase
    .from('arizalar') // Tablonuzun adı
    .select('*') // Tüm sütunları seç
    .order('id', { ascending: false }) // En son kayıtları en üstte göster
    .range(offset, offset + limit - 1); // Sayfalama için aralık belirle

  if (status) {
    const decodedStatus = decodeURIComponent(status).replace(/\+/g, ' ');
    query = query.ilike('status', decodedStatus); // Status'e göre filtrele
  }

  const { data, error } = await query;

  if (error) {
    console.error('Supabase Hatası:', error.message);
    throw error;
  }
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

async function updateArizaRecord(id, updates) {
  const { data, error } = await supabase
    .from('arizalar') // Tablonun adı
    .update(updates)
    .eq('id', id) // Doğru ID'yi eşle
    .select()
    .single(); // Tek bir satır döndürmesini sağlar

  if (error) {
    console.error('Güncelleme hatası:', error.message);
    return null;
  }
  return data;
}



// Arıza silme
async function deleteArizaById(id) {
  const { data, error } = await supabase.from('arizalar').delete().eq('id', id).select().single();
  if (error) return null;
  return data;
}

// Arızaya doküman ekleme - Supabase Storage kullanarak
async function addDokumanToAriza(id, file) {
  const ariza = await getArizaById(id);
  if (!ariza) return null;

  const filePath = `uploads/arizalar/${id}/${Date.now()}_${file.originalname}`;
  
  // Dosyayı Supabase Storage'a yükle
  const { error: uploadError } = await supabase.storage
    .from('ariza-dokumanlar')
    .upload(filePath, file.buffer);

  if (uploadError) {
    console.error('Dosya yükleme hatası:', uploadError.message);
    throw new Error('Dosya yükleme başarısız.');
  }

  // Public URL'i al
  const { data: publicUrlData } = supabase.storage.from('ariza-dokumanlar').getPublicUrl(filePath);
  const publicUrl = publicUrlData.publicUrl;

  // Doküman URL'sini arıza kaydına ekle
  const dokumanlar = ariza.dokumanlar || [];
  dokumanlar.push(publicUrl);

  const { data, error } = await supabase
    .from('arizalar')
    .update({ dokumanlar })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Arıza kaydına doküman ekleme hatası:', error.message);
    return null;
  }

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
