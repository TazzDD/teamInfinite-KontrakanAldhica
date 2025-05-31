<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Daftar Akun</title>
  <style>
    body {
      margin: 0;
      font-family: 'Segoe UI', sans-serif;
      background-color: #e0f7ff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #e0f7ff;
      border-radius: 10px;
      padding: 40px 30px;
      width: 90%;
      max-width: 400px;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .container h2 {
      margin-bottom: 30px;
      font-size: 24px;
      color: #1c1c1c;
    }

    .form-group {
      margin-bottom: 15px;
    }

    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="password"] {
      width: 95%;
      height: 20px;
      padding: 15px 10px;
      border: none;
      border-radius: 8px;
      background-color: #f9f9f9;
      font-size: 14px;
    }

    .row {
      display: flex;
      gap: 10px;
    }

    .row input {
      flex: 1;
    }

    .btn {
      width: 100%;
      background-color: #0c1b2a;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 10px;
    }

    .btn:hover {
      background-color: #0a1724;
    }

    .login-link {
      margin-top: 15px;
      font-size: 14px;
      color: #333;
    }

    .login-link b {
      color: #000;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Daftar Akun</h2>
    <form>
      <div class="form-group">
        <input type="text" placeholder="Nama Lengkap" required>
      </div>
      <div class="form-group">
        <input type="email" placeholder="Alamat Email" required>
      </div>
      <div class="form-group">
        <input type="tel" placeholder="No Telp (Wa)" required>
      </div>
      <div class="form-group row">
        <input type="password" placeholder="Password" required>
        <input type="password" placeholder="Konfirmasi Password" required>
      </div>
      <button type="submit" class="btn">Daftar</button>
      <div class="login-link">
        Sudah punya akun ? <b>Masuk</b>
      </div>
    </form>
  </div>
</body>
</html>
