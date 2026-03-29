(() => {
  const APP_ORIGIN = "https://app.liaisonkeyboard.com";
  const ATTR_STORAGE_KEY = "lk_deeplink";
  const AUTH_HINT_KEY = "liaison_auth_hint";
  const COOKIE_CONSENT_KEY = "liaison_cookie_consent";
  const ROOT_COOKIE_DOMAIN = ".liaisonkeyboard.com";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function safeGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Ignore storage failures.
    }
  }

  function safeRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Ignore storage failures.
    }
  }

  function readCookie(name) {
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${name}=`));
    return cookie
      ? decodeURIComponent(cookie.split("=").slice(1).join("="))
      : "";
  }

  function writeCookie(name, value, days = 30) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${
      encodeURIComponent(value)
    }; expires=${expires}; path=/; domain=${ROOT_COOKIE_DOMAIN}; SameSite=Lax; secure`;
  }

  function deleteCookie(name) {
    document.cookie =
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${ROOT_COOKIE_DOMAIN}; SameSite=Lax; secure`;
  }

  function readConsent() {
    const raw = safeGet(COOKIE_CONSENT_KEY) || readCookie(COOKIE_CONSENT_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function writeConsent(consent) {
    const serialized = JSON.stringify(consent);
    safeSet(COOKIE_CONSENT_KEY, serialized);
    writeCookie(COOKIE_CONSENT_KEY, serialized, 180);
  }

  function allowsContinuityCookies(consent = readConsent()) {
    return Boolean(consent?.continuity);
  }

  function clearContinuityStorage() {
    safeRemove(ATTR_STORAGE_KEY);
    safeRemove(AUTH_HINT_KEY);
    deleteCookie(ATTR_STORAGE_KEY);
    deleteCookie(AUTH_HINT_KEY);
  }

  function currentQueryAttribution() {
    const params = new URLSearchParams(window.location.search);
    const next = {};

    ["utm_source", "ref_id", "scenario_id", "prefill"].forEach((key) => {
      const value = params.get(key);
      if (value) {
        next[key] = value;
      }
    });

    return next;
  }

  function currentAttribution() {
    const fromQuery = currentQueryAttribution();

    if (!allowsContinuityCookies()) {
      return fromQuery;
    }

    const stored = safeGet(ATTR_STORAGE_KEY) || readCookie(ATTR_STORAGE_KEY);
    if (!stored) {
      return fromQuery;
    }

    try {
      return { ...JSON.parse(stored), ...fromQuery };
    } catch {
      return fromQuery;
    }
  }

  function captureAttribution() {
    if (!allowsContinuityCookies()) {
      return;
    }

    const next = { ...currentAttribution() };

    if (Object.keys(next).length > 0) {
      const serialized = JSON.stringify(next);
      safeSet(ATTR_STORAGE_KEY, serialized);
      writeCookie(ATTR_STORAGE_KEY, serialized, 30);
    }
  }

  function hasSessionHint() {
    const params = new URLSearchParams(window.location.search);
    const session = params.get("session");

    if (session === "1") {
      if (allowsContinuityCookies()) {
        safeSet(AUTH_HINT_KEY, "1");
        writeCookie(AUTH_HINT_KEY, "1", 14);
      }
      return true;
    }

    if (session === "0") {
      if (allowsContinuityCookies()) {
        safeSet(AUTH_HINT_KEY, "0");
        writeCookie(AUTH_HINT_KEY, "0", 1);
      }
      return false;
    }

    if (!allowsContinuityCookies()) {
      return false;
    }

    return safeGet(AUTH_HINT_KEY) === "1" || readCookie(AUTH_HINT_KEY) === "1";
  }

  function buildAppUrl(path, extraParams = {}) {
    const url = new URL(path, APP_ORIGIN);
    const merged = { ...currentAttribution(), ...extraParams };
    Object.entries(merged).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, String(value));
      }
    });
    return url.toString();
  }

  function hydrateSessionButtons() {
    const active = hasSessionHint();

    document.querySelectorAll("[data-session-primary]").forEach((link) => {
      const authText = link.getAttribute("data-auth-text") ||
        "Start Free Generation";
      const sessionText = link.getAttribute("data-session-text") ||
        "Back to Dashboard";
      const authPath = link.getAttribute("data-auth-path") || "/auth/register";
      const sessionPath = link.getAttribute("data-session-path") || "/chat";
      link.textContent = active ? sessionText : authText;
      link.setAttribute("href", buildAppUrl(active ? sessionPath : authPath));
    });

    document.querySelectorAll("[data-session-secondary]").forEach((link) => {
      if (active) {
        const sessionPath = link.getAttribute("data-session-path") ||
          "/chat?new_thread=1";
        link.classList.remove("is-hidden");
        link.setAttribute("href", buildAppUrl(sessionPath));
      } else {
        link.classList.add("is-hidden");
      }
    });
  }

  function hydrateAppPathLinks() {
    document.querySelectorAll("[data-app-path]").forEach((link) => {
      const path = link.getAttribute("data-app-path");
      if (path) {
        link.setAttribute("href", buildAppUrl(path));
      }
    });
  }

  function updateCookiePreferenceStatus() {
    const status = document.querySelector("[data-cookie-preference-status]");
    if (!status) {
      return;
    }

    if (allowsContinuityCookies()) {
      status.textContent = "Current setting: continuity cookies are enabled.";
      return;
    }

    const consent = readConsent();
    status.textContent = consent
      ? "Current setting: necessary storage only."
      : "Current setting: no optional cookies chosen yet.";
  }

  function applyCookieConsent(continuityEnabled) {
    writeConsent({
      necessary: true,
      continuity: continuityEnabled,
      updatedAt: new Date().toISOString(),
    });

    if (continuityEnabled) {
      captureAttribution();
    } else {
      clearContinuityStorage();
    }

    const banner = document.querySelector("[data-cookie-banner]");
    if (banner) {
      banner.hidden = true;
    }

    hydrateSessionButtons();
    hydrateAppPathLinks();
    updateCookiePreferenceStatus();
  }

  function initCookieControls() {
    const banner = document.querySelector("[data-cookie-banner]");
    const consent = readConsent();

    if (banner && !consent) {
      banner.hidden = false;
    }

    document.querySelectorAll('[data-cookie-action="accept-all"]').forEach(
      (control) => {
        control.addEventListener("click", () => applyCookieConsent(true));
      },
    );

    document.querySelectorAll('[data-cookie-action="necessary-only"]').forEach(
      (control) => {
        control.addEventListener("click", () => applyCookieConsent(false));
      },
    );

    updateCookiePreferenceStatus();
  }

  function startSimulator() {
    const simulator = document.querySelector(".triage-simulator");
    if (!simulator) {
      return;
    }

    const cards = Array.from(simulator.querySelectorAll(".reveal-card"));

    if (reducedMotion.matches) {
      simulator.classList.add("is-revealed");
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    window.setTimeout(() => {
      simulator.classList.add("is-thinking");
    }, 900);

    window.setTimeout(() => {
      simulator.classList.remove("is-thinking");
      simulator.classList.add("is-revealed");
      cards.forEach((card, index) => {
        window.setTimeout(() => {
          card.classList.add("is-visible");
        }, index * 140);
      });
    }, 2200);
  }

  function wireCopyButtons() {
    document.querySelectorAll(".copy-button").forEach((button) => {
      button.addEventListener("click", async () => {
        const targetId = button.getAttribute("data-copy-target");
        const target = targetId ? document.getElementById(targetId) : null;
        const text = target?.textContent?.trim();

        if (!text) {
          return;
        }

        try {
          await navigator.clipboard.writeText(text);
          const previous = button.textContent;
          button.textContent = "Copied";
          button.classList.add("is-copied");
          window.setTimeout(() => {
            button.textContent = previous || "Copy to Clipboard";
            button.classList.remove("is-copied");
          }, 1400);
        } catch {
          // Clipboard can fail in some browsers or contexts.
        }
      });
    });
  }

  function initDemoTour() {
    const demoTour = document.querySelector("[data-demo-tour]");
    if (!demoTour) {
      return;
    }

    const triggers = Array.from(
      demoTour.querySelectorAll("[data-demo-step-trigger]"),
    );
    const panels = Array.from(demoTour.querySelectorAll("[data-demo-panel]"));
    const replayButton = demoTour.querySelector("[data-action='replay-demo']");

    if (triggers.length === 0 || panels.length === 0) {
      return;
    }

    let activeIndex = 0;
    let autoplayId = null;

    function stopAutoplay() {
      if (autoplayId !== null) {
        window.clearTimeout(autoplayId);
        autoplayId = null;
      }
    }

    function setActive(nextIndex) {
      activeIndex = nextIndex;

      triggers.forEach((trigger, index) => {
        const isActive = index === nextIndex;
        trigger.classList.toggle("is-active", isActive);
        trigger.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      panels.forEach((panel, index) => {
        const isActive = index === nextIndex;
        panel.hidden = !isActive;
        panel.classList.toggle("is-active", isActive);
      });
    }

    function scheduleNextStep() {
      if (reducedMotion.matches || panels.length < 2) {
        return;
      }

      stopAutoplay();
      autoplayId = window.setTimeout(() => {
        setActive((activeIndex + 1) % panels.length);
        scheduleNextStep();
      }, 3600);
    }

    triggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        stopAutoplay();
        setActive(index);
      });
    });

    replayButton?.addEventListener("click", () => {
      setActive(0);
      scheduleNextStep();
    });

    setActive(0);
    scheduleNextStep();
  }

  initCookieControls();
  captureAttribution();
  hydrateSessionButtons();
  hydrateAppPathLinks();
  initDemoTour();
  startSimulator();
  wireCopyButtons();

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");
  const mobileClose = document.querySelector(".nav-mobile-close");

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      mobileClose?.focus();
    });
  }

  if (mobileClose && mobileMenu) {
    mobileClose.addEventListener("click", () => {
      mobileMenu.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      menuToggle?.focus();
    });
  }

  // Close mobile menu function for use by onclick handlers
  // Exposed to global scope for inline onclick attributes
  window.closeMobileMenu = function () {
    if (mobileMenu && mobileMenu.classList.contains("is-open")) {
      mobileMenu.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      menuToggle?.focus();
    }
  };

  // Close mobile menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      closeMobileMenu();
    }
  });
})();
