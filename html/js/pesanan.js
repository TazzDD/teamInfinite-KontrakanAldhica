document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pesanan-list");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const pesanan = JSON.parse(localStorage.getItem("pesanan")) || [];

  if (!isLoggedIn) {
    container.innerHTML = "<p>Silakan login untuk melihat pesanan Anda.</p>";
    return;
  }

  if (pesanan.length === 0) {
    container.innerHTML = "<p>Anda belum memiliki pesanan.</p>";
    return;
  }

  pesanan.forEach((item, index) => {
    const box = document.createElement("div");
    box.className = "pesanan-box";

    const statusText = item.status === "dibayar"
      ? `<span class="status-lunas">Sudah Dibayar</span>`
      : `<span class="status-belum">Belum Dibayar</span>`;

    box.innerHTML = `
      <h3>${item.tipe}</h3>
      <p>Durasi: ${item.durasi}</p>
      <p>Harga: ${item.harga}</p>
      <p>Status: ${statusText}</p>
    `;

    if (item.status !== "dibayar") {
      const btn = document.createElement("button");
      btn.textContent = "Bayar Sekarang";
      btn.className = "btn-bayar";
      btn.onclick = () => {
        const konfirmasi = confirm(`Bayar sekarang sebesar ${item.harga}?`);
        if (konfirmasi) {
          item.status = "dibayar";
          localStorage.setItem("pesanan", JSON.stringify(pesanan));
          alert("Pembayaran berhasil dikonfirmasi.");
          location.reload();
        }
      };
      box.appendChild(btn);
    }

    container.appendChild(box);
  });
});
