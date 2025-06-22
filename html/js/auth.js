// auth.js - Satu file terpusat untuk login, register, profile, dan navbar

// Cek status login dan update navbar
function updateNavbarBasedOnLoginStatus() {
  const nav = document.querySelector(".nav-links");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  if (!nav) return;

  // Hapus elemen lama untuk mencegah duplikasi
  nav.querySelectorAll("#masuk-link, #daftar-link, a.nav-logout").forEach(el => el.remove());
  nav.querySelector("img.profile-icon")?.remove();

  const kontakButton = nav.querySelector(".contact-button");

  if (isLoggedIn && user) {
    // Tambahkan gambar profil
    const profilePic = document.createElement("img");
    profilePic.src = user.photo || "gambar/avatar.png";
    profilePic.alt = "Profil";
    profilePic.className = "profile-icon";
    profilePic.style.width = "32px";
    profilePic.style.height = "32px";
    profilePic.style.borderRadius = "50%";
    profilePic.style.cursor = "pointer";
    profilePic.style.border = "2px solid #1d2d3c";
    profilePic.onclick = () => window.location.href = "profile.html";

    // Tambahkan tombol logout
    const logoutLink = document.createElement("a");
    logoutLink.href = "#";
    logoutLink.textContent = "Logout";
    logoutLink.className = "nav-logout";
    logoutLink.onclick = (e) => {
      e.preventDefault();
      logoutUser();
    };

    nav.insertBefore(profilePic, kontakButton?.nextSibling);
    nav.insertBefore(logoutLink, profilePic.nextSibling);
  } else {
    // Jika belum login, tambahkan sebelum tombol kontak
    const loginLink = document.createElement("a");
    loginLink.id = "masuk-link";
    loginLink.href = "login.html";
    loginLink.textContent = "Masuk";

    const daftarLink = document.createElement("a");
    daftarLink.id = "daftar-link";
    daftarLink.href = "daftar.html";
    daftarLink.textContent = "Daftar";

    nav.insertBefore(loginLink, kontakButton);
    nav.insertBefore(daftarLink, kontakButton);
  }
}

// Fungsi untuk register
function registerUser(event) {
  event.preventDefault();
  const name = document.querySelector('input[placeholder="Nama Lengkap"]').value;
  const email = document.querySelector('input[placeholder="Alamat Email"]').value;
  const password = document.querySelector('input[placeholder="Password"]').value;
  const confirmPassword = document.querySelector('input[placeholder="Konfirmasi Password"]').value;

  if (password !== confirmPassword) {
    alert("Konfirmasi password tidak cocok.");
    return false;
  }

  const user = {
    name,
    email,
    password,
    photo: "gambar/avatar.png"
  };

  localStorage.setItem("user", JSON.stringify(user));
  alert("Pendaftaran berhasil! Silakan login.");
  window.location.href = "login.html";
  return false;
}

// Fungsi untuk login
function loginUser(event) {
  event.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || email !== user.email || password !== user.password) {
    alert("Email atau password salah!");
    return false;
  }

  localStorage.setItem("loggedIn", "true");
  alert("Login berhasil!");
  window.location.href = "index.html";
  return false;
}

// Fungsi logout
function logoutUser() {
  const yakin = confirm("Apakah Anda yakin ingin logout?");
  if (yakin) {
    localStorage.setItem("loggedIn", "false");
    window.location.href = "index.html";
  }
}

// Fungsi load profil
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const nameInput = document.getElementById("name-input");
  const profileImage = document.getElementById("profile-image");
  if (nameInput) nameInput.value = user.name || "";
  if (profileImage) profileImage.src = user.photo || "gambar/avatar.png";
}

// Simpan perubahan profil
function saveProfile() {
  const name = document.getElementById("name-input").value;
  const profileImage = document.getElementById("profile-image").src;
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    user.name = name;
    user.photo = profileImage;
    localStorage.setItem("user", JSON.stringify(user));
    alert("Profil berhasil disimpan!");
  }
}

// Proses gambar upload
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("profile-image").src = reader.result;
  };
  reader.readAsDataURL(file);
}

// Jalankan saat halaman siap
window.addEventListener("DOMContentLoaded", () => {
  updateNavbarBasedOnLoginStatus();

  const page = window.location.pathname;
  if (page.includes("login.html")) {
    document.querySelector("form")?.addEventListener("submit", loginUser);
  }
  if (page.includes("daftar.html")) {
    document.querySelector("form")?.addEventListener("submit", registerUser);
  }
  if (page.includes("profile.html")) {
    loadProfile();
    document.getElementById("save-profile")?.addEventListener("click", saveProfile);
    document.getElementById("logout-button")?.addEventListener("click", logoutUser);
    document.getElementById("image-upload")?.addEventListener("change", handleImageUpload);
  }
});
