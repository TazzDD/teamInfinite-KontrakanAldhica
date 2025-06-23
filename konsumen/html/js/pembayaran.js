document.addEventListener("DOMContentLoaded", function () {
  // Simulasi data dari localStorage (dikirim dari halaman sebelumnya)
  const durasi = localStorage.getItem("durasiPembayaran") || "3 Bulan";
  const harga = localStorage.getItem("hargaPembayaran") || "Rp. 9.000.000";
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  document.getElementById("durasi").textContent = durasi;
  document.getElementById("harga").textContent = harga;

  const statusDiv = document.getElementById("status");
  const konfirmasiBtn = document.getElementById("konfirmasi-btn");

  if (!isLoggedIn) {
    alert("Silakan login terlebih dahulu untuk melakukan pembayaran.");
    window.location.href = "login.html";
    return;
  }

  konfirmasiBtn.addEventListener("click", function () {
  localStorage.setItem("statusPembayaran", "sudah");
  statusDiv.textContent = "✅ Pembayaran berhasil dikonfirmasi.";
  statusDiv.style.color = "green";

  // Tandai pesanan terakhir sebagai dibayar
  const pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];
  if (pesanan.length > 0) {
    pesanan[pesanan.length - 1].status = "dibayar";
    localStorage.setItem("pesanan", JSON.stringify(pesanan));
  }

  // Redirect otomatis ke pesanan.html setelah 1 detik
  setTimeout(() => {
    window.location.href = "pesanan.html";
  }, 1000);
});

});
