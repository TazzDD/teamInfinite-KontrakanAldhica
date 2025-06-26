document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message-list-container');

    // Fungsi untuk memformat tanggal dari database menjadi lebih mudah dibaca
    const formatTanggal = (tanggalDB) => {
        const options = {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        };
        return new Date(tanggalDB).toLocaleDateString('id-ID', options);
    };

    // Fungsi utama untuk mengambil dan menampilkan pesan
    const loadMessages = async () => {
        // Tampilkan pesan loading awal
        messageContainer.innerHTML = '<p>Sedang memuat pesan...</p>';

        try {
            const response = await fetch('/api/messages');

            if (!response.ok) {
                // Jika user bukan admin atau tidak login, server akan menolak.
                throw new Error(`Gagal memuat pesan. Status: ${response.status}`);
            }

            const messages = await response.json();

            // Kosongkan kontainer sebelum mengisi dengan data baru
            messageContainer.innerHTML = '';

            if (messages.length === 0) {
                messageContainer.innerHTML = '<p>Tidak ada pesan masuk.</p>';
            } else {
                messages.forEach(msg => {
                    // Buat elemen kartu pesan untuk setiap data
                    const messageCard = document.createElement('div');
                    messageCard.className = 'message-card';
                    // Tandai kartu jika belum dibaca (status_baca = 0)
                    if (msg.status_baca === 0) {
                        messageCard.classList.add('unread');
                    }

                    messageCard.innerHTML = `
                        <h3>${msg.nama}</h3>
                        <p><strong>Email:</strong> ${msg.email}</p>
                        <p><strong>Isi Pesan:</strong> ${msg.pesan}</p>
                        <span class="time">${formatTanggal(msg.tanggal_kirim)}</span>
                    `;
                    
                    messageContainer.appendChild(messageCard);
                });
            }

        } catch (error) {
            console.error('Error:', error);
            messageContainer.innerHTML = `<p style="color: red;">Terjadi kesalahan: ${error.message}</p>`;
        }
    };

    // Panggil fungsi saat halaman selesai dimuat
    loadMessages();
});