const multer = require('multer');
const upload = multer().single('file');

module.exports = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Dosya yüklenemedi' });
    }
    return res.json({ message: 'Dosya başarıyla yüklendi' });
  });
};
