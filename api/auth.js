const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../utils/supabase');
const bcrypt = require('bcrypt');

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Kullanıcı adı ve şifre gereklidir.' });
  }

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
  }

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Kullanıcı adı veya şifre hatalı.' });
  }

  // JWT oluştur
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Token'i response body'ye ekle
  return res.status(200).json({ message: 'Giriş başarılı.', token });
};
