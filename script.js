const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const desktopNav = document.getElementById("navList");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    mobileNav.classList.toggle("hidden", expanded);
  });

  const mobileLinks = mobileNav.querySelectorAll("a");
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.classList.add("hidden");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.classList.add("hidden");
    }
  });
}

if (desktopNav && menuBtn) {
  desktopNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (!mobileNav) return;
      menuBtn.setAttribute("aria-expanded", "false");
      mobileNav.classList.add("hidden");
    });
  });
}

const scrollProgress = document.getElementById("scrollProgress");

if (scrollProgress) {
  const updateScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? Math.min((window.scrollY / max) * 100, 100) : 0;
    scrollProgress.style.width = `${progress}%`;
  };

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
}

const revealItems = document.querySelectorAll(".reveal");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const timelineWrap = document.getElementById("timelineWrap");
if (timelineWrap) {
  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        timelineWrap.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  timelineObserver.observe(timelineWrap);
}

const counters = document.querySelectorAll(".counter[data-target]");

function animateCounter(node) {
  const target = Number(node.dataset.target || 0);
  const prefix = node.dataset.prefix || "";
  const suffix = node.dataset.suffix || "";
  const duration = 1000;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * progress);
    node.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

const particlesCanvas = document.getElementById("spaceParticles");

if (particlesCanvas && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const ctx = particlesCanvas.getContext("2d");
  const particles = [];
  const particleCount = Math.min(70, Math.max(38, Math.floor(window.innerWidth / 26)));

  function resizeCanvas() {
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      size: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.2
    };
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) particles.push(makeParticle());
  }

  function drawParticles() {
    ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > particlesCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particlesCanvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.fillStyle = `rgba(214,228,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(125,146,255,${opacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });
}

const LEAD_CONFIG = window.ORBITA_LEAD_CONFIG || {};
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

        formMessage.textContent = "Solicitud enviada correctamente. Te contactamos en breve.";
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

const currentYear = document.getElementById("currentYear");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
