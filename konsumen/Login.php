<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Form Login</title>
    <style>
        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background-color: #1e1e1e;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .login-container {
            background-color: #183342;
            padding: 50px 40px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            text-align: center;
            width: 350px;
        }

        .login-container h2 {
            color: #f1f5f9;
            font-size: 48px;
            margin-bottom: 40px;
            font-weight: bold;
        }

        .input-field {
            width: 100%;
            padding: 15px 5px;
            margin-bottom: 20px;
            border: none;
            border-radius: 40px;
            background-color: #f1f5f9;
            font-size: 18px;
            color: #1e293b;
        }

        .input-field::placeholder {
            color: #a0aec0;
        }

        .btn {
            width: 100%;
            padding: 15px 20px;
            border: none;
            border-radius: 40px;
            background-color: #e2e8f0;
            color: #1e293b;
            font-size: 24px;
            font-weight: bold;
            cursor: pointer;
            margin-top: 10px;
        }

        .btn:hover {
            background-color: #cbd5e1;
        }

        .register-link {
            margin-top: 30px;
            color: #f1f5f9;
            font-size: 16px;
        }

        .register-link a {
            color: #f1f5f9;
            font-weight: bold;
            text-decoration: none;
        }

        .register-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>

<body>
    <div class="login-container">
        <h2>Masuk</h2>
        <input type="email" class="input-field" placeholder="Alamat Email" />
        <input type="password" class="input-field" placeholder="Password" />
        <button class="btn">Masuk</button>
        <div class="register-link">
            Belum punya akun ? <a href="#">Daftar</a>
        </div>
    </div>
</body>

</html>