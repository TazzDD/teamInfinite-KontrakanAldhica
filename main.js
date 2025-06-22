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
    
    // Referensi ke dropdown profesi
    const profesiSelect = document.getElementById('profesi');

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
        const width = ((stepNumber - 1) / (progressSteps.length - 1)) * 100;
        progressLine.style.width = `${width}%`;
    };

    // "Kamus" untuk pilihan pertanyaan dinamis
    const questionOptions = {
        penghuni: {
            mahasiswa: [
                { value: 'sendiri', icon: '👤', text: 'Saya Sendiri' },
                { value: 'teman', icon: '🧑‍🤝‍🧑', text: 'Dengan Teman' }
            ],
            default: [
                { value: 'sendiri', icon: '👤', text: 'Saya Sendiri' },
                { value: 'pasangan', icon: '👥', text: 'Dengan Pasangan' },
                { value: 'keluarga', icon: '👨‍👩‍👧', text: 'Keluarga Kecil' }
            ]
        }
    };

    // Fungsi untuk membangun dan menampilkan pertanyaan dinamis
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
                    <div class="radio-tile">
                        <div class="icon">${opt.icon}</div>
                        <label for="penghuni-${opt.value}">${opt.text}</label>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
    };

    // Event Listeners
    profesiSelect.addEventListener('change', updateDynamicQuestions);

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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const jawaban = Object.fromEntries(formData.entries());
        showMainContainer(loadingScreen);
        const loadingText = document.getElementById('loading-text');
        setTimeout(() => { loadingText.textContent = 'Menganalisis data personal (1/3)...'; }, 0);
        setTimeout(() => { loadingText.textContent = 'Membandingkan dengan >1000 properti (2/3)...'; }, 1500);
        setTimeout(() => { loadingText.textContent = 'Membangun profil kecocokan Anda (3/3)...'; }, 3000);
        setTimeout(() => {
            const hasil = hitungRekomendasi(jawaban);
            displayResults(jawaban, hasil);
            showMainContainer(hasilSection);
        }, 4500);
    });
    
    startOverBtn.addEventListener('click', () => {
        form.reset();
        currentStep = 1;
        showStep(currentStep);
        updateDynamicQuestions();
        showMainContainer(kuesionerContainer);
    });

    // Inisialisasi Halaman
    showStep(currentStep);
    updateDynamicQuestions();
    showMainContainer(kuesionerContainer);
});


// --- FUNGSI ANALISIS, SKOR, DAN TAMPILAN ---
function displayResults(jawaban, hasilData) {
    if (!hasilData || !jawaban) {
        document.getElementById('hasil-section').innerHTML = '<p>Terjadi kesalahan. Silakan coba lagi.</p>';
        return;
    }
    const persona = tentukanPersona(jawaban);
    document.getElementById('persona-result').innerHTML = `Profil AI Anda: <span class="persona-name">${persona}</span>`;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    hasilData.forEach((kontrakan, index) => {
        const hue = kontrakan.skorFinal * 1.2;
        const card = `
            <div class="result-card" style="border-color: hsl(${hue}, 80%, 50%); animation-delay: ${index * 0.1}s;">
                <div class="info-container">
                    <h3>${kontrakan.nama}</h3>
                    <p><strong>Estimasi Harga untuk Anda:</strong> Rp ${kontrakan.harga_estimasi.toLocaleString('id-ID')}/bulan</p>
                    <p class="result-justification">💡 ${kontrakan.justifikasi}</p>
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
    const SKOR_MAKSIMAL = 50; 
    return dataKontrakan.map(kontrakan => {
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
        const persentaseSkor = Math.round((skor / SKOR_MAKSIMAL) * 100);
        const rentangHarga = kontrakan.harga_max - kontrakan.harga_min;
        const faktorBudget = (jawaban.budget_priority === 'mewah') ? 0.8 : 0.2;
        const harga_estimasi = kontrakan.harga_min + (rentangHarga * faktorBudget);
        let justifikasi = "";
        const poinKuat = kontrakan.highlight;
        if (poinKuat === 'tenang' && noiseTolerance < 5) {
            justifikasi = "Sangat pas karena Anda butuh ketenangan untuk fokus.";
        } else if (poinKuat === 'sosial' && (jawaban.tamu === 'sering' || jawaban.penghuni === 'teman')) {
            justifikasi = "Cocok untuk gaya hidup sosial Anda.";
        } else if (poinKuat === 'pemandangan' && viewImportance > 6) {
            justifikasi = "Pemandangan indah sesuai dengan preferensi visual Anda.";
        } else if (poinKuat === 'keluarga' && jawaban.penghuni === 'keluarga') {
            justifikasi = "Dirancang untuk kenyamanan dan kebutuhan keluarga Anda.";
        } else if (poinKuat === 'gaya_hidup' && jawaban.relax_method === 'nongkrong') {
             justifikasi = "Lokasi strategis untuk Anda yang suka menjelajahi tempat baru.";
        } else {
            justifikasi = "Kombinasi fasilitas dan lokasinya seimbang dengan profil Anda.";
        }
        return { 
            ...kontrakan,
            skorFinal: persentaseSkor > 100 ? 100 : persentaseSkor,
            harga_estimasi: Math.round(harga_estimasi / 10000) * 10000,
            justifikasi: justifikasi
        };
    }).sort((a, b) => b.skorFinal - a.skorFinal);
}