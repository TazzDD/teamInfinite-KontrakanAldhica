document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('kontak-form');
    const messageContainer = document.getElementById('form-message'); 
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const pesan = document.getElementById('pesan').value;
            const submitButton = contactForm.querySelector('button[type="submit"]');

            submitButton.textContent = 'Mengirim...';
            submitButton.disabled = true;
            if (messageContainer) messageContainer.textContent = '';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nama, email, pesan })
                });

                const result = await response.json();

                if (response.ok) {
                    if(messageContainer) {
                        messageContainer.textContent = result.message;
                        messageContainer.style.color = 'green';
                    }
                    contactForm.reset(); 
                } else {
                    if(messageContainer) {
                        messageContainer.textContent = result.message || 'Gagal mengirim pesan.';
                        messageContainer.style.color = 'red';
                    }
                }

            } catch (error) {
                console.error('Error:', error);
                if(messageContainer) {
                    messageContainer.textContent = 'Tidak dapat terhubung ke server.';
                    messageContainer.style.color = 'red';
                }
            } finally {
                submitButton.textContent = 'Kirim Pesan';
                submitButton.disabled = false;
            }
        });
    }
});