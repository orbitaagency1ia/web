(function () {
  if (window.__orbitaBotpressBooted) return;
  window.__orbitaBotpressBooted = true;

  const BOT_ID = "e04e6ee4-e93c-46c7-9478-615a5c7c3f8c";
  const CLIENT_ID = "7aac0e48-e4a4-42c8-99a5-44ba10273909";

  function injectStyles() {
    if (document.getElementById("orbitaBotpressStyles")) return;

    const style = document.createElement("style");
    style.id = "orbitaBotpressStyles";
    style.textContent = `
      .bpFab {
        display: block !important;
        right: 18px !important;
        bottom: 18px !important;
        z-index: 99999 !important;
      }

      .bpw-powered,
      .bpw-powered-container,
      .bpw-footer,
      .bpw-attribution,
      .bpw-attribution-link,
      footer.bpw-footer {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  function loadScript() {
    if (window.botpress) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://cdn.botpress.cloud/webchat/v3.3/inject.js"]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function initBotpress() {
    if (!window.botpress || window.__orbitaBotpressInitialized) return;
    window.__orbitaBotpressInitialized = true;

    const avatarUrl = `${window.location.origin}/assets/orbita-logo-original.png`;

    window.botpress.on("webchat:ready", () => {
      // No abrimos automaticamente el chat.
    });

    window.botpress.init({
      botId: BOT_ID,
      clientId: CLIENT_ID,
      botName: "Órbita",
      avatarUrl,
      configuration: {
        botName: "Astra",
        avatarUrl,
        themeMode: "dark",
        color: "#111827",
        variant: "solid",
        headerVariant: "glass",
        fontFamily: "inter",
        radius: 8,
        soundEnabled: false,
        feedbackEnabled: false,
        proactiveMessageEnabled: false,
        footer: "",
        showPoweredBy: false
      }
    });
  }

  function boot() {
    injectStyles();
    loadScript().then(initBotpress).catch(() => {
      // Prevent UI break if external script fails.
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
