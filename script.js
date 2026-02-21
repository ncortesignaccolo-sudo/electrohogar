const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

// Close demo banner
(() => {
  const banner = qs("#proposalBanner");
  const close = qs("#proposalClose");
  if (!banner || !close) return;

  const key = "demo_banner_closed_osuna";
  if (localStorage.getItem(key) === "1") {
    banner.style.display = "none";
    return;
  }

  close.addEventListener("click", () => {
    banner.style.display = "none";
    localStorage.setItem(key, "1");
  });
})();

// Mobile nav toggle
(() => {
  const btn = qs("#navToggle");
  const nav = qs("#mobileNav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  qsa("#mobileNav a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
})();

// Reveal on scroll
(() => {
  const items = qsa(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
})();

// Horario: L-V 10:00–13:30, 17:00–20:00 | S 10:00–13:30 | D cerrado
(() => {
  const el = qs("#estado-horario");
  const elHero = qs("#estado-horario-hero");
  const now = new Date();

  const day = now.getDay(); // 0 domingo
  const minutes = now.getHours() * 60 + now.getMinutes();
  const inRange = (m, a, b) => m >= a && m <= b;

  const LV_1 = [10 * 60, 13 * 60 + 30];
  const LV_2 = [17 * 60, 20 * 60];
  const SA = [10 * 60, 13 * 60 + 30];

  let abierto = false;

  if (day >= 1 && day <= 5) {
    abierto = inRange(minutes, LV_1[0], LV_1[1]) || inRange(minutes, LV_2[0], LV_2[1]);
  } else if (day === 6) {
    abierto = inRange(minutes, SA[0], SA[1]);
  } else {
    abierto = false;
  }

  const setHero = () => {
    if (!elHero) return;
    elHero.textContent = abierto ? "Abierto ahora" : "Cerrado ahora";
  };

  const setBadge = () => {
    if (!el) return;
    el.innerHTML = `<span class="status-dot"></span>${abierto ? "Abierto ahora" : "Cerrado ahora"}`;
    el.classList.toggle("abierto", abierto);
    el.classList.toggle("cerrado", !abierto);
  };

  setHero();
  setBadge();
})();
