<?php include 'navbar.php'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Detail Kontrakan</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      margin: 0;
    }

    .main-container {
      max-width: 1200px;
      margin: 30px auto;
      padding: 20px;
    }

    .main-image {
      width: 100%;
      height: 400px;
      overflow: hidden;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .thumbnails {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .thumbnails img {
      width: 100px;
      height: 60px;
      object-fit: cover;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .thumbnails img:hover {
      transform: scale(1.05);
    }

    .content-container {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }

    .left-section {
      flex: 2;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
    }

    .right-section {
      flex: 1;
      background: #f9f9f9;
      padding: 20px;
      border-radius: 10px;
      height: fit-content;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }

    .title {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .location {
      color: #777;
      margin-bottom: 20px;
    }

    .features {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }

    .feature {
      background: #f0f0f0;
      padding: 10px;
      border-radius: 8px;
      flex: 1;
      min-width: 120px;
      text-align: center;
      font-size: 14px;
      color: #444;
    }

    .description {
      font-size: 15px;
      line-height: 1.6;
      color: #555;
    }

    .price-box {
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 15px;
      margin-bottom: 15px;
      background: #fff;
    }

    .price-box strong {
      display: block;
      font-size: 18px;
      color: #333;
      margin-bottom: 10px;
    }

    .btn {
      display: block;
      text-align: center;
      background: #1a3c48;
      color: #fff;
      padding: 10px 15px;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 10px;
    }

    .map-section {
      margin-top: 40px;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
    }

    .map-section h3 {
      margin-bottom: 15px;
      color: #333;
    }

    iframe {
      width: 100%;
      height: 400px;
      border: 0;
      border-radius: 10px;
    }
  </style>
</head>
<body>

<?php
$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

$kontrakans = [
    1 => [
        'tipe' => 'Rumah Kontrakan Semi Furnish Di Godean',
        'lokasi' => 'Godean, Sleman',
        'latitude' => -7.8011,
        'longitude' => 110.2790,
        'deskripsi' => 'Cek opsi rumah 1 lantai yang semi ini...',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg'],
        'fasilitas' => ['2 Kamar Tidur', '1 Kamar Mandi', '1 Mobil atau 2 Motor'],
        'harga' => [
            '3 Bulan' => 'Rp. 9.000.000',
            '6 Bulan' => 'Rp. 18.000.000',
            '12 Bulan' => 'Rp. 30.000.000'
        ]
    ],
    2 => [
        'tipe' => 'Kontrakan Minimalis Dekat Kampus',
        'lokasi' => 'Condongcatur, Sleman',
        'latitude' => -7.7645,
        'longitude' => 110.3889,
        'deskripsi' => 'Hunian minimalis yang strategis untuk mahasiswa dan pekerja.',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg'],
        'fasilitas' => ['1 Kamar Tidur', '1 Kamar Mandi', 'Parkir Motor'],
        'harga' => [
            '3 Bulan' => 'Rp. 5.000.000',
            '6 Bulan' => 'Rp. 10.000.000',
            '12 Bulan' => 'Rp. 18.000.000'
        ]
    ],
    3 => [
        'tipe' => 'Kontrakan Keluarga Nyaman dan Luas',
        'lokasi' => 'Kalasan, Sleman',
        'latitude' => -7.7822,
        'longitude' => 110.4892,
        'deskripsi' => 'Rumah kontrakan cocok untuk keluarga, dengan taman dan ruang tamu terpisah.',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg'],
        'fasilitas' => ['3 Kamar Tidur', '2 Kamar Mandi', 'Garasi Mobil'],
        'harga' => [
            '3 Bulan' => 'Rp. 12.000.000',
            '6 Bulan' => 'Rp. 22.000.000',
            '12 Bulan' => 'Rp. 40.000.000'
        ]
    ]
];

$data = isset($kontrakans[$id]) ? $kontrakans[$id] : $kontrakans[1];
?>

<div class="main-container">
  <!-- Gambar Utama -->
  <div class="main-image">
    <img id="mainDisplay" src="<?= $data['gambar'][0]; ?>" alt="Gambar Kontrakan">
  </div>

  <!-- Thumbnail -->
  <div class="thumbnails">
    <?php foreach ($data['gambar'] as $gambar): ?>
      <img src="<?= $gambar; ?>" onclick="showImage('<?= $gambar; ?>')" alt="Thumbnail">
    <?php endforeach; ?>
  </div>

  <!-- Konten Detail -->
  <div class="content-container">
    <div class="left-section">
      <div class="title"><?= $data['tipe']; ?></div>
      <div class="location"><?= $data['lokasi']; ?></div>

      <div class="features">
        <?php foreach ($data['fasilitas'] as $fasilitas): ?>
          <div class="feature"><?= $fasilitas; ?></div>
        <?php endforeach; ?>
      </div>

      <div class="description"><?= $data['deskripsi']; ?></div>
    </div>

    <div class="right-section">
      <div class="price-box">
        <strong><?= reset($data['harga']); ?> - <?= end($data['harga']); ?></strong>
        <?php foreach ($data['harga'] as $durasi => $harga): ?>
          <div><?= $durasi ?> : <?= $harga ?></div>
        <?php endforeach; ?>
      </div>
      <a href="#" class="btn">Sewa Sekarang</a>
    </div>
  </div>

  <!-- Peta Lokasi -->
  <div class="map-section">
    <h3>Lokasi Properti</h3>
    <iframe 
      src="https://www.google.com/maps?q=<?= $data['latitude']; ?>,<?= $data['longitude']; ?>&hl=id&z=16&output=embed" 
      allowfullscreen 
      loading="lazy" 
      referrerpolicy="no-referrer-when-downgrade">
    </iframe>
  </div>
</div>

<script>
  function showImage(src) {
    document.getElementById('mainDisplay').src = src;
  }
</script>

<?php include 'footer.php'; ?>
</body>
</html>
