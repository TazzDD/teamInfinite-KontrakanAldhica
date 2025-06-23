<?php include 'navbar.php'; ?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard - Kontrakan Aldhica</title>
    <style>
        body {
            margin: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }

     
        .banner {
            position: relative;
            width: 100%;
            height: 420px;
        }

        .banner img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .banner-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(255, 255, 255, 0.85);
            padding: 20px 30px;
            border-radius: 10px;
            text-align: center;
            max-width: 80%;
        }

        .banner-text h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
            color: #222;
        }

        .banner-text p {
            margin-top: 10px;
            font-size: 16px;
            color: #333;
        }


        .container {
            max-width: 1100px;
            margin: 50px auto;
            padding: 0 20px;
        }

        .container h2 {
            text-align: center;
            margin-bottom: 40px;
            font-size: 26px;
            color: #333;
        }

        .cards {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 20px;
        }

        .card {
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            flex: 1 1 calc(33.333% - 20px);
            display: flex;
            flex-direction: column;
        }

        .card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
        }

        .card-content {
            padding: 20px;
            flex-grow: 1;
        }

        .card-content h3 {
            margin-top: 0;
            font-size: 18px;
            color: #333;
        }

        .card-content p {
            font-size: 14px;
            color: #555;
        }

        .card-content a {
            display: inline-block;
            margin-top: 10px;
            padding: 8px 12px;
            background-color: #1e3a8a;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-size: 14px;
        }

        .card-content a:hover {
            background-color: #2563eb;
        }

        @media screen and (max-width: 900px) {
            .cards {
                flex-direction: column;
                align-items: center;
            }

            .card {
                width: 100%;
                max-width: 350px;
            }
        }
    </style>
</head>
<body>


<div class="banner">
    <img src="gambar/kontrakan.jpg" alt="Gambar Kontrakan">
    <div class="banner-text">
        <h1>Selamat Datang di Kontrakan Aldhica</h1>
        <p>Hunian nyaman, aman, dan bersih dengan fasilitas lengkap serta harga yang bersahabat. Berlokasi strategis, cocok untuk pekerja maupun keluarga kecil.</p>
    </div>
</div>


<div class="container">
    <h2>Tersedia</h2>
    <div class="cards">
  
        <div class="card">
            <img src="gambar/kontrakan.jpg" alt="Tipe 1">
            <div class="card-content">
                <h3>Tipe 1</h3>
                <p>Program hunian sederhana dan nyaman dengan akses mudah ke fasilitas umum. Cocok untuk pasangan muda atau pekerja.</p>
                <a href="detail-kontrakan.php?id=1">Baca Selengkapnya</a>
            </div>
        </div>

 
        <div class="card">
            <img src="gambar/kontrakan.jpg" alt="Tipe 2">
            <div class="card-content">
                <h3>Tipe 2</h3>
                <p>Kontrakan tipe sedang dengan tambahan ruang tamu dan dapur yang lebih luas. Ideal untuk keluarga kecil.</p>
                <a href="detail-kontrakan.php?id=2">Baca Selengkapnya</a>
            </div>
        </div>

  
        <div class="card">
            <img src="gambar/kontrakan.jpg" alt="Tipe 3">
            <div class="card-content">
                <h3>Tipe 3</h3>
                <p>Unit dengan kapasitas lebih besar, cocok untuk keluarga dengan anak atau penghuni lebih dari 4 orang.</p>
                <a href="detail-kontrakan.php?id=3">Baca Selengkapnya</a>
            </div>
        </div>
    </div>
</div>

<?php include 'footer.php'; ?>

</body>
</html>
