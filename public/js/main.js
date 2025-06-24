// Menunggu seluruh konten halaman dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // Interaktivitas untuk Tombol Analisis AI
    // ...
    const aiButton = document.getElementById('ai-analysis-btn');
    if (aiButton) {
    aiButton.addEventListener('click', () => {
        // Baris ini akan mengarahkan browser ke halaman analisis.html
        window.location.href = 'analisis.html'; 
    });
    }
    // ...

  // Interaktivitas untuk Animasi Scroll
  const animatedElements = document.querySelectorAll('.card, .ai-analysis-section, .location-perks-container');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Hentikan observasi setelah animasi berjalan
      }
    });
  }, {
    threshold: 0.1 // Animasi berjalan saat 10% elemen terlihat
  });

  animatedElements.forEach(el => {
    observer.observe(el);
  });

});