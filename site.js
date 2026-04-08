(() => {
  const APP_ORIGIN = "https://app.liaisonreply.com";
  const ATTR_STORAGE_KEY = "lk_deeplink";
  const AUTH_HINT_KEY = "liaison_auth_hint";
  const COOKIE_CONSENT_KEY = "liaison_cookie_consent";
  const ROOT_COOKIE_DOMAIN = ".liaisonreply.com";
  const LANDING_DEBUG_EVENT_KEY = "__liaisonLandingEvents";

  function recordLandingEvent(eventName, payload = {}) {
    const existing = Array.isArray(window[LANDING_DEBUG_EVENT_KEY])
      ? window[LANDING_DEBUG_EVENT_KEY]
      : [];

    existing.push({
      eventName,
      payload,
      timestamp: new Date().toISOString(),
    });

    window[LANDING_DEBUG_EVENT_KEY] = existing;
  }

  function trackLandingEvent(eventName, payload = {}) {
    recordLandingEvent(eventName, payload);

    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, {
      ...payload,
      transport_type: "beacon",
    });
  }

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

  function toGoogleConsentState(continuityEnabled) {
    return {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: continuityEnabled ? "granted" : "denied",
    };
  }

  function updateGoogleConsent(continuityEnabled) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("consent", "update", toGoogleConsentState(continuityEnabled));
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

    ["utm_source", "ref_id", "scenario_id", "prefill", "billing_interval"]
      .forEach((key) => {
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

  function captureAttribution(extra = {}) {
    if (!allowsContinuityCookies()) {
      return;
    }

    const next = { ...currentAttribution(), ...extra };
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

  function getLinkExtraParams(link) {
    const billingInterval = link.getAttribute("data-billing-interval");
    const extraParams = {};

    if (billingInterval === "month" || billingInterval === "year") {
      extraParams.billing_interval = billingInterval;
    }

    return extraParams;
  }

  function formatUpdatedAt(value) {
    if (!value) {
      return "";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  function renderCookiePreferenceUI(consent = readConsent(), options = {}) {
    const status = document.querySelector("[data-cookie-preference-status]");
    const summary = document.querySelector("[data-cookie-preference-summary]");
    const meta = document.querySelector("[data-cookie-preference-meta]");
    const feedback = document.querySelector("[data-cookie-feedback]");
    const hasSavedPreference = Boolean(consent);
    const continuityEnabled = Boolean(consent?.continuity);
    const updatedAt = formatUpdatedAt(consent?.updatedAt);

    if (status) {
      status.textContent = hasSavedPreference
        ? continuityEnabled
          ? "Continuity cookies are active."
          : "Only necessary site storage is active."
        : "No optional cookie preference has been saved yet.";
    }

    if (summary) {
      summary.textContent = hasSavedPreference
        ? continuityEnabled
          ? "Liaison Keyboard can remember which scenario or link brought you here and help you pick up where you left off between the site and the app."
          : "Liaison Keyboard will not keep scenario or referral details after you leave, so each visit starts fresh."
        : "Choose whether Liaison Keyboard should remember the path into the app or keep storage limited to what the site needs to work.";
    }

    if (meta) {
      meta.textContent = hasSavedPreference
        ? updatedAt
          ? `Last updated ${updatedAt}.`
          : "Your preference is saved for this browser and shared across liaisonkeyboard.com when supported."
        : "Until you choose, optional continuity storage remains off by default.";
    }

    document.querySelectorAll("[data-cookie-action]").forEach((control) => {
      const action = control.getAttribute("data-cookie-action");
      const selected = hasSavedPreference
        ? (action === "accept-all" && continuityEnabled) ||
          (action === "necessary-only" && !continuityEnabled)
        : false;

      control.setAttribute("aria-pressed", selected ? "true" : "false");
      control.classList.toggle("is-selected", selected);
    });

    if (feedback && typeof options.feedback === "string") {
      feedback.textContent = options.feedback;
      feedback.hidden = options.feedback.length === 0;

      if (options.focusFeedback && !feedback.hidden) {
        feedback.setAttribute("tabindex", "-1");
        feedback.focus();
      }
    }
  }

  function hydrateSessionButtons() {
    const active = hasSessionHint();

    document.querySelectorAll("[data-session-primary]").forEach((link) => {
      const authText = link.getAttribute("data-auth-text") || "Start Free";
      const sessionText = link.getAttribute("data-session-text") ||
        "Open Liaison Keyboard";
      const authPath = link.getAttribute("data-auth-path") || "/auth/register";
      const sessionPath = link.getAttribute("data-session-path") || "/chat";
      const extraParams = getLinkExtraParams(link);

      link.textContent = active ? sessionText : authText;
      link.setAttribute(
        "href",
        buildAppUrl(active ? sessionPath : authPath, extraParams),
      );
    });

    document.querySelectorAll("[data-session-secondary]").forEach((link) => {
      const authText = link.getAttribute("data-auth-text") || "";
      const sessionText = link.getAttribute("data-session-text") ||
        link.textContent.trim() || "New Thread";
      const authPath = link.getAttribute("data-auth-path") || "/auth/register";
      const sessionPath = link.getAttribute("data-session-path") ||
        "/chat?new_thread=1";
      const extraParams = getLinkExtraParams(link);

      if (active) {
        link.textContent = sessionText;
        link.setAttribute("href", buildAppUrl(sessionPath, extraParams));
        link.hidden = false;
        link.classList.remove("is-hidden");
        return;
      }

      link.setAttribute("href", buildAppUrl(authPath, extraParams));

      if (authText) {
        link.textContent = authText;
        link.hidden = false;
        link.classList.remove("is-hidden");
      } else {
        link.hidden = true;
        link.classList.add("is-hidden");
      }
    });
  }

  function hydrateAppLinks() {
    const active = hasSessionHint();

    document.querySelectorAll("[data-app-link]").forEach((link) => {
      const authPath = link.getAttribute("data-auth-path") || "/auth/register";
      const sessionPath = link.getAttribute("data-session-path") || "/chat";
      const extraParams = getLinkExtraParams(link);

      link.setAttribute(
        "href",
        buildAppUrl(active ? sessionPath : authPath, extraParams),
      );
    });
  }

  function initPricingSectionTracking() {
    const pricingSection = document.querySelector("[data-pricing-section]");
    if (!pricingSection || pricingSection.dataset.pricingTracked === "true") {
      return;
    }

    pricingSection.dataset.pricingTracked = "true";

    const emitPricingViewed = () => {
      trackLandingEvent("landing_pricing_viewed", {
        cta_surface: "pricing-section",
        session_state: hasSessionHint() ? "active" : "anonymous",
      });
    };

    if (typeof window.IntersectionObserver !== "function") {
      emitPricingViewed();
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          emitPricingViewed();
          observer.disconnect();
        });
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(pricingSection);
  }

  function initCtaTracking() {
    document.querySelectorAll("[data-cta-surface]").forEach((link) => {
      if (link.dataset.ctaTracked === "true") {
        return;
      }

      link.dataset.ctaTracked = "true";
      link.addEventListener("click", () => {
        const href = link.getAttribute("href") || "";
        const billingInterval = link.getAttribute("data-billing-interval") ||
          undefined;
        const ctaSurface = link.getAttribute("data-cta-surface") || "unknown";
        const ctaLabel = link.getAttribute("data-cta-label") ||
          link.textContent.trim() || "cta";

        if (billingInterval === "month" || billingInterval === "year") {
          captureAttribution({ billing_interval: billingInterval });

          trackLandingEvent("landing_interval_selected", {
            cta_surface: ctaSurface,
            cta_label: ctaLabel,
            billing_interval: billingInterval,
            destination_path: href,
            session_state: hasSessionHint() ? "active" : "anonymous",
          });
        }

        trackLandingEvent("landing_cta_clicked", {
          cta_surface: ctaSurface,
          cta_label: ctaLabel,
          billing_interval: billingInterval,
          destination_path: href,
          session_state: hasSessionHint() ? "active" : "anonymous",
        });
      });
    });
  }

  function applyCookieConsent(continuityEnabled) {
    const nextConsent = {
      necessary: true,
      continuity: continuityEnabled,
      updatedAt: new Date().toISOString(),
    };

    writeConsent(nextConsent);

    updateGoogleConsent(continuityEnabled);

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
    renderCookiePreferenceUI(nextConsent, {
      feedback: continuityEnabled
        ? "Liaison Keyboard can now remember the path between the site and the app, so picking back up feels smoother."
        : "Liaison Keyboard will now use necessary storage only. Saved handoff details have been cleared.",
      focusFeedback: true,
    });
  }

  function initCookieControls() {
    const banner = document.querySelector("[data-cookie-banner]");
    const consent = readConsent();

    if (consent) {
      updateGoogleConsent(Boolean(consent.continuity));
    }

    if (banner && !consent) {
      banner.hidden = false;
    }

    renderCookiePreferenceUI(consent);

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

  function initHeroStory() {
    const story = document.querySelector("[data-hero-story]");
    if (!story) {
      return;
    }

    const kicker = story.querySelector("[data-hero-story-kicker]");
    const status = story.querySelector("[data-hero-story-status]");
    const image = story.querySelector("[data-hero-story-image]");
    const step = story.querySelector("[data-hero-story-step]");
    const title = story.querySelector("[data-hero-story-title]");
    const caption = story.querySelector("[data-hero-story-caption]");
    const nav = story.querySelector("[data-hero-story-nav]");
    const prev = story.querySelector("[data-hero-story-prev]");
    const next = story.querySelector("[data-hero-story-next]");

    if (
      !kicker || !status || !image || !step || !title || !caption || !nav ||
      !prev || !next
    ) {
      return;
    }

    const slides = [
      {
        kicker: "Message walkthrough",
        step: "The message lands",
        title: "See the message before you decide how to answer.",
        caption:
          "See the incoming text first, then compare your reply options before anything gets sent.",
        image: "./assets/previews/hero-story-01-incoming.png",
        alt:
          "Preview of a stressful incoming text before comparing reply options inside Liaison Keyboard.",
      },
      {
        kicker: "Message walkthrough",
        step: "Escalation lands",
        title: "The second message raises the stakes.",
        caption:
          "The urgency gets sharper before you write a single word back.",
        image: "./assets/previews/hero-story-02-follow-up.png",
        alt:
          "Preview of the same conversation getting more urgent before you write back.",
      },
      {
        kicker: "Message walkthrough",
        step: "Private triage",
        title: "Liaison Keyboard gives you three clear directions.",
        caption:
          "The thread stays intact, and Liaison Keyboard gives you three clear ways to answer before you send anything.",
        image: "./assets/previews/hero-reply-studio.svg",
        alt:
          "Liaison Keyboard showing one incoming message and three reply options inside the app.",
      },
      {
        kicker: "Message walkthrough",
        step: "Draft stays manual",
        title: "The reply still stays in your hands.",
        caption:
          "The draft sits in the composer so you can still review it, edit it, or back out.",
        image: "./assets/previews/hero-story-04-draft.png",
        alt:
          "Preview of a drafted reply waiting for review before anything is sent.",
      },
      {
        kicker: "Message walkthrough",
        step: "Thread settles",
        title: "The exchange calms down instead of spiraling.",
        caption:
          "A final acknowledgement shows the exchange settling after you choose what to send.",
        image: "./assets/previews/hero-story-05-resolution.png",
        alt: "Preview of the conversation calming down after a measured reply.",
      },
    ];

    let currentIndex = 0;

    const applySlide = (index) => {
      currentIndex = (index + slides.length) % slides.length;
      const slide = slides[currentIndex];

      kicker.textContent = slide.kicker;
      status.textContent = `Slide ${currentIndex + 1} of ${slides.length}`;
      step.textContent = slide.step;
      title.textContent = slide.title;
      caption.textContent = slide.caption;
      image.setAttribute("src", slide.image);
      image.setAttribute("alt", slide.alt);

      if (currentIndex === 0) {
        image.setAttribute("loading", "eager");
      } else {
        image.setAttribute("loading", "lazy");
      }
    };

    story.setAttribute("data-enhanced", "true");
    nav.hidden = slides.length < 2;
    prev.disabled = slides.length < 2;
    next.disabled = slides.length < 2;

    prev.addEventListener("click", () => {
      applySlide(currentIndex - 1);
    });

    next.addEventListener("click", () => {
      applySlide(currentIndex + 1);
    });

    story.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        applySlide(currentIndex - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        applySlide(currentIndex + 1);
      }
    });

    applySlide(0);
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
  initHeroStory();
  captureAttribution();
  hydrateSessionButtons();
  hydrateAppLinks();
  initPricingSectionTracking();
  initCtaTracking();
})();
