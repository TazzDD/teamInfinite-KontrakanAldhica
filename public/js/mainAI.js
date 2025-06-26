document.addEventListener('DOMContentLoaded', () => {
    // --- DATABASE STATIS DENGAN SKOR SUPER DETAIL ---
    const dataKontrakan = [
        { nama: "Studio Hening di Pinggir Kota", harga: 1100000, skor: { ketenangan: 10, sosial: 2, pemandangan: 7, akses_transportasi: 5, parkir_motor: 9, butuh_mobil: false, dekat_kafe: 4, dekat_taman: 8, dekat_supermarket: 6, butuh_ruang_tamu: 2, internet: 8, dapur: 6, ruang_kerja: 7, privasi: 9 } },
        { nama: "Apartemen Pusat Pesta", harga: 3000000, skor: { ketenangan: 3, sosial: 9, pemandangan: 5, akses_transportasi: 10, parkir_motor: 6, butuh_mobil: true, dekat_kafe: 10, dekat_taman: 4, dekat_supermarket: 8, butuh_ruang_tamu: 8, internet: 10, dapur: 8, ruang_kerja: 5, privasi: 4 } },
        { nama: "Paviliun Asri Belakang Kampus", harga: 1500000, skor: { ketenangan: 8, sosial: 5, pemandangan: 9, akses_transportasi: 6, parkir_motor: 10, butuh_mobil: false, dekat_kafe: 6, dekat_taman: 9, dekat_supermarket: 7, butuh_ruang_tamu: 5, internet: 7, dapur: 9, ruang_kerja: 8, privasi: 7 } },
        { nama: "Rumah Keluarga di Komplek Nyaman", harga: 2500000, skor: { ketenangan: 7, sosial: 4, pemandangan: 6, akses_transportasi: 7, parkir_motor: 8, butuh_mobil: true, dekat_kafe: 5, dekat_taman: 7, dekat_supermarket: 9, butuh_ruang_tamu: 10, internet: 6, dapur: 10, ruang_kerja: 6, privasi: 8 } },
        { nama: "Loft Artistik di Distrik Kreatif", harga: 2200000, skor: { ketenangan: 5, sosial: 8, pemandangan: 8, akses_transportasi: 8, parkir_motor: 7, butuh_mobil: false, dekat_kafe: 9, dekat_taman: 5, dekat_supermarket: 7, butuh_ruang_tamu: 7, internet: 9, dapur: 7, ruang_kerja: 9, privasi: 6 } }
    ];

    // Elemen Utama
    const kuesionerContainer = document.getElementById('kuesioner-container');
    const loadingScreen = document.getElementById('loading-screen');
    const hasilSection = document.getElementById('hasil-section');
    const form = document.getElementById('multi-step-form');
    const mulaiLagiBtn = document.getElementById('mulai-lagi-btn');
    
    // Elemen Navigasi Langkah
    const steps = [...document.querySelectorAll('.step-content')];
    const progressSteps = [...document.querySelectorAll('#progress-bar .step')];
    const progressLine = document.getElementById('progress-line');
    let currentStep = 1;

    // --- FUNGSI UTAMA UNTUK NAVIGASI ---
    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        const activeStep = steps.find(step => parseInt(step.dataset.step) === stepNumber);
        if (activeStep) activeStep.classList.add('active');

        progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index < stepNumber);
        });

        const progressWidth = ((stepNumber - 1) / (progressSteps.length - 1)) * 100;
        progressLine.style.width = `${progressWidth}%`;
    };

    // --- EVENT LISTENER UNTUK TOMBOL & INPUT ---
    form.addEventListener('click', (e) => {
        if (e.target.matches('.next-btn')) {
            if (currentStep < steps.length) {
                currentStep++;
                showStep(currentStep);
            }
        } else if (e.target.matches('.prev-btn')) {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
            }
        }
    });

    // --- EVENT LISTENER UNTUK INPUT (DENGAN PERBAIKAN BUG) ---
    form.addEventListener('input', (e) => {
        // Hanya jalankan jika elemennya adalah slider
        if (e.target.type === 'range') {
            // Cari elemen <label> yang merupakan induk dari slider
            const label = e.target.previousElementSibling;
            if (label) {
                // Di dalam label tersebut, cari elemen <span> yang spesifik untuk menampilkan nilai
                const valueDisplay = label.querySelector('.value-display');
                if (valueDisplay) {
                    // Cek apakah ini slider budget untuk memberikan format Rupiah
                    if (e.target.id === 'budget') {
                        valueDisplay.textContent = `Rp ${parseInt(e.target.value).toLocaleString('id-ID')}`;
                    } else {
                        // Untuk slider lainnya, cukup tampilkan nilainya
                        valueDisplay.textContent = e.target.value;
                    }
                }
            }
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const jawaban = Object.fromEntries(formData.entries());

        kuesionerContainer.classList.add('hidden');
        loadingScreen.classList.remove('hidden');

        // Simulasi analisis
        const loadingText = document.getElementById('loading-text');
        setTimeout(() => { loadingText.textContent = 'Menganalisis data personal (1/3)...'; }, 0);
        setTimeout(() => { loadingText.textContent = 'Membandingkan dengan >1000 properti (2/3)...'; }, 1500);
        setTimeout(() => { loadingText.textContent = 'Membangun profil kecocokan Anda (3/3)...'; }, 3000);

        setTimeout(() => {
            const hasil = hitungRekomendasi(jawaban);
            displayResults(jawaban, hasil);
            loadingScreen.classList.add('hidden');
            hasilSection.classList.remove('hidden');
        }, 4500);
    });
    
    mulaiLagiBtn.addEventListener('click', () => {
        hasilSection.classList.add('hidden');
        kuesionerContainer.classList.remove('hidden');
        form.reset();
        currentStep = 1;
        showStep(currentStep);
        // Reset manual display slider
        document.getElementById('budget-value').textContent = 'Rp 2.000.000';
        document.querySelector('[name="label_kebisingan"]').textContent = '5';
        document.querySelector('[name="label_pemandangan"]').textContent = '5';
    });

    // --- FUNGSI ANALISIS & TAMPILAN ---
    function tentukanPersona(jawaban) {
        if (jawaban.profesi === 'mahasiswa' && parseInt(jawaban.budget) < 1800000) return "Pejuang Akademis Hemat";
        if (jawaban.gaya_prioritas_internal === 'ruang_kerja' && parseInt(jawaban.privasi) > 7) return "Profesional Fokus";
        if (jawaban.gaya_tamu === 'sering' && jawaban.gaya_energi === 'ekstrovert') return "Kupu-Kupu Sosial";
        if (parseInt(jawaban.pemandangan) > 8 && jawaban.gaya_weekend === 'santai') return "Pencari Kedamaian Estetik";
        return "Penjelajah Gaya Hidup";
    }

    function hitungRekomendasi(jawaban) {
        const SKOR_MAKSIMAL = 80; // Disesuaikan dengan jumlah pertanyaan
        const budget = parseInt(jawaban.budget);

        return dataKontrakan
            .filter(k => k.harga <= budget + 500000 && (jawaban.lingkungan_akses === 'mobil' ? k.skor.butuh_mobil : true))
            .map(kontrakan => {
                let skor = 0;
                const kebisingan = parseInt(jawaban.kebisingan);
                const pemandangan = parseInt(jawaban.pemandangan);
                const privasi = parseInt(jawaban.privasi);

                // Langkah 2: Lingkungan
                skor += (jawaban.lingkungan_suasana === 'tenang') ? kontrakan.skor.ketenangan : kontrakan.skor.sosial;
                skor += (10 - kebisingan) * (kontrakan.skor.ketenangan / 10); // Makin tidak toleran bising, makin butuh tenang
                skor += pemandangan * (kontrakan.skor.pemandangan / 10);
                if (jawaban.lingkungan_akses === 'motor') skor += kontrakan.skor.parkir_motor;
                if (jawaban.lingkungan_fasilitas === 'kafe') skor += kontrakan.skor.dekat_kafe;
                else if (jawaban.lingkungan_fasilitas === 'taman') skor += kontrakan.skor.dekat_taman;
                else skor += kontrakan.skor.dekat_supermarket;

                // Langkah 3: Gaya Hidup
                skor += (jawaban.gaya_energi === 'introvert') ? kontrakan.skor.ketenangan : kontrakan.skor.sosial;
                if (jawaban.gaya_tamu === 'sering') skor += kontrakan.skor.butuh_ruang_tamu;
                if (jawaban.gaya_prioritas_internal === 'internet') skor += kontrakan.skor.internet;
                else if (jawaban.gaya_prioritas_internal === 'dapur') skor += kontrakan.skor.dapur;
                else skor += kontrakan.skor.ruang_kerja;
                skor += privasi * (kontrakan.skor.privasi / 10);

                // Skor budget
                let skorBudget = (1 - (kontrakan.harga / budget)) * 10;
                skor += Math.max(0, skorBudget);
                
                const persentaseSkor = Math.round((skor / SKOR_MAKSIMAL) * 100);
                return { ...kontrakan, skorFinal: Math.min(100, persentaseSkor) };
            }).sort((a, b) => b.skorFinal - a.skorFinal);
    }

    function displayResults(jawaban, hasilData) {
        document.getElementById('persona-result').innerHTML = `Profil AI Anda: <span class="persona-name">${tentukanPersona(jawaban)}</span>`;
        const resultsContainer = document.getElementById('results-container');
        resultsContainer.innerHTML = '';
        
        if (hasilData.length === 0) {
            resultsContainer.innerHTML = '<p style="text-align:center;">Maaf, tidak ada rekomendasi yang cocok. Coba ubah kriteria atau naikkan budget Anda.</p>';
            return;
        }

        hasilData.slice(0, 3).forEach((kontrakan, index) => {
            const hue = kontrakan.skorFinal * 1.2;
            const card = `
                <div class="result-card" style="border-color: hsl(${hue}, 80%, 50%); animation-delay: ${index * 0.1}s;">
                    <div class="info-container">
                        <h3>${kontrakan.nama}</h3>
                        <p><strong>Harga:</strong> Rp ${kontrakan.harga.toLocaleString('id-ID')}/bulan</p>
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

    // Inisialisasi tampilan awal
    showStep(currentStep);
});