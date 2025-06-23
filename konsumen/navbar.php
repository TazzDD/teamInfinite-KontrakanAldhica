<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kontrakan Aldhica</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #e6f7ff; 
    }

    header {
      background-color: #e6f7ff; 
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 40px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .brand {
      font-weight: bold;
      font-size: 1.2rem;
      color: #1d2d3c;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-links a {
      text-decoration: none;
      color: #1d2d3c;
      font-weight: 500;
      padding: 6px 10px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .nav-links a:hover {
      background-color: #d9f0ff;
    }

    .contact-button {
      background-color: #1d2d3c;
      color: white !important;
      padding: 6px 14px;
      border-radius: 20px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .contact-button:hover {
      background-color: #142c3d;
    }

    body {
      padding-top: 60px;
    }
  </style>
</head>
<body>
  <header>
    <a href="#" class="brand">Aldhica</a>
    <nav class="nav-links">
      <a href="html/index.html">Beranda</a>
      <a href="html/peraturan.html">Peraturan</a>
      <a href="html/daftar.html">Daftar</a>
      <a href="html/login.html">Masuk</a>
      <a href="html/kontak.html" class="contact-button">Kontak</a>
    </nav>
  </header>
</body>
</html>
