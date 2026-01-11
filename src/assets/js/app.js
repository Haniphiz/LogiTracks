import { AUTH_CONFIG } from "./config/auth-config.js";

// --- KONFIGURASI GLOBAL ---
const sections = ["navbar", "hero", "services", "products", "about", "testimonials", "gallery", "team", "kontak", "footer"];

// --- FUNGSI UTAMA ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. CEK STATUS LOGIN (Untuk Navbar)
  checkLoginStatus();

  function validateLogin(username, password) {
    return username === AUTH_CONFIG.username && password === AUTH_CONFIG.password;
  }

  // 2. LOGIKA HALAMAN LOGIN
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const usernameInput = document.getElementById("username").value;
      const passwordInput = document.getElementById("password").value;

      if (validateLogin(usernameInput, passwordInput)) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", usernameInput);
        alert("Login Berhasil!");
        window.location.href = "../index.html";
      } else {
        const errorMsg = document.getElementById("error-msg");
        if (errorMsg) {
          errorMsg.style.display = "block";
          setTimeout(() => {
            errorMsg.style.display = "none";
          }, 3000);
        }
      }
    });
  }

  // 3. LOGIKA LOADING SECTIONS
  if (document.getElementById("navbar")) {
    sections.forEach((section) => {
      const el = document.getElementById(section);
      if (el) {
        fetch(`sections/${section}.html`)
          .then((res) => res.text())
          .then((html) => {
            el.innerHTML = html;

            if (section === "navbar") initMobileNavbar();
            if (section === "testimonials") initTestimonials();
            if (section === "kontak") initKontakForm(); 
          })
          .catch((err) => console.warn(`Gagal memuat ${section}`));
      }
    });
    initScrollEffects();
  }
}); // Penutup DOMContentLoaded yang benar

// --- FUNGSI PENDUKUNG ---

function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("username");

  setTimeout(() => {
    const loginBtn = document.querySelector('a[href*="login.html"]');

    if (isLoggedIn === "true" && loginBtn) {
      const userMenu = document.createElement("div");
      userMenu.className = "flex items-center gap-4 ml-4";
      userMenu.innerHTML = `
                <span class="text-gray-700 text-sm font-medium">
                    Halo, <b class="text-blue-600">${username}</b>
                </span>
                <button id="logoutBtn" class="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition text-sm">
                    Logout
                </button>
            `;

      loginBtn.parentNode.replaceChild(userMenu, loginBtn);

      document.getElementById("logoutBtn").onclick = () => {
        localStorage.clear();
        window.location.reload();
      };
    }
  }, 500);
}

function initMobileNavbar() {
  const btn = document.getElementById("menu-btn");
  const menu = document.getElementById("mobile-menu");
  if (btn && menu) {
    btn.onclick = () => menu.classList.toggle("hidden");
    menu.querySelectorAll("a").forEach((link) => {
      link.onclick = () => menu.classList.add("hidden");
    });
  }
}

function initScrollEffects() {
  const heroBg = document.querySelector("#hero-bg");
  window.addEventListener("scroll", () => {
    if (heroBg) {
      let offset = window.pageYOffset;
      heroBg.style.transform = `translateY(${offset * 0.5}px)`;
    }
  });
}

function initTestimonials() {
  const cards = document.querySelectorAll(".testimonial-card");
  cards.forEach((card) => {
    card.style.opacity = "1";
    card.style.transform = "translateY(20px)";
    card.style.transition = "all 0.6s ease-out";
  });
}

function initKontakForm() {
  const formKontak = document.getElementById("formKontak");
  if (!formKontak) return;

  formKontak.addEventListener("submit", function (e) {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {
      alert("Silakan login terlebih dahulu sebelum mengirim pesan.");
      window.location.href = "sections/login.html";
      return;
    }

    alert("Pertanyaan mu sedang kami proses, jawaban akan kami kirim secepatnya melalui email terkait. terimakasi");
    formKontak.reset();
  });
}