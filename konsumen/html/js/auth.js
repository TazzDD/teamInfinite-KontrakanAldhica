// auth.js - Satu file terpusat untuk login, register, profile, dan navbar

// Cek status login dan update navbar
function updateNavbarBasedOnLoginStatus() {
  const nav = document.querySelector(".nav-links");
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const user = JSON.parse(localStorage.getItem("user"));
  if (!nav) return;

  // Hapus elemen lama untuk mencegah duplikasi
  nav.querySelectorAll("#daftar-link, #masuk-link,  a.nav-logout").forEach(el => el.remove());
  nav.querySelector("img.profile-icon")?.remove();
  [...nav.querySelectorAll("a")].forEach(link => {
    if (link.textContent === "Pesanan") link.remove();
  });

  const kontakButton = nav.querySelector(".contact-button");

  if (isLoggedIn && user) {
    const pesananLink = document.createElement("a");
    pesananLink.href = "pesanan.html";
    pesananLink.textContent = "Pesanan";
    nav.insertBefore(pesananLink, kontakButton);

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
    const loginLink = document.createElement("a");
    loginLink.id = "masuk-link";
    loginLink.href = "login.html";
    loginLink.textContent = "Masuk";

    const daftarLink = document.createElement("a");
    daftarLink.id = "daftar-link";
    daftarLink.href = "daftar.html";
    daftarLink.textContent = "Daftar";

    nav.insertBefore(daftarLink, kontakButton);
    nav.insertBefore(loginLink, kontakButton);
  }
}

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

function logoutUser() {
  const yakin = confirm("Apakah Anda yakin ingin logout?");
  if (yakin) {
    localStorage.setItem("loggedIn", "false");
    window.location.href = "index.html";
  }
}

function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  document.getElementById("first-name").value = user.name?.split(" ")[0] || "";
  document.getElementById("last-name").value = user.name?.split(" ")[1] || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("phone").value = user.phone || "";
  document.getElementById("address").value = user.address || "";
  document.getElementById("city").value = user.city || "";
  document.getElementById("province").value = user.province || "";
  document.getElementById("zip").value = user.zip || "";
  document.getElementById("profile-image").src = user.photo || "gambar/avatar.png";
}

function saveProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  const firstName = document.getElementById("first-name").value.trim();
  const lastName = document.getElementById("last-name").value.trim();
  user.name = `${firstName} ${lastName}`;
  user.email = document.getElementById("email").value.trim();
  user.phone = document.getElementById("phone").value.trim();
  user.address = document.getElementById("address").value.trim();
  user.city = document.getElementById("city").value.trim();
  user.province = document.getElementById("province").value.trim();
  user.zip = document.getElementById("zip").value.trim();
  user.photo = document.getElementById("profile-image").src;

  localStorage.setItem("user", JSON.stringify(user));
  alert("Profil berhasil disimpan!");
  updateNavbarBasedOnLoginStatus();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const base64 = reader.result;
    document.getElementById("profile-image").src = base64;

    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user.photo = base64;
      localStorage.setItem("user", JSON.stringify(user));
      updateNavbarBasedOnLoginStatus();
    }
  };
  reader.readAsDataURL(file);
}

function deleteProfileImage() {
  const defaultImage = "gambar/avatar.png";
  document.getElementById("profile-image").src = defaultImage;

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user.photo = defaultImage;
    localStorage.setItem("user", JSON.stringify(user));
    updateNavbarBasedOnLoginStatus();
  }
}

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
    document.getElementById("upload-img")?.addEventListener("change", handleImageUpload);
    document.querySelector(".delete-icon")?.addEventListener("click", deleteProfileImage);
  }
});
