const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>" formatında alır

  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz: Token gerekli' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Doğrulanan kullanıcıyı request'e ekle
    next(); // Bir sonraki middleware veya route'a devam et
  } catch (error) {
    return res.status(401).json({ message: 'Yetkisiz: Geçersiz token' });
  }
};
