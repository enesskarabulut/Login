const authMiddleware = require('../middleware/authMiddleware');
const { supabase } = require('../utils/supabase');
const {
  getArizalar,
  getArizaById,
  createNewAriza,
  updateArizaRecord,
  deleteArizaById,
} = require('../utils/supabase');

module.exports = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  try {
    // Middleware ile token doğrulaması
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // GET: Tüm arızalar veya bir arızayı getir
    if (method === 'GET') {
      if (id) {
        const ariza = await getArizaById(id);
        if (!ariza) {
          return res.status(404).json({ message: 'Arıza bulunamadı.' });
        }
        return res.json(ariza);
      }
      const { status } = req.query;
      const arizalar = await getArizalar(status);
      return res.json(arizalar);
    }

    // POST: Yeni arıza oluştur
    if (method === 'POST') {
      const { adres, usta, status, ucret, detay, tarih } = req.body;
      if (!adres || !usta) {
        return res.status(400).json({ message: 'Adres ve usta bilgisi zorunludur.' });
      }

      const yeniAriza = await createNewAriza({
        adres,
        usta,
        status: status || 'işleme alındı',
        ucret,
        detay,
        tarih,
        dokuman: null, // Yeni arıza için doküman başlangıçta boş
      });

      return res.status(201).json(yeniAriza);
    }

    // PUT: Arıza güncelle
    if (method === 'PUT') {
      if (!id) {
        return res.status(400).json({ message: 'Arıza ID gereklidir.' });
      }

      const { adres, usta, status, ucret, detay, tarih } = req.body;
      const updates = {
        adres,
        usta,
        status,
        ucret: ucret ? Number(ucret) : null,
        detay,
        tarih,
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
          .upload(filePath, Buffer.from(file.content, 'base64'));

        if (uploadError) {
          console.error('Dosya yükleme hatası:', uploadError.message);
          return res.status(500).json({ message: 'Dosya yükleme başarısız.', error: uploadError.message });
        }

        // Public URL oluştur
        const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/ariza-dokumanlar/${filePath}`;
        console.log('Public URL:', publicURL);

        // Mevcut dokümanları al, yeni URL'yi ekle
        const ariza = await getArizaById(id);
        let dokumanlar = ariza.dokuman ? ariza.dokuman.split(',') : []; // Mevcut dokümanları diziye çevir
        dokumanlar.push(publicURL); // Yeni URL'yi ekle
        const updatedDokuman = dokumanlar.join(','); // Diziyi stringe dönüştür

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

    // Desteklenmeyen metod
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Hata:', error.message);
    return res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};
