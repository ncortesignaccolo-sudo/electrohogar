// Helpers
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

/* Close topbar */
const topbar = $("#topbar");
const closeTopbar = $("#closeTopbar");
if (closeTopbar) {
  closeTopbar.addEventListener("click", () => topbar?.remove());
}

/* Mobile menu */
const header = $("#header");
const burger = $("#burger");
const mobileNav = $("#mobileNav");

if (burger && header) {
  burger.addEventListener("click", () => {
    const open = header.classList.toggle("open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    mobileNav?.setAttribute("aria-hidden", open ? "false" : "true");
  });

  // close on link click
  $$("#mobileNav a").forEach(a => {
    a.addEventListener("click", () => {
      header.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      mobileNav?.setAttribute("aria-hidden", "true");
    });
  });
}

/* Reveal on scroll */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("show");
  });
}, { threshold: 0.14 });

$$(".reveal").forEach(el => io.observe(el));

/* Year */
$("#year").textContent = new Date().getFullYear();

/* Reviews data (puedes editar estas reseñas a tu gusto) */
const reviews = [
  { text: "Calidad al mejor precio y lo mejor de todo la atención. Trato humano y servicio estupendo.", meta: "Local Guide · 5★" },
  { text: "Gran variedad y atención cercana y personalizada. Precios competitivos.", meta: "Cliente · 5★" },
  { text: "Muy buenos precios y buen trato. Informan bien y te asesoran en todo.", meta: "Cliente · 5★" },
  { text: "Empresa seria, servicio muy bueno. La aconsejo.", meta: "Cliente · 5★" }
];

let rIndex = 0;
const reviewText = $("#reviewText");
const reviewMeta = $("#reviewMeta");
function renderReview() {
  const r = reviews[rIndex];
  reviewText.textContent = r.text;
  reviewMeta.textContent = r.meta;
}
$("#prevReview")?.addEventListener("click", () => {
  rIndex = (rIndex - 1 + reviews.length) % reviews.length;
  renderReview();
});
$("#nextReview")?.addEventListener("click", () => {
  rIndex = (rIndex + 1) % reviews.length;
  renderReview();
});
renderReview();

// Auto-rotate
setInterval(() => {
  rIndex = (rIndex + 1) % reviews.length;
  renderReview();
}, 7000);

/* Counter animation (reseñas) */
const countEl = $("#count");
const ratingEl = $("#rating");
ratingEl.textContent = "4,8";
const targetCount = 23; // cambia a la cifra que quieras mostrar
let current = 0;
const counterIO = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting) return;
  counterIO.disconnect();

  const tick = () => {
    current += Math.ceil((targetCount - current) / 8);
    if (current >= targetCount) current = targetCount;
    countEl.textContent = String(current);
    if (current < targetCount) requestAnimationFrame(tick);
  };
  tick();
}, { threshold: 0.25 });

if (countEl) counterIO.observe(countEl);

/* Open/Closed status based on schedule (Osuna) */
function isOpenNow() {
  const now = new Date();
  const day = now.getDay(); // 0 Sunday
  const minutes = now.getHours() * 60 + now.getMinutes();

  // Horario:
  // Sat: 10:00–13:30
  // Sun: closed
  // Mon-Fri: 10:00–13:30, 17:00–20:00
  const inRange = (startH, startM, endH, endM) => {
    const a = startH * 60 + startM;
    const b = endH * 60 + endM;
    return minutes >= a && minutes <= b;
  };

  if (day === 0) return false; // Sunday
  if (day === 6) return inRange(10,0,13,30);

  // Mon-Fri
  return inRange(10,0,13,30) || inRange(17,0,20,0);
}

const statusText = $("#statusText");
const dot = $("#dot");

function updateStatus() {
  const open = isOpenNow();
  if (statusText) statusText.textContent = open ? "Abierto ahora" : "Cerrado ahora";
  if (dot) dot.style.background = open ? "#22c55e" : "#ef4444";
  if (dot) dot.style.animation = open ? "pulse 1.7s infinite" : "none";
  if (!open && dot) dot.style.boxShadow = "0 0 0 0 rgba(239,68,68,.0)";
}
updateStatus();
setInterval(updateStatus, 60000);
