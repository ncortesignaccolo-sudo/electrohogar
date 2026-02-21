// Close demo strip
const closeDemo = document.getElementById("closeDemo");
const demoStrip = document.getElementById("demoStrip");
if (closeDemo && demoStrip) {
  closeDemo.addEventListener("click", () => {
    demoStrip.style.display = "none";
    // Ajusta el header al quitar el strip
    const header = document.querySelector(".site-header");
    if (header) header.style.top = "0px";
  });
}

// Mobile menu toggle
const burger = document.getElementById("burger");
const mobileNav = document.getElementById("mobileNav");
if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    mobileNav.setAttribute("aria-hidden", String(open));
    mobileNav.classList.toggle("open", !open);
  });

  // Close on click
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
      mobileNav.classList.remove("open");
    });
  });
}

// Reveal on scroll
const items = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("is-visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

items.forEach(el => io.observe(el));

// (Opcional) Estado simple de horario (demo)
const estado = document.getElementById("estado");
const estadoSub = document.getElementById("estadoSub");
const dot = document.getElementById("dot");

function setClosed(msg){
  if (estado) estado.textContent = "Cerrado ahora";
  if (estadoSub) estadoSub.textContent = msg || "Consulta horarios abajo";
  if (dot) {
    dot.style.background = "#ff4d5a";
    dot.style.boxShadow = "0 0 0 6px rgba(255,77,90,.14), 0 0 18px rgba(255,77,90,.35)";
  }
}

function setOpen(msg){
  if (estado) estado.textContent = "Abierto ahora";
  if (estadoSub) estadoSub.textContent = msg || "Disponible";
  if (dot) {
    dot.style.background = "#28d17c";
    dot.style.boxShadow = "0 0 0 6px rgba(40,209,124,.14), 0 0 18px rgba(40,209,124,.35)";
  }
}

// Horario demo (ajústalo si quieres)
(function(){
  const now = new Date();
  const day = now.getDay(); // 0 domingo
  const h = now.getHours() + now.getMinutes()/60;

  // L-V 10:00–13:30 y 17:00–20:00
  // Sáb 10:00–13:30
  // Dom cerrado
  const isWeek = day >= 1 && day <= 5;
  const isSat = day === 6;

  const inMorning = (h >= 10 && h <= 13.5);
  const inAfternoon = (h >= 17 && h <= 20);

  if (day === 0) return setClosed("Domingo");
  if (isSat) return (inMorning ? setOpen("Sábado") : setClosed("Sábado"));
  if (isWeek) return ((inMorning || inAfternoon) ? setOpen("Lunes–Viernes") : setClosed("Fuera de horario"));
})();
