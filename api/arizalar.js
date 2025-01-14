const authMiddleware = require('../middleware/authMiddleware');
const { supabase } = require('../utils/supabase');
const {
  getArizaById,
  createNewAriza,
  updateArizaRecord,
  deleteArizaById,
} = require('../utils/supabase');

module.exports = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  try {
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (method === 'GET') {
      const {
        name,
        surname,
        msisdn,
        il,
        ilce,
        mahalle,
        sokak,
        binaNo,
        daireNo,
        usta,
        status,
        ucretAraligi, // Yeni: Fiyat aralığı filtresi
        tarih,
        page = 1,
        limit = 10,
      } = req.query;
    
      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      let query = supabase.from('arizalar').select('*', { count: 'exact' });
    
      if (name) query = query.ilike('name', `%${name}%`);
      if (surname) query = query.ilike('surname', `%${surname}%`);
      if (msisdn) query = query.ilike('msisdn', `%${msisdn}%`);
      if (il) query = query.ilike('il', `%${il}%`);
      if (ilce) query = query.ilike('ilce', `%${ilce}%`);
      if (mahalle) query = query.ilike('mahalle', `%${mahalle}%`);
      if (sokak) query = query.ilike('sokak', `%${sokak}%`);
      if (binaNo) query = query.ilike('binaNo', `%${binaNo}%`);
      if (daireNo) query = query.ilike('daireNo', `%${daireNo}%`);
      if (usta) query = query.ilike('usta', `%${usta}%`);
    
      // + -> ' ' değişimi ve trim
      if (status && status.trim() !== '') {
        let replaced = status.replace(/\+/g, ' ');
        replaced = replaced.trim();
        query = query.eq('status', replaced);
      }
    
      // Fiyat aralığı filtresi
      if (ucretAraligi) {
        switch (ucretAraligi) {
          case '1-50':
            query = query.gte('ucret', 1).lte('ucret', 50);
            break;
          case '50-250':
            query = query.gte('ucret', 50).lte('ucret', 250);
            break;
          case '250-500':
            query = query.gte('ucret', 250).lte('ucret', 500);
            break;
          case '500+':
            query = query.gte('ucret', 500);
            break;
          default:
            break;
        }
      }
    
      if (tarih) query = query.eq('tarih', tarih);
    
      // Burada DESC sıralama ekleniyor
      query = query.order('id', { ascending: false }); // ID'ye göre azalan sıralama
      query = query.range(offset, offset + parseInt(limit, 10) - 1);
    
      const { data: arizalar, error } = await query;
      if (error) {
        console.error('Hata:', error);
        return res.status(500).json({ message: 'Veri çekilirken hata oluştu', error: error.message });
      }
    
      const arizaListesi = arizalar.map((ariza) => ({
        id: ariza.id,
        il: ariza.il,
        ilce: ariza.ilce,
        mahalle: ariza.mahalle,
        sokak: ariza.sokak,
        binaNo: ariza.binaNo,
        daireNo: ariza.daireNo,
        usta: ariza.usta,
        status: ariza.status,
        ucret: ariza.ucret,
        detay: ariza.detay,
        tarih: ariza.tarih,
        name: ariza.name,
        surname: ariza.surname,
        msisdn: ariza.msisdn,
        dokuman: ariza.dokuman,
      }));
    
      return res.status(200).json(arizaListesi);
    }
    

    // POST: Yeni arıza oluştur
    if (method === 'POST') {
      const {
        il,
        ilce,
        mahalle,
        sokak, // Sokak parametresi eklendi
        binaNo,
        daireNo,
        usta,
        status,
        ucret,
        detay,
        tarih,
        name,
        surname,
        msisdn,
      } = req.body;

      // Zorunlu alanlar
      if (!il || !ilce || !mahalle || !sokak || !binaNo || !daireNo || !usta || !name || !surname || !msisdn) {
        return res.status(400).json({
          message: 'İl, ilçe, mahalle, sokak, bina no, daire no, usta, müşteri adı, soyadı ve telefon numarası zorunludur.',
        });
      }

      const yeniAriza = await createNewAriza({
        il,
        ilce,
        mahalle,
        sokak, // Sokak bilgisi burada kullanılıyor
        binaNo,
        daireNo,
        usta,
        status: status || 'işleme alındı',
        ucret,
        detay,
        tarih,
        name,
        surname,
        msisdn,
        dokuman: null,
      });

      return res.status(201).json(yeniAriza);
    }

    // PUT: Arıza güncelle
    if (method === 'PUT') {
      if (!id) {
        return res.status(400).json({ message: 'Arıza ID gereklidir.' });
      }

      const {
        il,
        ilce,
        mahalle,
        sokak, // Sokak parametresi eklendi
        binaNo,
        daireNo,
        usta,
        status,
        ucret,
        detay,
        tarih,
        name,
        surname,
        msisdn,
      } = req.body;

      if (!il || !ilce || !mahalle || !sokak || !binaNo || !daireNo || !usta || !name || !surname || !msisdn) {
        return res.status(400).json({
          message: 'İl, ilçe, mahalle, sokak, bina no, daire no, usta, müşteri adı, soyadı ve telefon numarası zorunludur.',
        });
      }

      const updates = {
        il,
        ilce,
        mahalle,
        sokak, // Güncelleme sırasında sokak bilgisi ekleniyor
        binaNo,
        daireNo,
        usta,
        status: status ? status.trim() : 'işleme alındı',
        ucret: ucret ? Number(ucret) : null,
        detay,
        tarih,
        name,
        surname,
        msisdn,
      };

      const updatedAriza = await updateArizaRecord(id, updates);
      if (!updatedAriza) {
        return res.status(404).json({ message: 'Güncellenecek arıza bulunamadı.' });
      }

      return res.status(200).json({ message: 'Arıza başarıyla güncellendi.', ariza: updatedAriza });
    }


// PATCH: Supabase Storage'a dosya yükle ve dokümanları güncelle
if (method === 'PATCH') {
  const { file } = req.body;

  if (!id || !file) {
    return res.status(400).json({ message: 'Arıza ID ve dosya gereklidir.' });
  }

  try {
    // Dosyanın içerik türünü belirlemek için contentType'ı alın
    const contentType = file.contentType || 'application/octet-stream'; // Varsayılan bir içerik türü

    // Dosya yolu oluştur
    const filePath = `uploads/${id}/${Date.now()}_${file.name}`;

    // Dosyayı Supabase Storage'a yükle
    const { error: uploadError } = await supabase.storage
      .from('ariza-dokumanlar')
      .upload(filePath, Buffer.from(file.content, 'base64'), {
        contentType, // Dinamik içerik türü
        upsert: true // Aynı isimde dosya varsa üzerine yazılmasını isterseniz
      });

    if (uploadError) {
      console.error('Dosya yükleme hatası:', uploadError.message);
      return res.status(500).json({ message: 'Dosya yükleme başarısız.', error: uploadError.message });
    }

    // Public URL oluştur
    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/ariza-dokumanlar/${filePath}`;
    console.log('Public URL:', publicURL);

    // Mevcut dokümanları güncelle
    const ariza = await getArizaById(id);
    let dokumanlar = ariza.dokuman ? ariza.dokuman.split(',') : [];
    dokumanlar.push(publicURL);
    const updatedDokuman = dokumanlar.join(',');

    // Arıza kaydını güncelle
    const updateResponse = await updateArizaRecord(id, { dokuman: updatedDokuman });

    if (!updateResponse) {
      return res.status(500).json({ message: 'Döküman kaydedilemedi.' });
    }

    return res.status(200).json({
      message: 'Dosya başarıyla yüklendi.',
      dokumanURL: publicURL,
      ariza: updateResponse,
    });
  } catch (error) {
    console.error('Sunucu hatası:', error.message);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}

    // DELETE: Arıza silme
    if (method === 'DELETE') {
      if (!id) {
        return res.status(400).json({ message: 'Arıza ID zorunludur.' });
      }

      const deletedAriza = await deleteArizaById(id);
      if (!deletedAriza) {
        return res.status(404).json({ message: 'Silinecek arıza bulunamadı.' });
      }

      return res.json({ message: 'Arıza başarıyla silindi.' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Hata:', error.message);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
