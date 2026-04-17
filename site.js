(() => {
  const APP_ORIGIN = "https://app.liaisonreply.com";
  const ATTR_STORAGE_KEY = "lk_deeplink";
  const AUTH_HINT_KEY = "liaison_auth_hint";
  const COOKIE_CONSENT_KEY = "liaison_cookie_consent";
  const ROOT_COOKIE_DOMAIN = ".liaisonreply.com";
  const LANDING_DEBUG_EVENT_KEY = "__liaisonLandingEvents";
  const ANALYTICS_COOKIE_NAMES = [
    "_ga",
    "_ga_FMVPQNPPDD",
    "_gid",
    "_gat",
  ];

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
    const expired = "Thu, 01 Jan 1970 00:00:00 GMT";
    const variants = [
      `expires=${expired}; path=/; domain=${ROOT_COOKIE_DOMAIN}; SameSite=Lax; secure`,
      `expires=${expired}; path=/; domain=${ROOT_COOKIE_DOMAIN}; SameSite=Lax`,
      `expires=${expired}; path=/; SameSite=Lax; secure`,
      `expires=${expired}; path=/; SameSite=Lax`,
    ];

    variants.forEach((attributes) => {
      document.cookie = `${name}=; ${attributes}`;
    });
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
    ANALYTICS_COOKIE_NAMES.forEach(deleteCookie);
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
          ? "Liaison Reply can remember which scenario or link brought you here and help you pick up where you left off between the site and the app."
          : "Liaison Reply will not keep scenario or referral details after you leave, so each visit starts fresh."
        : "Choose whether Liaison Reply should remember the path into the app or keep storage limited to what the site needs to work.";
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
        "Open Liaison Reply";
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
        ? "Liaison Reply can now remember the path between the site and the app, so picking back up feels smoother."
        : "Liaison Reply will now use necessary storage only. Saved handoff details and optional analytics cookies have been cleared where supported.",
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
        kicker: "The workflow",
        step: "Step 1: The message lands",
        title: "Your boss sends something loaded.",
        caption:
          "After hours. 'We need to talk about your performance. Call me tonight.' The message lands when you're not expecting it.",
        image: "./assets/previews/hero-story-01-incoming.png",
        alt: "Incoming text from a boss saying 'We need to talk about your performance. Call me tonight.'",
      },
      {
        kicker: "The workflow",
        step: "Step 2: The follow-up",
        title: "The follow-up arrives.",
        caption:
          "Twenty minutes later: 'Well? Are you going to pick up?' The urgency sharpens before you write back.",
        image: "./assets/previews/hero-story-02-follow-up.png",
        alt: "Follow-up text showing escalating urgency from the same person.",
      },
      {
        kicker: "The workflow",
        step: "Step 3: Paste it in",
        title: "Drop the exact message into Liaison Reply.",
        caption:
          "Paste both texts, add context like 'I have a review next week' or 'This is about a project deadline.' Context helps Liaison Reply understand nuance and intent.",
        image: "./assets/previews/hero-mobile-compose-real.png",
        alt: "Liaison Reply input screen showing pasted messages and context field.",
      },
      {
        kicker: "The workflow",
        step: "Step 4: Get three reply options",
        title: "Three clear directions tailored to your goal.",
        caption:
          "Natural: 'I saw your message. I'm free this weekend to chat.' Keep it going: 'Let's schedule time to discuss.' Short: 'I'll call tomorrow morning.'",
        image: "./assets/previews/hero-reply-studio.svg",
        alt: "Liaison Reply showing three reply options: Natural, Keep it going, and Short with preview text.",
      },
      {
        kicker: "The workflow",
        step: "Step 5: Choose and edit",
        title: "Pick the one that fits your style.",
        caption:
          "Tap any option to edit before copying. Add 'before 10am' to make it concrete. You remain in full control.",
        image: "./assets/previews/hero-story-04-draft.png",
        alt: "Edited draft reply ready in the composer.",
      },
      {
        kicker: "The workflow",
        step: "Step 6: Copy and send",
        title: "You send it. On your terms.",
        caption:
          "Copy the edited reply into your actual text thread. Send it from your phone, your words, your timing.",
        image: "./assets/previews/demo-mobile-stage.png",
        alt: "Reply sent in the actual text conversation.",
      },
      {
        kicker: "The workflow",
        step: "Step 7: Thread settles",
        title: "The conversation calms down.",
        caption:
          "The reply lands: 'Sounds good, talk then.' Thread saved automatically. You kept your boundary without burning the bridge.",
        image: "./assets/previews/hero-story-05-resolution.png",
        alt: "The conversation settling after a measured response, thread saved.",
      },
      {
        kicker: "Thread memory",
        step: "Step 8: Thread auto-saves",
        title: "Your conversation lives in a thread.",
        caption:
          "Each reply creates a thread automatically. Threads appear in your sidebar—tap any to continue where you left off.",
        image: "./assets/previews/threads-history.svg",
        alt: "Thread list in sidebar showing saved conversations with context preserved.",
      },
      {
        kicker: "Thread memory",
        step: "Step 9: Continue the thread",
        title: "Continue the conversation with full context.",
        caption:
          "Open a thread and continue the chat. Context loads automatically—the assistant reads the thread history, no re-pasting needed.",
        image: "./assets/previews/thread-continue.svg",
        alt: "Continuing a thread with prior context loaded automatically.",
      },
      {
        kicker: "Thread memory",
        step: "Step 10: Switch threads",
        title: "Jump between conversations instantly.",
        caption:
          "Switch threads instantly—each maintains its own context. No mixing, no confusion. The active thread is highlighted.",
        image: "./assets/previews/thread-switch.svg",
        alt: "Switching between different thread contexts with active thread highlighted.",
      },
      {
        kicker: "Thread memory",
        step: "Step 11: New thread",
        title: "Start a new thread anytime.",
        caption:
          "Tap 'new thread' for a different conversation. Each thread stays independent—fresh context, no carryover.",
        image: "./assets/previews/thread-new.svg",
        alt: "Creating a new thread with clean, independent context.",
      },
      {
        kicker: "Thread memory",
        step: "Step 12: Syncs everywhere",
        title: "Your threads follow you.",
        caption:
          "Sign in on any device—your threads are ready. Close the browser, come back later: everything stays.",
        image: "./assets/previews/thread-sync.svg",
        alt: "Threads persisting across devices and sessions, synced when signed in.",
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

      const counter = story.querySelector("[data-hero-story-counter]");
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
      }

      if (currentIndex === 0) {
        image.setAttribute("loading", "eager");
      } else {
        image.setAttribute("loading", "lazy");
      }

      // Update kicker for section transitions
      if (currentIndex >= 7) {
        kicker.textContent = "Thread memory";
      } else {
        kicker.textContent = "The workflow";
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

    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    story.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    story.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > minSwipeDistance) {
        if (swipeDistance > 0) {
          applySlide(currentIndex - 1);
        } else {
          applySlide(currentIndex + 1);
        }
      }
    }, { passive: true });

    applySlide(0);
  }

  function initStickyMobileCta() {
    const stickyCta = document.querySelector("[data-sticky-mobile-cta]");
    const hero = document.querySelector(".hero-section");

    if (!stickyCta || !hero) {
      return;
    }

    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const cookieBanner = document.querySelector("[data-cookie-banner]");
    let heroVisible = true;

    const syncStickyState = () => {
      const showSticky = mobileQuery.matches &&
        !heroVisible &&
        !(cookieBanner && !cookieBanner.hidden);

      stickyCta.hidden = !showSticky;
      stickyCta.dataset.visible = showSticky ? "true" : "false";
    };

    if (typeof window.IntersectionObserver !== "function") {
      heroVisible = false;
      syncStickyState();
      return;
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          heroVisible = entry.isIntersecting;
          syncStickyState();
        });
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(hero);

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncStickyState);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(syncStickyState);
    }

    if (cookieBanner && typeof MutationObserver === "function") {
      const mutationObserver = new MutationObserver(syncStickyState);
      mutationObserver.observe(cookieBanner, {
        attributes: true,
        attributeFilter: ["hidden"],
      });
    }

    syncStickyState();
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
  initStickyMobileCta();
  captureAttribution();
  hydrateSessionButtons();
  hydrateAppLinks();
  initPricingSectionTracking();
  initCtaTracking();
})();
