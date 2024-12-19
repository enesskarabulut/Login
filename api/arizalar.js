const authMiddleware = require('../middleware/authMiddleware'); // Middleware ekleniyor
const {
  getArizalar,
  getArizaById,
  createNewAriza,
  updateArizaRecord,
  deleteArizaById,
  addDokumanToAriza,
} = require('../utils/supabase');

module.exports = async (req, res) => {
  const { method } = req;
  const { id } = req.query; // Query parametresinden ID alıyoruz 
  try {
    // Middleware ile token doğrulaması yap
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // GET: Tüm arızaları veya tek bir arıza detayını getir
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

      if (status === 'ileri tarihli' && !tarih) {
        return res.status(400).json({ message: 'İleri tarihli arıza için tarih zorunludur.' });
      }

      const yeniAriza = await createNewAriza({
        adres,
        usta,
        status: status || 'işleme alındı',
        ucret,
        detay,
        tarih: status === 'ileri tarihli' ? tarih : null,
      });

      return res.status(201).json(yeniAriza);
    }

    // PUT: Arıza güncelle
    if (method === 'PUT') {
      const { adres, usta, status, ucret, detay, tarih } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Arıza ID gereklidir.' });
      }

      if (status === 'ileri tarihli' && !tarih) {
        return res.status(400).json({ message: 'İleri tarihli arıza için tarih zorunludur.' });
      }

      const updatedAriza = await updateArizaRecord(id, {
        adres,
        usta,
        status,
        ucret,
        detay,
        tarih: status === 'ileri tarihli' ? tarih : null,
      });

      if (!updatedAriza) {
        return res.status(404).json({ message: 'Güncellenecek arıza bulunamadı.' });
      }

      return res.status(200).json(updatedAriza);
    }

    // DELETE: Arıza silme
    if (method === 'DELETE') {
      
      if (!id) {
        return res.status(400).json({ message: 'Arıza ID gereklidir.' });
      }

      const deletedAriza = await deleteArizaById(id);
      if (!deletedAriza) {
        return res.status(404).json({ message: 'Silinecek arıza bulunamadı.' });
      }

      return res.json({ message: 'Arıza başarıyla silindi.' });
    }

    // PATCH: Arızaya döküman ekle
    if (method === 'PATCH') {
      const { filePath } = req.body;

      if (!id || !filePath) {
        return res.status(400).json({ message: 'Arıza ID ve dosya yolu gereklidir.' });
      }

      const updatedAriza = await addDokumanToAriza(id, filePath);
      if (!updatedAriza) {
        return res.status(404).json({ message: 'Arıza bulunamadı veya dosya eklenemedi.' });
      }

      return res.json({ message: 'Doküman başarıyla eklendi.', ariza: updatedAriza });
    }

    // Method desteklenmiyorsa
    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Hata:', error.message);
    return res.status(500).json({ message: 'Sunucu hatası' });
  }
};
