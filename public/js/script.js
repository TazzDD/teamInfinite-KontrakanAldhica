document.addEventListener('DOMContentLoaded', () => {

    // --- DATABASE KONTRAKAN YANG LEBIH DETAIL ---
    const dataKontrakan = [
        {
            nama: "Studio Tenang di Pojok Kota",
            harga: 1100000,
            skor: { ketenangan: 10, keramaian: 2, pemandangan: 7, fasilitas: 6, akses_transportasi: 5, hemat: 8 }
        },
        {
            nama: "Apartemen Urban Dekat Perkantoran",
            harga: 3000000,
            skor: { ketenangan: 3, keramaian: 9, pemandangan: 5, fasilitas: 10, akses_transportasi: 10, hemat: 2 }
        },
        {
            nama: "Paviliun Asri di Belakang Kampus",
            harga: 1500000,
            skor: { ketenangan: 8, keramaian: 5, pemandangan: 9, fasilitas: 7, akses_transportasi: 6, hemat: 6 }
        },
        {
            nama: "Kontrakan Hipster di Distrik Kreatif",
            harga: 1800000,
            skor: { ketenangan: 5, keramaian: 8, pemandangan: 6, fasilitas: 7, akses_transportasi: 8, hemat: 5 }
        },
        {
            nama: "Rumah Mungil untuk Keluarga",
            harga: 2500000,
            skor: { ketenangan: 7, keramaian: 4, pemandangan: 6, fasilitas: 8, akses_transportasi: 7, hemat: 4 }
        }
    ];

    const form = document.getElementById('questionnaire-form');
    const kuesionerSection = document.getElementById('kuesioner-section');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const hasilSection = document.getElementById('hasil-section');
    const resultsContainer = document.getElementById('results-container');
    const personaResultDiv = document.getElementById('persona-result');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Ambil semua jawaban dari form
        const jawaban = {
            profesi: document.getElementById('profesi').value,
            tujuan: document.getElementById('tujuan').value,
            suasana: document.querySelector('input[name="suasana"]:checked').value,
            energi: document.querySelector('input[name="energi"]:checked').value
        };

        // --- GIMMICK MACHINE LEARNING DIMULAI ---
        form.classList.add('hidden');
        loadingScreen.classList.remove('hidden');
        
        // Simulasi proses analisis dengan beberapa langkah
        setTimeout(() => { loadingText.textContent = 'Menganalisis preferensi lingkungan...'; }, 1000);
        setTimeout(() => { loadingText.textContent = 'Membangun model gaya hidup...'; }, 2000);
        setTimeout(() => {
            loadingText.textContent = 'Menjalankan algoritma pencocokan...';
            
            // Proses inti setelah simulasi selesai
            prosesPencocokan(jawaban);

        }, 3000);
    });

    function prosesPencocokan(jawaban) {
        // Sembunyikan loading screen dan tampilkan section hasil
        kuesionerSection.classList.add('hidden');
        hasilSection.classList.remove('hidden');

        // 1. Tentukan Persona
        const persona = tentukanPersona(jawaban);
        personaResultDiv.innerHTML = `Profil AI Anda: <span class="persona-name">${persona}</span>`;

        // 2. Hitung Rekomendasi
        const hasilRekomendasi = hitungRekomendasi(jawaban);

        // 3. Tampilkan Hasil
        tampilkanHasil(hasilRekomendasi);
    }
    
    function tentukanPersona(jawaban) {
        if (jawaban.profesi === 'mahasiswa' || jawaban.tujuan === 'dekat_kampus') return "Akademisi Fokus";
        if (jawaban.profesi === 'pekerja_kreatif') return "Jiwa Kreatif Urban";
        if (jawaban.profesi === 'karyawan_kantoran' && jawaban.energi === 'ekstrovert') return "Sosialita Kota";
        if (jawaban.profesi === 'pekerja_remote' || jawaban.energi === 'introvert') return "Pencari Ketenangan";
        if (jawaban.profesi === 'keluarga_baru') return "Perajut Rumah Tangga";
        return "Penjelajah Modern";
    }

    function hitungRekomendasi(jawaban) {
        const SKOR_MAKSIMAL = 40; // 4 preferensi x 10 poin

        return dataKontrakan.map(kontrakan => {
            let skorTotal = 0;

            // Penilaian berdasarkan jawaban, lebih kompleks
            switch(jawaban.suasana) {
                case 'tenang': skorTotal += kontrakan.skor.ketenangan; break;
                case 'ramai': skorTotal += kontrakan.skor.keramaian; break;
                case 'asri': skorTotal += kontrakan.skor.pemandangan; break;
            }

            switch(jawaban.energi) {
                case 'introvert': skorTotal += kontrakan.skor.ketenangan; break;
                case 'ekstrovert': skorTotal += kontrakan.skor.keramaian; break;
            }

            switch(jawaban.tujuan) {
                case 'hemat_biaya': skorTotal += kontrakan.skor.hemat; break;
                case 'dekat_kantor': skorTotal += kontrakan.skor.akses_transportasi; break;
                case 'gaya_hidup': skorTotal += kontrakan.skor.fasilitas; break;
                default: skorTotal += 5; // Skor dasar untuk tujuan lain
            }
            
            switch(jawaban.profesi) {
                case 'pekerja_kreatif': skorTotal += (kontrakan.skor.pemandangan * 0.5 + kontrakan.skor.keramaian * 0.5); break;
                case 'pekerja_remote': skorTotal += kontrakan.skor.ketenangan; break;
                case 'mahasiswa': skorTotal += (kontrakan.skor.hemat * 0.6 + kontrakan.skor.ketenangan * 0.4); break;
                default: skorTotal += 5;
            }

            const persentaseSkor = Math.round((skorTotal / SKOR_MAKSIMAL) * 100);
            return { ...kontrakan, skorFinal: persentaseSkor > 100 ? 100 : persentaseSkor };
        
        }).sort((a, b) => b.skorFinal - a.skorFinal);
    }

    function tampilkanHasil(rekomendasi) {
        resultsContainer.innerHTML = '';
        rekomendasi.forEach((kontrakan, index) => {
            const hue = kontrakan.skorFinal * 1.2; // 0 -> Merah, 120 -> Hijau
            const card = `
                <div class="result-card" style="border-color: hsl(${hue}, 80%, 50%); animation-delay: ${index * 0.1}s;">
                    <div class="info-container">
                        <h3>${kontrakan.nama}</h3>
                        <p><strong>Perkiraan Harga:</strong> Rp ${kontrakan.harga.toLocaleString('id-ID')}/bulan</p>
                    </div>
                    <div class="score-container">
                        <div class="score-percentage" style="color: hsl(${hue}, 80%, 40%);">${kontrakan.skorFinal}%</div>
                        <div class="score-label">Kecocokan Profil</div>
                    </div>
                </div>
            `;
            resultsContainer.innerHTML += card;
        });
    }
});