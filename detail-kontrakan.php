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
        .container {
            max-width: 900px;
            margin: 50px auto;
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h2 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
        }
        .main-image {
            width: 100%;
            height: 450px;
            margin-bottom: 20px;
            overflow: hidden;
            border-radius: 10px;
        }
        .main-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .thumbnails {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .thumbnails img {
            width: 150px;
            height: 90px;
            object-fit: cover;
            border-radius: 5px;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .thumbnails img:hover {
            transform: scale(1.05);
        }
        .description {
            text-align: center;
            font-size: 16px;
            color: #555;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
<?php
$id = isset($_GET['id']) ? (int)$_GET['id'] : 1;

// Simulasi data dummy sesuai id
$kontrakans = [
    1 => [
        'tipe' => 'Tipe 1',
        'deskripsi' => 'Hunian nyaman cocok untuk pekerja.',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg']
    ],
    2 => [
        'tipe' => 'Tipe 2',
        'deskripsi' => 'Kontrakan dengan ruang tamu luas.',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg']
    ],
    3 => [
        'tipe' => 'Tipe 3',
        'deskripsi' => 'Cocok untuk keluarga kecil.',
        'gambar' => ['gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg', 'gambar/kontrakan.jpg']
    ],
];


$data = isset($kontrakans[$id]) ? $kontrakans[$id] : $kontrakans[1];
?>
<div class="container">
    <h2><?php echo $data['tipe']; ?></h2>
    <p class="description"><?php echo $data['deskripsi']; ?></p>

    <div class="main-image">
        <img id="mainDisplay" src="<?php echo $data['gambar'][0]; ?>" alt="Gambar Utama">
    </div>

    <div class="thumbnails">
        <?php foreach ($data['gambar'] as $gambar): ?>
            <img src="<?php echo $gambar; ?>" alt="Thumbnail" onclick="showImage('<?php echo $gambar; ?>')">
        <?php endforeach; ?>
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
