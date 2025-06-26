// Ganti fungsi lama Anda dengan yang ini di dalam listings.js

document.addEventListener('DOMContentLoaded', () => {
    const kontrakanContainer = document.getElementById('kontrakan-cards-container');

    // Pastikan elemennya ada sebelum menjalankan fetch (untuk menghindari error di halaman lain)
    if (kontrakanContainer) {
        fetch('/api/kontrakan')
            .then(response => response.json())
            .then(data => {
                kontrakanContainer.innerHTML = ''; // Kosongkan container
                
                // PASTIKAN '(kontrakan)' ADA DI SINI
                data.forEach((kontrakan) => {
                    const cardHTML = `
                        <div class="card">
                            <img src="/uploads/${kontrakan.foto_utama}" alt="${kontrakan.nama_properti}" class="card-img">
                            <div class="card-body">
                                <h3 class="card-title">${kontrakan.nama_properti}</h3>
                                <p class="card-text">${(kontrakan.deskripsi || '').substring(0, 100)}...</p>
                                <a href="detail.html?id=${kontrakan.id}" class="card-button">Baca Selengkapnya</a>
                            </div>
                        </div>
                    `;
                    kontrakanContainer.innerHTML += cardHTML;
                });
            })
            .catch(error => {
                console.error('Error fetching kontrakan data:', error);
                kontrakanContainer.innerHTML = '<p>Gagal memuat data kontrakan. Silakan coba lagi nanti.</p>';
            });
    }
});