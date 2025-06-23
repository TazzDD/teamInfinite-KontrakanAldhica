const dataKontrakan = {
  1: {
    tipe: "Rumah Kontrakan Semi Furnish Di Godean",
    lokasi: "Godean, Sleman",
    latitude: -7.8011,
    longitude: 110.2790,
    deskripsi: "Cek segera rumah 1 lantai yang asri ini, disewakan dengan pemandangan asri yang menambah nilai estetika di lingkungan hunian...",
    gambar: ["gambar/kontrakan.jpg", "gambar/kontrakan.jpg", "gambar/kontrakan.jpg", "gambar/kontrakan.jpg"],
    fasilitas: ["2 Kamar Tidur", "1 Kamar Mandi", "1 Mobil atau 2 Motor"],
    harga: {
      "3 Bulan": "Rp. 9.000.000",
      "6 Bulan": "Rp. 16.000.000",
      "12 Bulan": "Rp. 30.000.000"
    }
  },
  2: {
    tipe: "Kontrakan Minimalis Dekat Kampus",
    lokasi: "Condongcatur, Sleman",
    latitude: -7.7645,
    longitude: 110.3889,
    deskripsi: "Hunian minimalis strategis untuk mahasiswa dan pekerja...",
    gambar: ["gambar/kontrakan.jpg", "gambar/kontrakan1.jpg", "gambar/kontrakan.jpg"],
    fasilitas: ["1 Kamar Tidur", "1 Kamar Mandi", "Parkir Motor"],
    harga: {
      "3 Bulan": "Rp. 5.000.000",
      "6 Bulan": "Rp. 10.000.000",
      "12 Bulan": "Rp. 18.000.000"
    }
  },
  3: {
    tipe: "Kontrakan Keluarga Nyaman dan Luas",
    lokasi: "Kalasan, Sleman",
    latitude: -7.7822,
    longitude: 110.4892,
    deskripsi: "Rumah kontrakan cocok untuk keluarga, dengan taman dan ruang tamu terpisah...",
    gambar: ["gambar/kontrakan.jpg", "gambar/kontrakan.jpg", "gambar/kontrakan.jpg"],
    fasilitas: ["3 Kamar Tidur", "2 Kamar Mandi", "Garasi Mobil"],
    harga: {
      "3 Bulan": "Rp. 12.000.000",
      "6 Bulan": "Rp. 22.000.000",
      "12 Bulan": "Rp. 40.000.000"
    }
  }
};

document.querySelectorAll('.btn-detail').forEach(button => {
  button.addEventListener('click', () => {
    const id = button.dataset.id;
    const data = dataKontrakan[id];

    document.querySelector('.title').textContent = data.tipe;
    document.querySelector('.location').textContent = data.lokasi;
    document.querySelector('.description').textContent = data.deskripsi;

    document.getElementById('mainDisplay').src = data.gambar[0];

    const thumbnails = document.getElementById('thumbnails');
    thumbnails.innerHTML = '';
    data.gambar.forEach(gbr => {
      const thumb = document.createElement('img');
      thumb.src = gbr;
      thumb.onclick = () => {
        document.getElementById('mainDisplay').src = gbr;
      };
      thumbnails.appendChild(thumb);
    });

    const features = document.getElementById('features');
    features.innerHTML = '';
    data.fasilitas.forEach(fasilitas => {
      const feat = document.createElement('div');
      feat.className = 'feature';
      feat.textContent = fasilitas;
      features.appendChild(feat);
    });

    const priceBox = document.getElementById('price-list');
    priceBox.innerHTML = `<strong>${Object.values(data.harga)[0]} - ${Object.values(data.harga).slice(-1)[0]}</strong>`;
    for (let key in data.harga) {
      priceBox.innerHTML += `<div>${key} : ${data.harga[key]}</div>`;
    }

    document.getElementById('map-frame').src = `https://www.google.com/maps?q=${data.latitude},${data.longitude}&hl=id&z=16&output=embed`;

    document.getElementById('popup-detail').style.display = 'block';
  });
});

document.getElementById('close-popup').addEventListener('click', () => {
  document.getElementById('popup-detail').style.display = 'none';
});
document.getElementById('bayar-btn').addEventListener('click', () => {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  if (!isLoggedIn) {
    const konfirmasi = confirm("Anda harus login terlebih dahulu untuk menyewa. Ingin login sekarang?");
    if (konfirmasi) {
      window.location.href = "login.html";
    }
    return;
  }

  const durasi = document.getElementById('durasi').value;
  if (!durasi) {
    alert("Silakan pilih durasi sewa terlebih dahulu.");
    return;
  }

  const judul = document.querySelector('.title').textContent;
  const id = Object.keys(dataKontrakan).find(k => dataKontrakan[k].tipe === judul);
  const harga = dataKontrakan[id]?.harga[durasi];

  if (harga) {
    const konfirmasi = confirm(`Anda akan membayar ${harga} untuk durasi ${durasi}. Lanjutkan?`);
    if (konfirmasi) {
      // ⛳ TAMBAHKAN LOGIKA INI SEBELUM REDIRECT
      localStorage.setItem("durasiPembayaran", durasi);
      localStorage.setItem("hargaPembayaran", harga);
      localStorage.setItem("tipePembayaran", dataKontrakan[id].tipe);

      const pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
      pesanan.push({
        tipe: dataKontrakan[id].tipe,
        durasi,
        harga,
        status: "belum"
      });
      localStorage.setItem("pesanan", JSON.stringify(pesanan));

      window.location.href = "pembayaran.html";
    }
  } else {
    alert("Terjadi kesalahan dalam memproses harga.");
  }
});

