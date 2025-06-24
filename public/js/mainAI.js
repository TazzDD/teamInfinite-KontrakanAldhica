document.addEventListener('DOMContentLoaded', () => {
    // Referensi elemen utama dan form
    const kuesionerContainer = document.getElementById('kuesioner-container');
    const loadingScreen = document.getElementById('loading-screen');
    const hasilSection = document.getElementById('hasil-section');
    const form = document.getElementById('multi-step-form');
    const steps = [...document.querySelectorAll('.step-content')];
    const progressSteps = [...document.querySelectorAll('#progress-bar .step')];
    const progressLine = document.getElementById('progress-line');
    const startOverBtn = document.getElementById('start-over-btn');
    const profesiSelect = document.getElementById('profesi');
    const modalContainer = document.getElementById('modal-container');
    const modalMessage = document.querySelector('.modal-message');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    let currentStep = 1;

    // Fungsi utama untuk mengontrol layar mana yang terlihat
    const showMainContainer = (containerToShow) => {
        kuesionerContainer.classList.add('hidden');
        loadingScreen.classList.add('hidden');
        hasilSection.classList.add('hidden');
        if (containerToShow) containerToShow.classList.remove('hidden');
    };

    // Fungsi untuk menampilkan langkah kuesioner yang benar
    const showStep = (stepNumber) => {
        steps.forEach(step => step.classList.remove('active'));
        const activeStep = steps.find(step => parseInt(step.dataset.step) === stepNumber);
        if (activeStep) activeStep.classList.add('active');
        progressSteps.forEach((step, index) => step.classList.toggle('active', index < stepNumber));
        // Perhitungan width untuk progress line yang lebih akurat
        const progressWidth = (progressSteps.length > 1) ? ((stepNumber - 1) / (progressSteps.length - 1)) * 100 * 0.8 : 0; // 80% dari total
        progressLine.style.width = `${progressWidth}%`;
    };
    
    // Fungsi untuk mengontrol pop-up modal
    const showModal = (message) => {
        modalMessage.textContent = message;
        modalContainer.classList.remove('hidden');
    };
    const hideModal = () => {
        modalContainer.classList.add('hidden');
    };

    const questionOptions = {
        penghuni: {
            mahasiswa: [{ value: 'sendiri', icon: '👤', text: 'Saya Sendiri' }, { value: 'teman', icon: '🧑‍🤝‍🧑', text: 'Dengan Teman' }],
            default: [{ value: 'sendiri', icon: '👤', text: 'Saya Sendiri' }, { value: 'pasangan', icon: '👥', text: 'Dengan Pasangan' }, { value: 'keluarga', icon: '👨‍👩‍👧', text: 'Keluarga Kecil' }]
        }
    };

    const updateDynamicQuestions = () => {
        const selectedProfesi = profesiSelect.value;
        const container = document.getElementById('dynamic-question-penghuni');
        const options = questionOptions.penghuni[selectedProfesi] || questionOptions.penghuni.default;
        let html = `<label>Siapa yang akan tinggal di kontrakan?</label><div class="radio-tile-group">`;
        options.forEach((opt, index) => {
            const isChecked = index === 0 ? 'checked' : '';
            html += `
                <div class="input-container">
                    <input type="radio" id="penghuni-${opt.value}" name="penghuni" value="${opt.value}" ${isChecked}>
                    <label class="radio-tile" for="penghuni-${opt.value}">
                        <div class="icon">${opt.icon}</div>
                        <span class="radio-label-text">${opt.text}</span>
                    </label>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
    };

    const updateRangeSlider = (slider) => {
        if (!slider) return;
        const min = slider.min || 0;
        const max = slider.max || 100;
        const value = slider.value;
        const percentage = ((value - min) / (max - min)) * 100;
        slider.style.setProperty('--value-percent', `${percentage}%`);
    };

    // Event Listeners
    profesiSelect.addEventListener('change', updateDynamicQuestions);
    modalCloseBtn.addEventListener('click', hideModal);
    modalContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) hideModal();
    });

    form.addEventListener('click', (e) => {
        if (e.target.matches('.next-btn')) {
            if (currentStep < steps.length) { currentStep++; showStep(currentStep); }
        } else if (e.target.matches('.prev-btn')) {
            if (currentStep > 1) { currentStep--; showStep(currentStep); }
        }
    });

    form.addEventListener('input', (e) => {
        if (e.target.type === 'range') updateRangeSlider(e.target);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const budgetInput = document.getElementById('budget');
        const submitButton = form.querySelector('button[type="submit"]');

        if (!budgetInput.value || parseInt(budgetInput.value) < 500000) {
            // DIPERBAIKI: Reset currentStep sebelum menampilkan step 1
            currentStep = 1; 
            showStep(currentStep);
            budgetInput.focus();
            showModal('Mohon masukkan budget bulanan Anda, minimal Rp 500.000.');
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = `<span class="spinner-inline"></span> Menganalisis...`;

        setTimeout(() => {
            showMainContainer(loadingScreen);
            const loadingText = document.getElementById('loading-text');
            setTimeout(() => { loadingText.textContent = 'Menganalisis data personal...'; }, 0);
            setTimeout(() => { loadingText.textContent = 'Menghitung skor kecocokan...'; }, 1500);
            setTimeout(() => { loadingText.textContent = 'Menyaring properti sesuai budget...'; }, 3000);
            setTimeout(() => {
                const formData = new FormData(form);
                const jawaban = Object.fromEntries(formData.entries());
                const hasil = hitungRekomendasi(jawaban);
                displayResults(jawaban, hasil);
                showMainContainer(hasilSection);
            }, 4500);
        }, 500);
    });
    
    // Inisialisasi Halaman
    showStep(currentStep);
    updateDynamicQuestions();
    document.querySelectorAll('input[type="range"]').forEach(updateRangeSlider);
    showMainContainer(kuesionerContainer);
});

// Fungsi analisis dan hasil lainnya
function displayResults(jawaban, hasilData) {
    const hasilContainer = document.getElementById('hasil-section');
    if (!hasilData || hasilData.length === 0) {
        hasilContainer.innerHTML = `<div style="text-align: center; padding: 1rem 0;"><h2>Hasil Analisis AI</h2><p style="font-size: 1.1rem; color: var(--light-text); margin: 1.5rem 0;">Maaf, kami tidak menemukan properti yang cocok dengan kriteria dan budget Anda.</p><a href="index.html" class="nav-button primary">Coba Lagi</a></div>`;
        return;
    }
    
    const persona = tentukanPersona(jawaban);
    // Tambahkan kembali elemen yang hilang
    hasilContainer.innerHTML = `
        <h2>Rekomendasi Terbaik Untuk Anda</h2>
        <div id="persona-result">Profil AI Anda: <span class="persona-name">${persona}</span></div>
        <div id="results-container"></div>
        <div class="nav-buttons" style="justify-content: center;">
             <a href="index.html" class="nav-button primary">Mulai Analisis Baru</a>
        </div>
    `;

    const resultsContainer = document.getElementById('results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
        hasilData.forEach((kontrakan, index) => {
            const hue = kontrakan.skorFinal * 1.2;
            const card = `<div class="result-card" style="border-color: hsl(${hue}, 80%, 50%); animation-delay: ${index * 0.1}s;"><div class="info-container"><h3>${kontrakan.nama}</h3><p><strong>Estimasi Harga untuk Anda:</strong> Rp ${kontrakan.harga_estimasi.toLocaleString('id-ID')}/bulan</p><p class="result-justification">💡 ${kontrakan.justifikasi}</p></div><div class="score-container"><div class="score-percentage" style="color: hsl(${hue}, 80%, 40%);">${kontrakan.skorFinal}%</div><div class="score-label">Kecocokan Profil</div></div></div>`;
            resultsContainer.innerHTML += card;
        });
    }
}
const dataKontrakan = [
    { nama: "Studio Hening di Pinggir Kota", harga_min: 1000000, harga_max: 1300000, highlight: 'tenang', skor: { ketenangan: 10, sosial: 2, pemandangan: 7, fasilitas: 6, akses: 5, hemat: 8, keluarga: 2, mewah: 4 } },
    { nama: "Apartemen Pusat Pesta & Bisnis", harga_min: 2800000, harga_max: 3500000, highlight: 'sosial', skor: { ketenangan: 3, sosial: 9, pemandangan: 5, fasilitas: 10, akses: 10, hemat: 2, keluarga: 3, mewah: 8 } },
    { nama: "Paviliun Asri Belakang Kampus", harga_min: 1400000, harga_max: 1700000, highlight: 'pemandangan', skor: { ketenangan: 8, sosial: 5, pemandangan: 9, fasilitas: 7, akses: 6, hemat: 6, keluarga: 4, mewah: 5 } },
    { nama: "Rumah Keluarga di Komplek Nyaman", harga_min: 2400000, harga_max: 2900000, highlight: 'keluarga', skor: { ketenangan: 7, sosial: 4, pemandangan: 6, fasilitas: 8, akses: 7, hemat: 4, keluarga: 10, mewah: 6 } },
    { nama: "Loft Artistik di Distrik Kreatif", harga_min: 2000000, harga_max: 2500000, highlight: 'gaya_hidup', skor: { ketenangan: 5, sosial: 8, pemandangan: 8, fasilitas: 7, akses: 8, hemat: 5, keluarga: 3, mewah: 7 } }
];
function tentukanPersona(jawaban) {
    if (jawaban.penghuni === 'keluarga') return "Sang Kepala Keluarga";
    if (jawaban.profesi === 'mahasiswa' && jawaban.budget_priority === 'hemat') return "Pejuang Akademis Hemat";
    if (jawaban.relax_method === 'nongkrong' && jawaban.tamu === 'sering') return "Kupu-Kupu Sosial";
    if (jawaban.hari_ideal === 'produktif' && parseInt(jawaban.noise_tolerance) < 4) return "Si Ambisius Fokus";
    if (parseInt(jawaban.view_importance) > 7 && jawaban.relax_method === 'rumah') return "Pencari Kedamaian Estetik";
    return "Penjelajah Gaya Hidup";
}
function hitungRekomendasi(jawaban) {
    const SKOR_MAKSIMAL = 60;
    const userBudget = parseInt(jawaban.budget) || 0;
    const rekomendasi = dataKontrakan.map(kontrakan => {
        let skor = 0;
        const viewImportance = parseInt(jawaban.view_importance) || 5;
        const noiseTolerance = parseInt(jawaban.noise_tolerance) || 5;
        skor += (10 - noiseTolerance) * kontrakan.skor.ketenangan / 10;
        skor += noiseTolerance * kontrakan.skor.sosial / 10;
        skor += viewImportance * kontrakan.skor.pemandangan / 10;
        if (jawaban.penghuni === 'keluarga') skor += kontrakan.skor.keluarga; 
        else if (jawaban.penghuni === 'teman') skor += kontrakan.skor.sosial;
        else skor += (5 - kontrakan.skor.keluarga / 2);
        if (jawaban.relax_method === 'rumah') skor += kontrakan.skor.fasilitas;
        if (jawaban.relax_method === 'nongkrong') skor += kontrakan.skor.sosial;
        if (jawaban.budget_priority === 'mewah') skor += kontrakan.skor.mewah; else skor += kontrakan.skor.hemat;
        let skorBudget = 0;
        if (userBudget > 0) {
            const selisih = kontrakan.harga_min - userBudget;
            if (selisih <= 0) skorBudget = 10;
            else if (selisih <= userBudget * 0.2) skorBudget = 6;
            else skorBudget = 1;
        } else skorBudget = 5;
        skor += skorBudget;
        const persentaseSkor = Math.round((skor / SKOR_MAKSIMAL) * 100);
        const rentangHarga = kontrakan.harga_max - kontrakan.harga_min;
        const faktorBudget = (jawaban.budget_priority === 'mewah') ? 0.8 : 0.2;
        const harga_estimasi = kontrakan.harga_min + (rentangHarga * faktorBudget);
        let justifikasi = "";
        const isSangatSesuaiBudget = userBudget > 0 && kontrakan.harga_max < userBudget;
        if (isSangatSesuaiBudget) justifikasi = "Pilihan ini sangat sesuai dengan budget yang Anda tentukan.";
        else {
            const poinKuat = kontrakan.highlight;
            if (poinKuat === 'tenang' && noiseTolerance < 5) justifikasi = "Sangat pas karena Anda butuh ketenangan untuk fokus.";
            else if (poinKuat === 'sosial' && (jawaban.tamu === 'sering' || jawaban.penghuni === 'teman')) justifikasi = "Cocok untuk gaya hidup sosial Anda.";
            else if (poinKuat === 'pemandangan' && viewImportance > 6) justifikasi = "Pemandangan indah sesuai dengan preferensi visual Anda.";
            else if (poinKuat === 'keluarga' && jawaban.penghuni === 'keluarga') justifikasi = "Dirancang untuk kenyamanan dan kebutuhan keluarga Anda.";
            else if (poinKuat === 'gaya_hidup' && jawaban.relax_method === 'nongkrong') justifikasi = "Lokasi strategis untuk Anda yang suka menjelajahi tempat baru.";
            else justifikasi = "Kombinasi fasilitas dan lokasinya seimbang dengan profil Anda.";
        }
        return { 
            ...kontrakan,
            skorFinal: persentaseSkor > 100 ? 100 : persentaseSkor,
            harga_estimasi: Math.round(harga_estimasi / 10000) * 10000,
            justifikasi: justifikasi
        };
    });
    return rekomendasi.filter(kontrakan => {
        if (userBudget === 0) return true;
        return kontrakan.harga_min < userBudget * 1.4; 
    }).sort((a, b) => b.skorFinal - a.skorFinal);
}
