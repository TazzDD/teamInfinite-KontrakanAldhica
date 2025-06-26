document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-kontrakan-form');
    if (!form) return;

    const messageDiv = document.getElementById('form-message');
    const params = new URLSearchParams(window.location.search);
    const kontrakanId = params.get('id');
    
    if (!kontrakanId) {
        window.location.href = 'data-kontrakan.html';
        return;
    }

    const populateForm = async () => {
        try {
            const response = await fetch(`/api/kontrakan/${kontrakanId}`);
            if (!response.ok) throw new Error('Gagal mengambil data untuk diedit.');
            
            const data = await response.json();
            
            document.getElementById('kontrakanId').value = data.id;
            document.getElementById('nama_properti').value = data.nama_properti;
            document.getElementById('alamat').value = data.alamat;
            document.getElementById('kelengkapan').value = data.kelengkapan;
            document.getElementById('garasi').value = data.garasi;
            document.getElementById('harga_3_bulan').value = data.harga_3_bulan;
            document.getElementById('harga_6_bulan').value = data.harga_6_bulan;
            document.getElementById('harga_12_bulan').value = data.harga_12_bulan;
            document.getElementById('deskripsi').value = data.deskripsi;
            document.getElementById('koordinat_map').value = data.koordinat_map;
            document.getElementById('current-photo').src = `/uploads/${data.foto_utama}`;

        } catch (error) {
            messageDiv.textContent = error.message;
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        try {
            const response = await fetch(`/api/kontrakan/${kontrakanId}`, {
                method: 'PUT',
                body: formData
            });

            const result = await response.json();
            messageDiv.textContent = result.message;

            if (response.ok) {
                messageDiv.className = 'message-success';
                setTimeout(() => window.location.href = 'data-kontrakan.html', 1500);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            messageDiv.className = 'message-error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Update Data';
        }
    });

    populateForm();
});