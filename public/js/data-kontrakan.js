// public/js/data-kontrakan.js (Versi Lengkap dengan Aksi)

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('kontrakan-table-body');

    // --- Fungsi untuk memuat ulang data ---
    const loadKontrakanData = async () => {
        if (!tableBody) return;
        tableBody.innerHTML = '<tr><td colspan="8">Memuat data...</td></tr>';

        try {
            const response = await fetch('/api/kontrakan');
            if (!response.ok) throw new Error('Gagal mengambil data');
            
            const data = await response.json();
            tableBody.innerHTML = ''; // Kosongkan tabel

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="8" style="text-align:center;">Belum ada data kontrakan.</td></tr>';
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                row.dataset.id = item.id; // Simpan ID di baris
                row.innerHTML = `
                    <td>${item.nama_properti}</td>
                    <td>${item.alamat}</td>
                    <td>${item.kelengkapan}</td>
                    <td>${item.garasi ? 'Ada' : 'Tidak Ada'}</td>
                    <td>Rp. ${(item.harga_12_bulan || 0).toLocaleString('id-ID')}</td>
                    <td>${item.deskripsi.substring(0, 30)}...</td>
                    <td><img src="/uploads/${item.foto_utama}" alt="${item.nama_properti}" width="50" height="50" style="object-fit: cover;"></td>
                    <td class="actions">
                        <button class="status-toggle ${item.tersedia ? 'available' : 'unavailable'}" title="Ubah Status">
                            ${item.tersedia ? 'Tersedia' : 'Disewa'}
                        </button>
                        <a href="edit-kontrakan.html?id=${item.id}" class="edit-btn" title="Edit">✏️</a>
                        <button class="delete-btn" title="Hapus">🗑️</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error(error);
            tableBody.innerHTML = `<tr><td colspan="8" style="color: red; text-align:center;">${error.message}</td></tr>`;
        }
    };

    // --- Event listener untuk semua aksi (Delegation) ---
    tableBody.addEventListener('click', async (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;

        const id = row.dataset.id;

        // Jika tombol status diklik
        if (target.classList.contains('status-toggle')) {
            const isAvailable = target.classList.contains('available');
            const newStatus = isAvailable ? 0 : 1; // Balikkan statusnya
            
            if (confirm(`Anda yakin ingin mengubah status menjadi ${newStatus === 1 ? 'Tersedia' : 'Disewa'}?`)) {
                try {
                    const response = await fetch(`/api/kontrakan/${id}/status`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ tersedia: newStatus })
                    });
                    const result = await response.json();
                    alert(result.message);
                    if (response.ok) loadKontrakanData(); // Muat ulang data
                } catch (err) {
                    alert('Gagal mengubah status.');
                }
            }
        }

        // Jika tombol hapus diklik
        if (target.classList.contains('delete-btn')) {
            if (confirm('Anda yakin ingin menghapus data kontrakan ini secara permanen?')) {
                try {
                    const response = await fetch(`/api/kontrakan/${id}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    alert(result.message);
                    if (response.ok) loadKontrakanData(); // Muat ulang data
                } catch (err) {
                    alert('Gagal menghapus data.');
                }
            }
        }

        // Tombol edit akan otomatis mengarah ke halaman edit, tidak perlu JS di sini.
    });

    // Panggil fungsi saat halaman selesai dimuat
    loadKontrakanData();
});