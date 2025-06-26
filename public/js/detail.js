// public/js/detail.js - VERSI PERBAIKAN FINAL

document.addEventListener('DOMContentLoaded', () => {
    // Menargetkan elemen-elemen yang ada di kontrakan.html
    const kontrakanContainer = document.getElementById('kontrakan-cards-container');
    const modal = document.getElementById('detail-modal'); // Menggunakan ID yang benar
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('modal-close-btn'); // Menggunakan ID yang benar

    // Jika salah satu elemen penting tidak ada, hentikan script
    if (!kontrakanContainer || !modal || !modalBody || !closeModalBtn) {
        return; 
    }

    // --- Fungsi untuk mengontrol pop-up ---
    const openModal = () => modal.classList.add('active');
    const closeModal = () => modal.classList.remove('active');

    // --- Event listener utama pada wadah kartu ---
    kontrakanContainer.addEventListener('click', async (e) => {
        
        // Cek apakah yang diklik adalah tombol dengan class .card-button
        if (e.target.classList.contains('card-button')) {
            e.preventDefault(); // MENCEGAH PINDAH HALAMAN

            const link = e.target;
            const url = new URL(link.href);
            const id = url.searchParams.get('id');

            // Tampilkan pop-up dengan pesan "Memuat..."
            modalBody.innerHTML = '<p>Memuat data...</p>';
            openModal();

            try {
                // Ambil data detail dari server
                const response = await fetch(`/api/kontrakan/${id}`);
                if (!response.ok) {
                    throw new Error('Data kontrakan tidak ditemukan.');
                }
                const kontrakan = await response.json();

                // Tampilkan data lengkap ke dalam pop-up
                modalBody.innerHTML = `
                    <img src="/uploads/${kontrakan.foto_utama}" alt="${kontrakan.nama_properti}">
                    <h2>${kontrakan.nama_properti}</h2>
                    <p><strong>Alamat:</strong> ${kontrakan.alamat || '-'}</p>
                    <p><strong>Kelengkapan:</strong> ${kontrakan.kelengkapan || '-'}</p>
                    <p><strong>Garasi:</strong> ${kontrakan.garasi > 0 ? `${kontrakan.garasi} mobil` : 'Tidak tersedia'}</p>
                    <p>${kontrakan.deskripsi || 'Tidak ada deskripsi.'}</p>
                    <hr>
                    <h4>Daftar Harga</h4>
                    <p><strong>3 Bulan:</strong> Rp ${kontrakan.harga_3_bulan ? kontrakan.harga_3_bulan.toLocaleString('id-ID') : '-'}</p>
                    <p><strong>6 Bulan:</strong> Rp ${kontrakan.harga_6_bulan ? kontrakan.harga_6_bulan.toLocaleString('id-ID') : '-'}</p>
                    <p><strong>12 Bulan:</strong> Rp ${kontrakan.harga_12_bulan ? kontrakan.harga_12_bulan.toLocaleString('id-ID') : '-'}</p>
                `;

            } catch (error) {
                modalBody.innerHTML = `<p style="color:red;">Terjadi kesalahan: ${error.message}</p>`;
            }
        }
    });

    // --- Event listener untuk menutup pop-up ---
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // Jika yang diklik adalah area overlay gelap (di luar konten pop-up)
        if (e.target === modal) {
            closeModal();
        }
    });
});
// Tidak ada kurung kurawal } ekstra di sini