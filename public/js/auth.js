// AUTH.JS - VERSI FINAL YANG SESUAI DENGAN SERVER BERBASIS SESI

document.addEventListener('DOMContentLoaded', () => {

    // Fungsi untuk menangani submit form (Login & Register)
    const handleFormSubmit = async (form, url, isLogin) => {
        const messageDiv = document.getElementById('message-container');
        if (!messageDiv) return;
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!isLogin && data.password !== data.confirmPassword) {
            messageDiv.textContent = 'Konfirmasi password tidak cocok!';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = result.message;
                messageDiv.style.color = 'green';
                
                // Jika login berhasil dan server mengirim data pengguna
                if (isLogin && result.user) {
                    // Simpan data pengguna ke localStorage untuk pembaruan UI
                    localStorage.setItem('loggedInUser', JSON.stringify(result.user));
                }
                
                setTimeout(() => {
                    window.location.href = isLogin ? 'index.html' : 'login.html';
                }, 1500);

            } else {
                messageDiv.textContent = result.message || 'Terjadi kesalahan.';
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Tidak dapat terhubung ke server.';
            messageDiv.style.color = 'red';
        }
    };
    
    // Fungsi untuk memeriksa sesi dari localStorage dan mengatur Navigasi
    const checkUserSession = () => {
        const loggedInUserJSON = localStorage.getItem('loggedInUser');
        const daftarLink = document.getElementById('daftar-link');
        const masukLink = document.getElementById('masuk-link');
        const adminButton = document.getElementById('admin-button');
        const userDisplay = document.getElementById('user-display');
        const logoutButton = document.getElementById('logout-button');

        if (loggedInUserJSON) {
            const user = JSON.parse(loggedInUserJSON);

            if(daftarLink) daftarLink.style.display = 'none';
            if(masukLink) masukLink.style.display = 'none';
            if(userDisplay) {
                userDisplay.textContent = `Halo, ${user.name}`;
                userDisplay.style.display = 'block';
            }
            if(logoutButton) logoutButton.style.display = 'inline-block';
            if (user.role === 'admin' && adminButton) {
                adminButton.style.display = 'inline-block';
            }
        } else {
            // Jika tidak ada data di localStorage, mungkin pengguna baru membuka tab
            // atau cache-nya dibersihkan. Kita bisa biarkan saja (menampilkan 'Daftar' & 'Masuk')
            // karena server akan memproteksi rute yang butuh login.
            // Atau kita bisa membuat API call ke server untuk memeriksa sesi.
            // Untuk saat ini, kita biarkan sederhana.
        }
    };
    
    // Fungsi untuk Logout
    const logout = async () => {
        // Hapus data dari localStorage
        localStorage.removeItem('loggedInUser');
        
        try {
            // Beri tahu server untuk menghancurkan sesi
            await fetch('/api/logout', { method: 'POST' });
        } catch(error) {
            console.error("Gagal menghubungi server untuk logout:", error);
        } finally {
            // Arahkan kembali ke halaman utama
            window.location.href = 'index.html';
        }
    };

    // --- Event Listeners ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(loginForm, '/api/login', true);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(registerForm, '/api/register', false);
        });
    }

    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Jalankan pengecekan sesi saat halaman dimuat
    checkUserSession();
});