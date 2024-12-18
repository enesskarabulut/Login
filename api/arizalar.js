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
  
    try {
      // GET: Tüm arızaları getir veya tek bir arıza detayı getir
      if (method === 'GET') {
        const { id, status } = req.query;
  
        if (id) {
          // Tek bir arıza detayı
          const ariza = await getArizaById(id);
          if (!ariza) {
            return res.status(404).json({ message: 'Arıza bulunamadı.' });
          }
          return res.json(ariza);
        }
  
        // Tüm arızaları getir
        const arizalar = await getArizalar(status);
        return res.json(arizalar);
      }
  
      // POST: Yeni arıza oluştur
      if (method === 'POST') {
        const { adres, usta, status, ücret, detay } = req.body;
  
        if (!adres || !usta) {
          return res.status(400).json({ message: 'Adres ve usta bilgisi zorunludur.' });
        }
  
        const yeniAriza = await createNewAriza({ adres, usta, status, ücret, detay });
        return res.status(201).json(yeniAriza);
      }
  
      // PUT: Arıza güncelle
      if (method === 'PUT') {
        const { id } = req.query;
        const { adres, usta, status, ücret, detay } = req.body;
  
        if (!id) {
          return res.status(400).json({ message: 'Arıza ID gereklidir.' });
        }
  
        const updatedAriza = await updateArizaRecord(id, { adres, usta, status, ücret, detay });
        if (!updatedAriza) {
          return res.status(404).json({ message: 'Güncellenecek arıza bulunamadı.' });
        }
  
        return res.json(updatedAriza);
      }
  
      // DELETE: Arıza sil
      if (method === 'DELETE') {
        const { id } = req.query;
  
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
        const { id } = req.query;
        const filePath = req.body.filePath; // Dosya yolu
  
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
  