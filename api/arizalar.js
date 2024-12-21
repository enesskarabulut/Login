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
        binaNo,
        daireNo,
        usta,
        status,
        ucret,
        tarih,
        page = 1,
        limit = 10
      } = req.query;

      console.log('---- Filtre Parametreleri ----');
      console.log('status (raw):', status);

      if (id) {
        const ariza = await getArizaById(id);
        if (!ariza) {
          return res.status(404).json({ message: 'Arıza bulunamadı.' });
        }
        return res.json(ariza);
      }

      const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      let query = supabase.from('arizalar').select('*', { count: 'exact' });

      if (name) query = query.ilike('name', `%${name}%`);
      if (surname) query = query.ilike('surname', `%${surname}%`);
      if (msisdn) query = query.ilike('msisdn', `%${msisdn}%`);
      if (il) query = query.ilike('il', `%${il}%`);
      if (ilce) query = query.ilike('ilce', `%${ilce}%`);
      if (mahalle) query = query.ilike('mahalle', `%${mahalle}%`);
      if (binaNo) query = query.ilike('binaNo', `%${binaNo}%`);
      if (daireNo) query = query.ilike('daireNo', `%${daireNo}%`);
      if (usta) query = query.ilike('usta', `%${usta}%`);

      // + -> ' ' değişimi ve trim
      if (status && status.trim() !== '') {
        let replaced = status.replace(/\+/g, ' ');
        replaced = replaced.trim();

        console.log('Status (after replace & trim):', replaced);
        query = query.eq('status', replaced);
      }

      if (ucret) query = query.eq('ucret', ucret);
      if (tarih) query = query.eq('tarih', tarih);

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
        il, ilce, mahalle, binaNo, daireNo,
        usta, status, ucret, detay, tarih,
        name, surname, msisdn
      } = req.body;

      // Zorunlu alanlar
      if (!il || !ilce || !mahalle || !binaNo || !daireNo || !usta || !name || !surname || !msisdn) {
        return res.status(400).json({
          message: 'İl, ilçe, mahalle, bina no, daire no, usta, müşteri adı, soyadı ve telefon numarası zorunludur.'
        });
      }

      const yeniAriza = await createNewAriza({
        il,
        ilce,
        mahalle,
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
        il, ilce, mahalle, binaNo, daireNo,
        usta, status, ucret, detay, tarih,
        name, surname, msisdn
      } = req.body;

      if (!il || !ilce || !mahalle || !binaNo || !daireNo || !usta || !name || !surname || !msisdn) {
        return res.status(400).json({
          message: 'İl, ilçe, mahalle, bina no, daire no, usta, müşteri adı, soyadı ve telefon numarası zorunludur.'
        });
      }

      const updates = {
        il,
        ilce,
        mahalle,
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
        // Dosya yolu oluştur
        const filePath = `uploads/${id}/${Date.now()}_${file.name}`;

        // Dosyayı Supabase Storage'a yükle
        const { error: uploadError } = await supabase.storage
          .from('ariza-dokumanlar')
          .upload(filePath, Buffer.from(file.content, 'base64'), {
            contentType: 'application/pdf',
            upsert: true
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
