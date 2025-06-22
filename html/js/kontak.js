document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("kontak-form");
  if (!form) return;

  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isLoggedIn || !user) {
    alert("Anda harus login terlebih dahulu untuk mengirim pesan.");
    window.location.href = "login.html";
    return;
  }

  // Prefill email jika user sedang login
  document.getElementById("email").value = user.email;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("email").value.trim();
    const pesan = document.getElementById("pesan").value.trim();

    if (!nama || !email || !pesan) {
      alert("Semua kolom wajib diisi.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Format email tidak valid.");
      return;
    }

    if (email !== user.email) {
      alert("Email tidak sesuai dengan akun Anda yang sedang login.");
      return;
    }

    const kontak = JSON.parse(localStorage.getItem("kontak")) || [];
    kontak.push({ nama, email, pesan, waktu: new Date().toISOString() });
    localStorage.setItem("kontak", JSON.stringify(kontak));

    alert("Pesan Anda telah dikirim. Terima kasih!");
    form.reset();
    document.getElementById("email").value = user.email; // isi ulang email
  });
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
