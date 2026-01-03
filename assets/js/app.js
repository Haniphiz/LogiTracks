const sections = [
  "navbar",
  "hero",
  "services",
  "products",
  "about",
  "testimonials",
  "gallery",
  "footer"
];

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section, header'); // Termasuk header/hero

    const observerOptions = {
        root: null,
        threshold: 0.5 // Aktif jika 50% bagian terlihat
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) observer.observe(section);
    });
});

sections.forEach(section => {
  fetch(`sections/${section}.html`)
    .then(res => res.text())
    .then(html => {
      document.getElementById(section).innerHTML = html;
    });
});

// Mobile menu
document.addEventListener("click", e => {
  if (e.target.id === "menu-toggle") {
    document.getElementById("mobile-menu").classList.toggle("hidden");
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const heroBg = document.querySelector('#hero-bg');

    // Efek Parallax sederhana saat scroll
    window.addEventListener('scroll', () => {
        let offset = window.pageYOffset;
        if (heroBg) {
            heroBg.style.transform = `translateY(${offset * 0.5}px)`;
        }
    });

    console.log("LogiTracks App Ready!");
});

document.addEventListener('DOMContentLoaded', () => {
  const testimonials = document.querySelectorAll('.testimonial-card');
  
  const revealTestimonials = () => {
    testimonials.forEach((card, index) => {
      const cardTop = card.getBoundingClientRect().top;
      const trigger = window.innerHeight * 0.9;
      
      if (cardTop < trigger) {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 150); // Efek muncul bergantian (stagger)
      }
    });
  };

  // Set initial state untuk animasi
  testimonials.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease-out';
  });

  window.addEventListener('scroll', revealTestimonials);
  revealTestimonials(); // Panggil saat load pertama kali
});

// Fungsi untuk memuat file HTML ke dalam elemen berdasarkan ID
function loadSection(id, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error('Gagal memuat ' + filePath);
            return response.text();
        })
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error('Error:', error));
}

// Panggil semua bagian
document.addEventListener("DOMContentLoaded", function() {
    loadSection('navbar', 'sections/navbar.html');
    loadSection('hero', 'sections/hero.html');
    loadSection('services', 'sections/services.html');
    loadSection('products', 'sections/products.html');
    loadSection('about', 'sections/about.html');
    loadSection('testimonials', 'sections/testimonials.html');
    loadSection('gallery', 'sections/gallery.html');
    loadSection('team', 'sections/team.html');
    loadSection('kontak', 'sections/kontak.html'); 
    loadSection('footer', 'sections/footer.html');
});

