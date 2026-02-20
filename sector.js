const menuBtn = document.getElementById("menuBtn");
const navList = document.getElementById("navList");

if (menuBtn && navList) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    navList.classList.toggle("is-open");
  });

  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      navList.classList.remove("is-open");
      navList.querySelectorAll("details[open]").forEach((node) => node.removeAttribute("open"));
    });
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  let raf = null;
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) * 2 - 1) * 4;
    const rotateX = ((y / rect.height) * 2 - 1) * -4;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  });
});

const heroVisual = document.querySelector(".hero-visual");
if (heroVisual) {
  let raf = null;
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 4;
    const rotateX = (0.5 - y) * 3;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });

  heroVisual.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  });
}

const LEAD_CONFIG = window.ORBITA_LEAD_CONFIG || window.ORBITA_SHEETS_CONFIG || {};
const WEBHOOK_URL = (LEAD_CONFIG.webhookUrl || "").trim();
const FORMSUBMIT_EMAIL = (LEAD_CONFIG.formsubmitEmail || "").trim();
const FORMSUBMIT_ENABLED = LEAD_CONFIG.formsubmitEnabled !== false;
const LEAD_TARGET_EMAIL = FORMSUBMIT_EMAIL || "contacto@orbitaagency.com";
const leadForm = document.getElementById("leadForm");
const formMessage = document.getElementById("formMessage");
if (leadForm && formMessage) {
  leadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = Object.fromEntries(new FormData(leadForm).entries());
    payload.createdAt = new Date().toISOString();

    const sourceField = leadForm.querySelector('input[name="source"]');
    payload.source = sourceField ? sourceField.value : "orbita-sector";

    const leads = JSON.parse(localStorage.getItem("orbita_leads") || "[]");
    leads.push(payload);
    localStorage.setItem("orbita_leads", JSON.stringify(leads));

    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        formMessage.textContent = "Solicitud enviada. Te contactamos en breve.";
        leadForm.reset();
        return;
      } catch (error) {
        // Continue with fallback channels.
      }
    }

    if (FORMSUBMIT_ENABLED && FORMSUBMIT_EMAIL) {
      try {
        const formSubmitPayload = {
          ...payload,
          _subject: `Nuevo lead Órbita - ${payload.company || payload.sector || "empresa"}`,
          _captcha: "false",
          _template: "box"
        };
        await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_EMAIL)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(formSubmitPayload)
        });
        formMessage.textContent =
          "Solicitud enviada correctamente. Te contactamos en breve.";
        leadForm.reset();
        return;
      } catch (error) {
        // Continue with mailto fallback.
      }
    }

    const subject = encodeURIComponent(`Nuevo lead Órbita - ${payload.company || payload.sector || ""}`.trim());
    const body = encodeURIComponent(
      [
        `Nombre: ${payload.name || ""}`,
        `Empresa: ${payload.company || ""}`,
        `Email: ${payload.email || ""}`,
        `Teléfono: ${payload.phone || ""}`,
        `Canal: ${payload.channel || ""}`,
        "",
        "Objetivo:",
        payload.goal || ""
      ].join("\n")
    );
    window.location.href = `mailto:${LEAD_TARGET_EMAIL}?subject=${subject}&body=${body}`;
    formMessage.textContent = "No se pudo enviar al instante. Se abrió tu correo para completar el envío.";
    leadForm.reset();
  });
}

const canvas = document.getElementById("starfield");
if (canvas) {
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];

  const init = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const count = Math.min(220, Math.round((width * height) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.8 + 0.2
    }));
  };

  const draw = () => {
    if (!context) return;
    context.clearRect(0, 0, width, height);

    for (const star of stars) {
      star.y += star.z * 0.33;
      if (star.y > height) {
        star.y = -3;
        star.x = Math.random() * width;
      }

      const radius = star.z * 1.2;
      context.beginPath();
      context.fillStyle = `rgba(196,224,255,${star.a})`;
      context.arc(star.x, star.y, radius, 0, Math.PI * 2);
      context.fill();
    }

    requestAnimationFrame(draw);
  };

  init();
  draw();
  window.addEventListener("resize", init);
}
