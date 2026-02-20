const billingButtons = document.querySelectorAll(".billing-btn[data-billing]");
const billingHint = document.getElementById("billingHint");
const priceCells = document.querySelectorAll("td[data-price][data-target]");

function setBilling(mode) {
  const quarterly = mode === "quarterly";

  priceCells.forEach((cell) => {
    const base = Number(cell.dataset.price || "0");
    if (!Number.isFinite(base) || base <= 0) return;

    if (quarterly) {
      const discounted = Math.round(base * 0.92);
      cell.textContent = `${discounted}€`;
    } else {
      cell.textContent = `${base}€`;
    }
  });

  billingButtons.forEach((button) => {
    const active = button.dataset.billing === mode;
    button.classList.toggle("is-active", active);
  });

  if (billingHint) {
    billingHint.textContent = quarterly
      ? "Precio mostrado: mensual equivalente en plan trimestral."
      : "Precio mostrado: mensual.";
  }
}

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setBilling(button.dataset.billing || "monthly");
  });
});

setBilling("monthly");

const modeState = {
  commercial: {
    title: "Avatar comercial",
    text: "Piezas para captar atención, explicar oferta y mover a acción en menos de 60 segundos.",
    bullets: [
      "Guiones para anuncios, web y redes.",
      "Mensajes consistentes con tu posicionamiento.",
      "Flujo de publicación continuo."
    ]
  },
  onboarding: {
    title: "Avatar de onboarding",
    text: "Vídeos para activar nuevos clientes y reducir fricción en los primeros pasos.",
    bullets: [
      "Bienvenida y primeros pasos claros.",
      "Explicación de proceso sin carga para soporte.",
      "Menos dudas repetidas en el arranque."
    ]
  },
  support: {
    title: "Avatar de soporte",
    text: "Respuestas visuales para preguntas frecuentes, incidencias y educación continua.",
    bullets: [
      "Tutoriales rápidos por tema.",
      "Actualizaciones de producto más ágiles.",
      "Escalado a humano cuando corresponde."
    ]
  }
};

const modeButtons = document.querySelectorAll(".mode-btn[data-mode]");
const modeTitle = document.getElementById("modeTitle");
const modeText = document.getElementById("modeText");
const modeBullets = document.getElementById("modeBullets");

function setMode(mode) {
  const data = modeState[mode];
  if (!data || !modeTitle || !modeText || !modeBullets) return;

  modeTitle.textContent = data.title;
  modeText.textContent = data.text;
  modeBullets.innerHTML = data.bullets.map((item) => `<li>${item}</li>`).join("");

  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode || "commercial");
  });
});

setMode("commercial");
