<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Footer Nempel Bawah</title>
    <style>
        * {
            box-sizing: border-box;
        }

        html,
        body {
            height: 100%;
            margin: 0;
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
        }

        .content {
            flex: 1;
        }

        .footer {
            background-color: #e3f5ff;
            padding: 2rem 1rem 0;
        }

        .footer-top {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%;
        }

        .footer-menu {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .site-name {
            margin-right: 1rem;
            color: #1d2d3c;
            font-size: 1.5rem;
            font-weight: bold;
        }

        .divider {
            border-left: 4px solid #1d2d3c;
            height: 60px;
            margin: 0 1rem;
        }

        .nav-links {
            display: flex;
            gap: 1.5rem;
        }

        .nav-links a {
            text-decoration: none;
            color: #1d2d3c;
            font-weight: 500;
        }

        .footer-contact {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .footer-contact a img {
            width: 24px;
            height: 24px;
            transition: filter 0.3s ease;
        }

        .footer-contact a:hover img {
            filter: brightness(0) saturate(100%) invert(34%) sepia(77%) saturate(1900%) hue-rotate(310deg) brightness(90%) contrast(101%);
        }

        .footer-contact span {
            color: #1d2d3c;
            font-weight: 500;
        }

        .footer-bottom {
            background-color: #142c3d;
            color: white;
            text-align: center;
            padding: 0.75rem;
            font-size: 0.875rem;
            margin-top: 2rem;
            /* ⬅ jarak antara kontak dan hak cipta */
            width: 100vw;
            /* ⬅ penuhi seluruh lebar viewport */
            position: relative;
            /* ⬅ hindari absolute agar tidak mengambang */

        }
    </style>
</head>

<body>

    <div class="content">
        <!-- Konten halaman -->
    </div>

    <footer class="footer">
        <div class="footer-top">
            <div class="footer-menu">
                <div class="site-name">Aldhica</div>
                <div class="divider"></div>
                <div class="nav-links">
                    <a href="#">Program</a>
                    <a href="#">Tentang Kami</a>
                    <a href="#">Kontak</a>
                </div>
            </div>
            <div class="footer-contact">
                <a href="https://www.instagram.com/" target="_blank" title="Instagram">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram">
                </a>
                <a href="https://www.youtube.com/" target="_blank" title="YouTube">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/youtube.svg" alt="YouTube">
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" title="WhatsApp">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/whatsapp.svg" alt="WhatsApp">
                </a>
                <span>emailanda@gmail.com</span>
            </div>
        </div>
        <div class="footer-bottom">
            Hak Cipta © 2025 Kontrakan Aldhica, All Rights Reserved
        </div>
    </footer>

</body>

</html>