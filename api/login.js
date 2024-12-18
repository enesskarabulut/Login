// api/login.js
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ortam değişkenlerini alın ve doğrulayın
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !JWT_SECRET) {
    console.error("Supabase veya JWT ortam değişkenleri eksik!");
    throw new Error("Supabase ve JWT ortam değişkenleri tanımlı olmalıdır.");
}

// Supabase istemcisini oluştur
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

module.exports = async (req, res) => {
    console.log('API /api/login called');
    console.log('Request Method:', req.method);

    // Sadece POST isteklerine izin ver
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    // Kullanıcı adı ve şifre kontrolü
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Supabase veritabanından kullanıcıyı al
        const { data, error } = await supabase
            .from('users')
            .select('id, username, password_hash')
            .eq('username', username)
            .single();

        // Kullanıcı bulunamazsa hata döndür
        if (error || !data) {
            console.error('User not found or error:', error);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Şifreyi doğrula
        const isValidPassword = await bcrypt.compare(password, data.password_hash);
        if (!isValidPassword) {
            console.error('Invalid password for user:', username);
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { id: data.id, username: data.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Başarı yanıtı döndür
        console.log('User authenticated:', username);
        return res.status(200).json({ token });

    } catch (err) {
        console.error('Internal server error:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
