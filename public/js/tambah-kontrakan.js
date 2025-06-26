document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-kontrakan-form');
    
    // Pengecekan awal untuk memastikan elemen form ada
    if (!form) {
        console.error('Elemen form dengan ID "add-kontrakan-form" tidak ditemukan.');
        return; // Hentikan eksekusi jika form tidak ada
    }

    const messageDiv = document.getElementById('form-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        // Mencegah aksi default form (yang menyebabkan refresh dengan metode GET)
        e.preventDefault();

        // Gunakan FormData karena kita mengirim file
        const formData = new FormData(form);

        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            // Kirim data ke API endpoint yang benar dengan metode POST
            const response = await fetch('/api/kontrakan', {
                method: 'POST',
                // Tidak perlu 'Content-Type', browser akan set otomatis untuk FormData
                body: formData 
            });

            const result = await response.json();

            if (response.ok) {
                messageDiv.textContent = result.message;
                messageDiv.className = 'message-success'; // Untuk styling pesan sukses
                form.reset(); 
                setTimeout(() => {
                    // Arahkan kembali ke halaman daftar data setelah berhasil
                    window.location.href = 'data-kontrakan.html'; 
                }, 2000);
            } else {
                // Lemparkan error jika respons dari server tidak OK (misal: error 400, 500)
                throw new Error(result.message || 'Gagal menambahkan data.');
            }

        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.className = 'message-error'; // Untuk styling pesan error
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Simpan Kontrakan';
        }
    });
});