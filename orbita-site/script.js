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

const scrollProgress = document.getElementById("scrollProgress");

if (scrollProgress) {
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${progress}%`);
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
}

const heroSection = document.getElementById("heroSection");

if (heroSection && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const heroLayers = heroSection.querySelectorAll("[data-parallax-layer]");

  heroSection.addEventListener("pointermove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    heroLayers.forEach((layer) => {
      const depth = Number(layer.getAttribute("data-parallax-layer") || 0);
      const tx = px * 14 * depth;
      const ty = py * 10 * depth;
      layer.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });
  });

  heroSection.addEventListener("pointerleave", () => {
    heroLayers.forEach((layer) => {
      layer.style.transform = "translate3d(0, 0, 0)";
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

const channelState = {
  whatsapp: {
    in: "Hola, quiero saber precios y cuándo podría empezar.",
    out: "Te paso opciones y te reservo llamada para cerrar matrícula.",
    response: "8s",
    coverage: "24/7",
    action: "Lead Cualificado"
  },
  instagram: {
    in: "¿Tenéis plazas para este mes?",
    out: "Sí, te confirmo disponibilidad y te envío propuesta por DM.",
    response: "11s",
    coverage: "24/7",
    action: "Reunión Agendada"
  },
  web: {
    in: "Quiero una demo para mi empresa.",
    out: "Perfecto. En 30 segundos te guiamos y recogemos tus datos clave.",
    response: "6s",
    coverage: "24/7",
    action: "Demo Solicitada"
  },
  voice: {
    in: "Llamo para resolver dudas antes de contratar.",
    out: "Te atiende un agente de voz IA y te deriva al equipo cuando procede.",
    response: "4s",
    coverage: "Laboral + fuera de horario",
    action: "Escalado con contexto"
  }
};

const tabs = document.querySelectorAll(".tab[data-channel]");
const threadIn = document.getElementById("threadIn");
const threadOut = document.getElementById("threadOut");
const metricResponse = document.getElementById("metricResponse");
const metricCoverage = document.getElementById("metricCoverage");
const metricAction = document.getElementById("metricAction");

function setChannel(channel) {
  const data = channelState[channel];
  if (!data || !threadIn || !threadOut || !metricResponse || !metricCoverage || !metricAction) return;

  threadIn.textContent = data.in;
  threadOut.textContent = data.out;
  metricResponse.textContent = data.response;
  metricCoverage.textContent = data.coverage;
  metricAction.textContent = data.action;

  tabs.forEach((tab) => {
    const active = tab.dataset.channel === channel;
    tab.classList.toggle("is-active", active);
    tab.setAttribute("aria-selected", String(active));
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => setChannel(tab.dataset.channel || "whatsapp"));
});

setChannel("whatsapp");

const avatarState = {
  comercial: {
    title: "Un avatar que sí vende",
    text: "Presenta producto, explica oferta y mueve al lead al siguiente paso sin grabarte cada semana.",
    bullets: [
      "Vídeos consistentes con tu tono de marca.",
      "Piezas comerciales para web y campañas.",
      "Actualizaciones rápidas sin rodajes."
    ],
    hue: "190deg"
  },
  soporte: {
    title: "Un avatar que resuelve",
    text: "Responde preguntas frecuentes, evita saturar al equipo y mantiene una experiencia clara.",
    bullets: [
      "Respuestas homogéneas en cada canal.",
      "Menos interrupciones en operaciones.",
      "Escalado a humano con contexto."
    ],
    hue: "225deg"
  },
  onboarding: {
    title: "Un avatar que acompaña",
    text: "Guía alta de clientes, formación inicial y pasos críticos para activar servicios sin fricción.",
    bullets: [
      "Onboarding más rápido y ordenado.",
      "Mensaje claro para nuevos clientes.",
      "Menos tiempo repetido por tu equipo."
    ],
    hue: "165deg"
  }
};

const avatarModes = document.querySelectorAll(".avatar-mode[data-avatar]");
const avatarTitle = document.getElementById("avatarTitle");
const avatarText = document.getElementById("avatarText");
const avatarBullets = document.getElementById("avatarBullets");
const avatarHolo = document.getElementById("avatarHolo");

function setAvatarMode(mode) {
  const data = avatarState[mode];
  if (!data || !avatarTitle || !avatarText || !avatarBullets || !avatarHolo) return;

  avatarTitle.textContent = data.title;
  avatarText.textContent = data.text;
  avatarBullets.innerHTML = data.bullets.map((item) => `<li>${item}</li>`).join("");
  avatarHolo.style.filter = `hue-rotate(${data.hue})`;

  avatarModes.forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.avatar === mode);
  });
}

avatarModes.forEach((btn) => {
  btn.addEventListener("click", () => setAvatarMode(btn.dataset.avatar || "comercial"));
});

setAvatarMode("comercial");

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
    payload.source = "orbita-home";

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
          _subject: `Nuevo lead Órbita - ${payload.company || "empresa"}`,
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
    leadForm.reset();
  });
}

const experienceState = {
  captacion: {
    title: "Captación instantánea",
    text: "Cada consulta entra en un flujo claro de respuesta, cualificación y siguiente paso.",
    points: [
      "Respuesta en segundos en WhatsApp, Instagram y Web.",
      "Filtro inicial para priorizar oportunidades reales.",
      "Escalado humano solo cuando aporta valor."
    ]
  },
  seguimiento: {
    title: "Seguimiento activo",
    text: "Órbita mantiene viva la conversación hasta que el lead decide, sin perseguir manualmente.",
    points: [
      "Recordatorios automatizados con contexto.",
      "Mensajes según etapa del embudo comercial.",
      "Menos oportunidades perdidas por falta de continuidad."
    ]
  },
  avatar: {
    title: "Avatar comercial",
    text: "Genera piezas de venta recurrentes sin depender de grabaciones internas cada semana.",
    points: [
      "Guiones orientados a conversión y claridad.",
      "Publicación continua en canales de adquisición.",
      "Coherencia visual y verbal de marca."
    ]
  },
  voz: {
    title: "Voz de cierre",
    text: "Las llamadas de entrada y salida se gestionan con criterio comercial y derivación inteligente.",
    points: [
      "Atención fuera de horario sin perder leads calientes.",
      "Resumen de contexto antes de pasar a humano.",
      "Menos interrupciones y más foco en cierre."
    ]
  }
};

const experienceCards = document.querySelectorAll(".orbital-card[data-experience]");
const experienceTitle = document.getElementById("experienceTitle");
const experienceText = document.getElementById("experienceText");
const experiencePoints = document.getElementById("experiencePoints");
const orbitalGallery = document.getElementById("orbitalGallery");

function setExperience(mode) {
  const data = experienceState[mode];
  if (!data || !experienceTitle || !experienceText || !experiencePoints) return;

  experienceTitle.textContent = data.title;
  experienceText.textContent = data.text;
  experiencePoints.innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");

  experienceCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.experience === mode);
  });
}

experienceCards.forEach((card) => {
  card.addEventListener("click", () => setExperience(card.dataset.experience || "captacion"));
  card.addEventListener("mouseenter", () => setExperience(card.dataset.experience || "captacion"));
});

if (orbitalGallery) {
  orbitalGallery.addEventListener("mousemove", (event) => {
    const rect = orbitalGallery.getBoundingClientRect();
    const gx = ((event.clientX - rect.left) / rect.width) * 100;
    const gy = ((event.clientY - rect.top) / rect.height) * 100;
    orbitalGallery.style.setProperty("--gx", `${gx}%`);
    orbitalGallery.style.setProperty("--gy", `${gy}%`);
  });
}

setExperience("captacion");

const orbitNodes = document.querySelectorAll(".orbit-node[data-orbit-id]");
const orbitSectorTitle = document.getElementById("orbitSectorTitle");
const orbitSectorImage = document.getElementById("orbitSectorImage");
const orbitSectorDesc = document.getElementById("orbitSectorDesc");
const orbitSectorPoints = document.getElementById("orbitSectorPoints");
const orbitSectorLink = document.getElementById("orbitSectorLink");
const orbitalMap = document.getElementById("orbitalMap");

const orbitSectorState = {
  autoescuelas: {
    title: "Autoescuelas",
    desc: "Responde al instante, cualifica interes y mantiene seguimiento hasta convertir en matricula.",
    points: [
      "Entrada automatica por WhatsApp, Instagram y Web.",
      "Priorizacion de leads con intencion real.",
      "Derivacion al equipo solo cuando toca cerrar."
    ],
    image:
      "./assets/generated/sector-autoescuelas.svg",
    imageAlt: "Vista del sector autoescuelas",
    href: "./autoescuelas.html"
  },
  hoteles: {
    title: "Hoteles",
    desc: "Convierte consultas en reservas directas sin saturar recepcion y sin perder oportunidades fuera de horario.",
    points: [
      "Disponibilidad y tarifas en segundos.",
      "Seguimiento de reservas pendientes.",
      "Recepcion enfocada en experiencia presencial."
    ],
    image:
      "./assets/generated/sector-hoteles.svg",
    imageAlt: "Vista del sector hoteles",
    href: "./hoteles.html"
  },
  restaurantes: {
    title: "Restaurantes",
    desc: "Gestiona reservas, eventos y dudas de carta con respuestas consistentes y accionables.",
    points: [
      "Reserva confirmada en el primer contacto.",
      "Gestion de grupos y eventos con criterio.",
      "Menos interrupciones en sala y cocina."
    ],
    image: "./assets/generated/sector-restaurantes.svg",
    imageAlt: "Vista del sector restaurantes",
    href: "./restaurantes.html"
  },
  clinicas: {
    title: "Clinicas Dentales",
    desc: "Reduce huecos en agenda y mejora conversion con seguimiento inteligente de primeros contactos.",
    points: [
      "Respuestas claras sobre tratamientos y cita.",
      "Recordatorios y reactivacion automatica.",
      "Derivacion humana cuando hay objeciones."
    ],
    image: "./assets/generated/sector-clinicas.svg",
    imageAlt: "Vista del sector clinicas dentales",
    href: "./clinicas-dentales.html"
  },
  inmobiliarias: {
    title: "Inmobiliarias",
    desc: "Filtra compradores o inquilinos con datos clave antes de pasar al equipo comercial.",
    points: [
      "Pre-cualificacion por presupuesto y timing.",
      "Agendado automatico de visitas.",
      "Seguimiento de oportunidades en frio."
    ],
    image:
      "./assets/generated/sector-inmobiliarias.svg",
    imageAlt: "Vista del sector inmobiliarias",
    href: "./inmobiliarias.html"
  },
  concesionarios: {
    title: "Concesionarios",
    desc: "Acelera pruebas y cierre con una atencion comercial siempre activa en todos los canales.",
    points: [
      "Captacion y filtro por modelo de interes.",
      "Agenda de test drive sin friccion.",
      "Ventas centrada en cerrar, no en perseguir."
    ],
    image:
      "./assets/generated/sector-concesionarios.svg",
    imageAlt: "Vista del sector concesionarios",
    href: "./concesionarios.html"
  },
  talleres: {
    title: "Talleres",
    desc: "Organiza citas, incidencias y seguimiento post-servicio sin cortar el ritmo del equipo tecnico.",
    points: [
      "Entrada automatica de solicitudes.",
      "Confirmaciones y avisos en tiempo real.",
      "Mas foco tecnico y menos llamadas repetidas."
    ],
    image:
      "./assets/generated/sector-talleres.svg",
    imageAlt: "Vista del sector talleres",
    href: "./talleres.html"
  },
  avatares: {
    title: "Avatares IA",
    desc: "Genera contenido comercial continuo con guion y ejecucion, sin depender de grabarte cada semana.",
    points: [
      "Videos de venta listos para publicar.",
      "Tono de marca consistente en cada pieza.",
      "Produccion rapida para campañas y redes."
    ],
    image: "./assets/generated/sector-avatares.svg",
    imageAlt: "Vista del servicio de avatares IA",
    href: "./avatares.html"
  }
};

function setOrbitSector(sectorId) {
  const data = orbitSectorState[sectorId];
  if (!data || !orbitSectorTitle || !orbitSectorDesc || !orbitSectorPoints || !orbitSectorLink) return;

  orbitSectorTitle.textContent = data.title;
  if (orbitSectorImage) {
    orbitSectorImage.src = data.image;
    orbitSectorImage.alt = data.imageAlt;
  }
  orbitSectorDesc.textContent = data.desc;
  orbitSectorPoints.innerHTML = data.points.map((point) => `<li>${point}</li>`).join("");
  orbitSectorLink.setAttribute("href", data.href);

  orbitNodes.forEach((node) => {
    node.classList.toggle("is-active", node.dataset.orbitId === sectorId);
  });
}

orbitNodes.forEach((node) => {
  const sectorId = node.dataset.orbitId;
  node.addEventListener("mouseenter", () => setOrbitSector(sectorId || "autoescuelas"));
  node.addEventListener("focus", () => setOrbitSector(sectorId || "autoescuelas"));
  node.addEventListener("click", () => setOrbitSector(sectorId || "autoescuelas"));
});

if (orbitalMap) {
  orbitalMap.addEventListener("mousemove", (event) => {
    const rect = orbitalMap.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    orbitalMap.style.setProperty("--mx", `${mx}%`);
    orbitalMap.style.setProperty("--my", `${my}%`);
  });

  orbitalMap.addEventListener("mouseleave", () => {
    orbitalMap.style.setProperty("--mx", "50%");
    orbitalMap.style.setProperty("--my", "50%");
  });
}

setOrbitSector("autoescuelas");

const responseDelay = document.getElementById("responseDelay");
const delayValue = document.getElementById("delayValue");
const leakValue = document.getElementById("leakValue");
const closeValue = document.getElementById("closeValue");

function updateDelayModel(value) {
  if (!delayValue || !leakValue || !closeValue) return;
  const seconds = Number(value || 0);
  delayValue.textContent = `${seconds}s`;

  if (seconds <= 20) {
    leakValue.textContent = "Bajo";
    leakValue.className = "risk-low";
    closeValue.textContent = "Alta";
    return;
  }

  if (seconds <= 60) {
    leakValue.textContent = "Medio";
    leakValue.className = "risk-medium";
    closeValue.textContent = "Media";
    return;
  }

  leakValue.textContent = "Alto";
  leakValue.className = "risk-high";
  closeValue.textContent = "Baja";
}

if (responseDelay) {
  responseDelay.addEventListener("input", () => updateDelayModel(responseDelay.value));
  updateDelayModel(responseDelay.value);
}

const canvas = document.getElementById("meshBg");
if (canvas) {
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];

  const makeParticles = () => {
    const count = Math.min(52, Math.round((width * height) / 32000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
      r: Math.random() * 1 + 0.3
    }));
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    makeParticles();
  };

  const draw = () => {
    if (!context) return;
    context.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      context.beginPath();
      context.fillStyle = "rgba(194,204,218,0.13)";
      context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      context.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 96) continue;
        const alpha = (1 - dist / 96) * 0.03;
        context.beginPath();
        context.strokeStyle = `rgba(168,180,198,${alpha})`;
        context.lineWidth = 0.7;
        context.moveTo(p.x, p.y);
        context.lineTo(q.x, q.y);
        context.stroke();
      }
    }

    requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
}
