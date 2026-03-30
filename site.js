(() => {
  const APP_ORIGIN = "https://app.liaisonkeyboard.com";
  const ATTR_STORAGE_KEY = "lk_deeplink";
  const AUTH_HINT_KEY = "liaison_auth_hint";
  const COOKIE_CONSENT_KEY = "liaison_cookie_consent";
  const ROOT_COOKIE_DOMAIN = ".liaisonkeyboard.com";

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
      const authText = link.getAttribute("data-auth-text") || "Start Free";
      const sessionText = link.getAttribute("data-session-text") || "Dashboard";
      const authPath = link.getAttribute("data-auth-path") || "/auth/register";
      const sessionPath = link.getAttribute("data-session-path") || "/chat";

      link.textContent = active ? sessionText : authText;
      link.setAttribute("href", buildAppUrl(active ? sessionPath : authPath));
    });
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
  }

  function initFaqAccordion() {
    const faqItems = Array.from(document.querySelectorAll("details.faq-card"));
    if (faqItems.length === 0) {
      return;
    }

    faqItems.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) {
          return;
        }

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      });
    });
  }

  function initHeroExamples() {
    const triggerButtons = Array.from(
      document.querySelectorAll("[data-hero-example-trigger]"),
    );
    if (triggerButtons.length === 0) {
      return;
    }

    const kicker = document.querySelector("[data-hero-example-kicker]");
    const message = document.querySelector("[data-hero-example-message]");
    const natural = document.querySelector("[data-hero-example-natural]");
    const proactive = document.querySelector("[data-hero-example-proactive]");
    const short = document.querySelector("[data-hero-example-short]");

    const examples = {
      work: {
        kicker: "Work conflict example",
        message: '"I need this done by 9pm on a Friday."',
        natural:
          "I can get this done tonight, but I need to reset the expectation that Friday-night requests should stay exceptional.",
        proactive:
          "I can get this done by 9 tonight. Going forward, earlier notice will help me protect quality and turnaround.",
        short:
          "I can deliver it by 9 tonight. Next time I need earlier notice.",
      },
      dating: {
        kicker: "Dating example",
        message:
          '"Sorry I disappeared. This week has been wild. We should hang soon though."',
        natural:
          "No worries. If you want to make a plan, send a day that actually works and we can lock it in.",
        proactive:
          'I get that weeks get messy. If you do want to see each other, pick a time and I am open. I just prefer clarity over "soon."',
        short:
          "All good. If you want to meet up, send a real day and time.",
      },
      family: {
        kicker: "Family boundary example",
        message:
          '"I was just trying to help. You are too sensitive about this."',
        natural:
          "I know you were trying to help. I still need you to stop bringing this up after I have already answered it.",
        proactive:
          "I am not trying to fight about intent. I am being clear about the impact. Please stop raising this unless I ask for input.",
        short:
          "I have already answered this. Please stop bringing it up.",
      },
    };

    function applyExample(exampleKey) {
      const example = examples[exampleKey];
      if (!example || !kicker || !message || !natural || !proactive || !short) {
        return;
      }

      kicker.textContent = example.kicker;
      message.textContent = example.message;
      natural.textContent = example.natural;
      proactive.textContent = example.proactive;
      short.textContent = example.short;

      triggerButtons.forEach((button) => {
        const isActive = button.getAttribute("data-hero-example-trigger") === exampleKey;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });
    }

    triggerButtons.forEach((button) => {
      button.addEventListener("click", () => {
        applyExample(button.getAttribute("data-hero-example-trigger") || "work");
      });
    });

    applyExample("work");
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".nav-mobile");
  const mobileClose = document.querySelector(".nav-mobile-close");

  function closeMobileMenu() {
    if (!mobileMenu) {
      return;
    }

    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
    menuToggle?.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("is-open");
      document.body.style.overflow = "hidden";
      menuToggle.setAttribute("aria-expanded", "true");
      mobileClose?.focus();
    });
  }

  mobileClose?.addEventListener("click", () => {
    closeMobileMenu();
    menuToggle?.focus();
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
      closeMobileMenu();
      menuToggle?.focus();
    }
  });

  initCookieControls();
  initFaqAccordion();
  initHeroExamples();
  captureAttribution();
  hydrateSessionButtons();
})();
