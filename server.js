// ==========================================================
// ==    SERVER.JS - VERSI FINAL, LENGKAP, DAN UTUH        ==
// ==========================================================

// 1. IMPORT SEMUA MODUL YANG DIBUTUHKAN
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// 2. INISIALISASI & KONFIGURASI
const app = express();
const port = 3000;

// Konfigurasi Multer untuk penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Middleware untuk menyajikan file statis, membaca JSON, dan data form
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk sesi
app.use(session({
    secret: 'kunci-rahasia-kontrakan-aldhica-yang-super-aman',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, 
        httpOnly: true,
        maxAge: 3600000 // 1 jam
    }
}));

// 3. KONEKSI KE DATABASE
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

// 4. DEFINISI MIDDLEWARE OTENTIKASI & OTORISASI
const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return next();
    }
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(401).json({ message: 'Akses ditolak. Anda harus login.' });
    }
    return res.redirect('/login.html');
};

const isAdmin = (req, res, next) => {
    if (req.session.role === 'admin') {
        return next();
    }
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(403).json({ message: 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.' });
    }
    return res.status(403).send('<h1>403 Forbidden</h1><p>Anda tidak memiliki akses ke halaman ini.</p>');
};

// ==========================================================
// ==                5. ENDPOINTS API                      ==
// ==========================================================

// --- API untuk Autentikasi ---
app.post('/api/register', async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ message: 'Terjadi kesalahan pada server.' }); }
        if (result.length > 0) return res.status(409).json({ message: 'Email sudah terdaftar.' });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { username: name, email, phone, password: hashedPassword }; 
        
        db.query('INSERT INTO users SET ?', newUser, (err, result) => {
            if (err) { console.error(err); return res.status(500).json({ message: 'Gagal mendaftarkan pengguna.' }); }
            res.status(201).json({ message: 'Registrasi berhasil!' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    
    db.query('SELECT id, username, email, password, role FROM users WHERE email = ?', [email], async (err, result) => {
        if (err || result.length === 0) return res.status(401).json({ message: 'Kombinasi Email atau password salah.' });
        
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.role = user.role;
            return res.json({ message: 'Login berhasil!', user: { name: user.username, email: user.email, role: user.role }});
        } else {
            return res.status(401).json({ message: 'Kombinasi Email atau password salah.' });
        }
    });
});

app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Gagal untuk logout.' });
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout berhasil.' });
    });
});

// --- API untuk Pesan Kontak ---
app.post('/api/contact', (req, res) => {
    const { nama, email, pesan } = req.body;
    if (!nama || !email || !pesan) return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    
    const newMessage = { nama, email, pesan };
    db.query('INSERT INTO messages SET ?', newMessage, (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ message: 'Gagal mengirim pesan.' }); }
        res.status(201).json({ message: 'Pesan Anda telah berhasil terkirim.' });
    });
});

app.get('/api/messages', isAuth, isAdmin, (req, res) => {
    db.query("SELECT * FROM messages ORDER BY tanggal_kirim DESC", (err, results) => {
        if (err) { console.error(err); return res.status(500).json({ message: "Gagal mengambil data pesan." }); }
        res.json(results);
    });
});

// --- API untuk Data Kontrakan (CRUD Lengkap) ---
app.get('/api/kontrakan', (req, res) => {
    db.query("SELECT * FROM kontrakan ORDER BY id DESC", (err, results) => {
        if (err) { console.error(err); return res.status(500).json({ message: "Gagal mengambil data kontrakan." }); }
        res.json(results);
    });
});

app.get('/api/kontrakan/:id', (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM kontrakan WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Kontrakan not found" });
        }
        res.json(result[0]);
    });
});

app.post('/api/kontrakan', isAuth, isAdmin, upload.single('foto_utama'), (req, res) => {
    const { nama_properti, alamat, kelengkapan, garasi, harga_3_bulan, harga_6_bulan, harga_12_bulan, deskripsi, koordinat_map } = req.body;
    const foto_utama = req.file ? req.file.filename : null;
    if (!nama_properti || !alamat || !foto_utama) return res.status(400).json({ message: "Nama Properti, Alamat, dan Foto Utama wajib diisi." });

    const newKontrakan = {
        nama_properti, alamat, kelengkapan, garasi: parseInt(garasi, 10),
        harga_3_bulan: parseInt(harga_3_bulan, 10) || null,
        harga_6_bulan: parseInt(harga_6_bulan, 10) || null,
        harga_12_bulan: parseInt(harga_12_bulan, 10) || null,
        deskripsi, koordinat_map, foto_utama
    };
    db.query("INSERT INTO kontrakan SET ?", newKontrakan, (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ message: "Gagal menyimpan data kontrakan." }); }
        res.status(201).json({ message: "Data kontrakan berhasil ditambahkan!" });
    });
});

app.put('/api/kontrakan/:id', isAuth, isAdmin, upload.single('foto_utama'), (req, res) => {
    const { id } = req.params;
    const { nama_properti, alamat, kelengkapan, garasi, harga_3_bulan, harga_6_bulan, harga_12_bulan, deskripsi, koordinat_map } = req.body;
    const newFile = req.file;

    db.query("SELECT foto_utama FROM kontrakan WHERE id = ?", [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Data tidak ditemukan." });
        
        let foto_utama = results[0].foto_utama;
        if (newFile) {
            const oldFilePath = path.join(__dirname, 'public/uploads', foto_utama);
            fs.unlink(oldFilePath, (err) => { if (err) console.error("Gagal hapus foto lama:", err); });
            foto_utama = newFile.filename;
        }

        const updatedData = {
            nama_properti, alamat, kelengkapan, garasi: parseInt(garasi),
            harga_3_bulan: parseInt(harga_3_bulan) || null,
            harga_6_bulan: parseInt(harga_6_bulan) || null,
            harga_12_bulan: parseInt(harga_12_bulan) || null,
            deskripsi, koordinat_map, foto_utama
        };
        db.query("UPDATE kontrakan SET ? WHERE id = ?", [updatedData, id], (err, result) => {
            if (err) { console.error(err); return res.status(500).json({ message: "Gagal mengupdate data." }); }
            res.json({ message: "Data kontrakan berhasil di-update." });
        });
    });
});

app.patch('/api/kontrakan/:id/status', isAuth, isAdmin, (req, res) => {
    const { id } = req.params;
    const { tersedia } = req.body;
    db.query("UPDATE kontrakan SET tersedia = ? WHERE id = ?", [tersedia, id], (err, result) => {
        if (err) { console.error(err); return res.status(500).json({ message: "Internal Server Error" }); }
        if (result.affectedRows === 0) return res.status(404).json({ message: "Data tidak ditemukan" });
        res.json({ message: `Status kontrakan berhasil diubah.` });
    });
});

app.delete('/api/kontrakan/:id', isAuth, isAdmin, (req, res) => {
    const { id } = req.params;
    db.query("SELECT foto_utama FROM kontrakan WHERE id = ?", [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Data tidak ditemukan." });
        
        const filename = results[0].foto_utama;
        const filepath = path.join(__dirname, 'public/uploads', filename);

        db.query("DELETE FROM kontrakan WHERE id = ?", [id], (err, result) => {
            if (err) { console.error(err); return res.status(500).json({ message: "Gagal menghapus data." }); }
            fs.unlink(filepath, (err) => {
                if (err) console.error("Gagal menghapus file gambar:", err);
                res.json({ message: "Data kontrakan berhasil dihapus." });
            });
        });
    });
});

// ==========================================================
// ==            6. RUTE PENYAJI HALAMAN HTML              ==
// ==========================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/kontrakan.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'kontrakan.html')));
app.get('/analisis.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'analisis.html')));
app.get('/edit-kontrakan.html', isAuth, isAdmin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'edit-kontrakan.html')));

// ==========================================================
// ==                 7. JALANKAN SERVER                   ==
// ==========================================================
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
    console.log("Gunakan Ctrl+C untuk menghentikan server.");
});