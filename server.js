const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'kunci-rahasia-kontrakan-aldhica-yang-super-aman',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 60 * 60 * 1000 
    }
}));

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'loginsystem'
});

db.connect((err) => {
    if (err) {
        console.error('Koneksi ke database GAGAL:', err.stack);
        return;
    }
    console.log('Berhasil terhubung ke database MySQL dengan ID ' + db.threadId);
});


app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi.' });
    }
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' }); }
        if (result.length > 0) { return res.status(409).json({ success: false, message: 'Email yang Anda masukkan sudah terdaftar.' }); }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username: name, email: email, phone: phone, password: hashedPassword };
        db.query('INSERT INTO users SET ?', newUser, (err, result) => {
            if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Gagal mendaftarkan pengguna.' }); }
            res.status(201).json({ success: true, message: 'Registrasi berhasil! Anda akan diarahkan ke halaman login.' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(400).json({ success: false, message: 'Email dan password wajib diisi.' }); }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' }); }
        if (result.length === 0) { return res.status(401).json({ success: false, message: 'Kombinasi Email atau password salah.' }); }
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.save(err => {
                if(err) { return res.status(500).json({ success: false, message: 'Gagal menyimpan sesi login.' }); }
                res.json({ success: true, message: 'Login berhasil! Mengarahkan ke dashboard...' });
            });
        } else {
            res.status(401).json({ success: false, message: 'Kombinasi Email atau password salah.' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) { return res.status(500).json({ success: false, message: 'Gagal untuk logout.' }); }
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logout berhasil.' });
    });
});

const isAuth = (req, res, next) => {
    if(req.session.isLoggedIn){ next(); } 
    else { res.redirect('/login.html'); }
}

app.get('/', isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log("Gunakan Ctrl+C untuk menghentikan server.");
});