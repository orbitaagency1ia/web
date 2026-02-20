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

const heroTitle = document.getElementById("heroTitle");
const heroLead = document.getElementById("heroLead");
const heroProof = document.getElementById("heroProof");
const heroBenefit1 = document.getElementById("heroBenefit1");
const heroBenefit2 = document.getElementById("heroBenefit2");
const heroBenefit3 = document.getElementById("heroBenefit3");
const heroPrimaryCta = document.getElementById("heroPrimaryCta");
const heroSecondaryCta = document.getElementById("heroSecondaryCta");
const abBadge = document.getElementById("abBadge");

const AB_STORAGE_KEY = "orbita_ab_autoescuelas";
const AB_VARIANTS = {
  a: {
    titleHtml: 'Tu autoescuela, <span id="wordRotator">automatizada</span>.',
    lead:
      "Si tardas en responder, pierdes matrículas. Órbita responde al instante, filtra interés y mantiene seguimiento hasta cierre.",
    proof: "Empresas que ya están en Órbita.",
    primaryCta: "Diseñar mi Asistente",
    secondaryCta: "Solicitar presupuesto",
    benefits: [
      "Resuelve la mayoría de consultas frecuentes sin espera.",
      "Califica interés y deriva oportunidades con contexto.",
      "Mantiene seguimiento continuo hasta matrícula."
    ],
    rotatorWords: ["automatizada", "ordenada", "en órbita"]
  },
  b: {
    titleHtml: "Cada lead sin respuesta se pierde.",
    lead:
      "Te escriben hoy y deciden hoy. Órbita responde al instante y evita que una consulta caliente acabe en la competencia.",
    proof: "Autoescuelas que ya están en Órbita.",
    primaryCta: "Quiero más matrículas",
    secondaryCta: "Quiero mi presupuesto",
    benefits: [
      "No dejas leads sin respuesta al final del día.",
      "El equipo habla con quien está listo para matricularse.",
      "Tu agenda comercial deja de depender del caos."
    ],
    rotatorWords: []
  }
};

function resolveVariant() {
  const queryVariant = new URLSearchParams(window.location.search).get("ab");
  if (queryVariant === "a" || queryVariant === "b") {
    localStorage.setItem(AB_STORAGE_KEY, queryVariant);
    return queryVariant;
  }

  const storedVariant = localStorage.getItem(AB_STORAGE_KEY);
  if (storedVariant === "a" || storedVariant === "b") return storedVariant;

  const randomVariant = Math.random() < 0.5 ? "a" : "b";
  localStorage.setItem(AB_STORAGE_KEY, randomVariant);
  return randomVariant;
}

let activeVariant = resolveVariant();

function applyHeroVariant(variantKey) {
  const variant = AB_VARIANTS[variantKey] || AB_VARIANTS.a;
  if (!heroTitle || !heroLead || !heroProof || !heroBenefit1 || !heroBenefit2 || !heroBenefit3) return;

  heroTitle.innerHTML = variant.titleHtml;
  heroLead.textContent = variant.lead;
  heroProof.textContent = variant.proof;
  heroBenefit1.textContent = variant.benefits[0];
  heroBenefit2.textContent = variant.benefits[1];
  heroBenefit3.textContent = variant.benefits[2];

  if (heroPrimaryCta) heroPrimaryCta.textContent = variant.primaryCta;
  if (heroSecondaryCta) heroSecondaryCta.textContent = variant.secondaryCta;
  if (abBadge) abBadge.textContent = `Test A/B activo: versión ${variantKey.toUpperCase()}`;

  setupWordRotator(variant.rotatorWords);
}

function setupWordRotator(words) {
  const wordRotator = document.getElementById("wordRotator");
  if (!wordRotator || !Array.isArray(words) || words.length < 2) return;

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % words.length;
    wordRotator.style.opacity = "0";
    wordRotator.style.transform = "translateY(4px)";
    setTimeout(() => {
      wordRotator.textContent = words[idx];
      wordRotator.style.opacity = "1";
      wordRotator.style.transform = "translateY(0)";
    }, 160);
  }, 2600);
}

applyHeroVariant(activeVariant);

function trackLocalEvent(type, payload = {}) {
  const key = "orbita_events";
  const current = JSON.parse(localStorage.getItem(key) || "[]");
  current.push({
    type,
    variant: activeVariant,
    ts: new Date().toISOString(),
    ...payload
  });
  localStorage.setItem(key, JSON.stringify(current));
}

document.querySelectorAll("[data-cta]").forEach((cta) => {
  cta.addEventListener("click", () => {
    const id = cta.getAttribute("data-cta") || "unknown";
    trackLocalEvent("cta_click", { id, href: cta.getAttribute("href") || "" });
  });
});

const revealItems = document.querySelectorAll("[data-reveal]");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterItems = document.querySelectorAll("[data-counter]");
const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.counter || "0");
      animateCounter(entry.target, target, 980);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

counterItems.forEach((item) => counterObserver.observe(item));

function animateCounter(el, target, duration) {
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
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
    payload.source = "orbita-autoescuelas";
    payload.variant = activeVariant;

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
        trackLocalEvent("lead_sent_webhook");
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
          _subject: `Nuevo lead Órbita - ${payload.company || "autoescuela"}`,
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
        trackLocalEvent("lead_sent_formsubmit");
        leadForm.reset();
        return;
      } catch (error) {
        // Continue with mailto fallback.
      }
    }

    const subject = encodeURIComponent(`Nuevo lead Órbita - ${payload.company || ""}`.trim());
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
    trackLocalEvent("lead_saved_local", { reason: "mailto_fallback" });
    leadForm.reset();
  });
}

const chatFeed = document.getElementById("chatFeed");
if (chatFeed) {
  const variations = [
    ["Hola, ¿precio carnet B?", "Te paso precios y plazas esta semana."],
    ["¿Cuándo empieza el intensivo?", "Tenemos inicio lunes y miércoles. ¿Qué horario prefieres?"],
    ["¿Puedo pagar en dos plazos?", "Sí. Te explico las opciones y te reservo llamada."]
  ];

  let index = 0;
  setInterval(() => {
    const bubbles = chatFeed.querySelectorAll(".bubble");
    if (bubbles.length < 4) return;
    index = (index + 1) % variations.length;
    bubbles[0].textContent = variations[index][0];
    bubbles[1].textContent = variations[index][1];
  }, 4200);
}

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
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
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
    const rotateY = (x - 0.5) * 5;
    const rotateX = (0.5 - y) * 4;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      heroVisual.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });
  heroVisual.addEventListener("mouseleave", () => {
    heroVisual.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
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
      star.y += star.z * 0.35;
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
