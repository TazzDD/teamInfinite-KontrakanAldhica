// KODE FINAL AUTH.JS UNTUK PROYEK BARU

document.addEventListener('DOMContentLoaded', () => {
    const handleFormSubmit = async (form, url, isLogin) => {
        const messageDiv = document.getElementById('message-container');
        if (!messageDiv) return;
        messageDiv.textContent = '';

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (!isLogin && data.password !== data.confirmPassword) {
            messageDiv.textContent = 'Konfirmasi password tidak cocok!';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            messageDiv.textContent = result.message;

            if (response.ok) {
                messageDiv.style.color = 'green';
                setTimeout(() => {
                    window.location.href = isLogin ? '/index.html' : '/login.html';
                }, 1500);
            } else {
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Tidak dapat terhubung ke server.';
            messageDiv.style.color = 'red';
        }
    };

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
            };
            handleFormSubmit(loginForm, '/api/login', true, data);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                phone: document.getElementById('reg-phone').value,
                password: document.getElementById('reg-pass').value,
                confirmPassword: document.getElementById('reg-pass-confirm').value,
            };
            handleFormSubmit(registerForm, '/api/register', false, data);
        });
    }
});