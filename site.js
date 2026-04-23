(() => {
  const APP_ORIGIN = "https://app.liaisonreply.com";
  const ATTR_STORAGE_KEY = "lk_deeplink";
  const AUTH_HINT_KEY = "liaison_auth_hint";
  const COOKIE_CONSENT_KEY = "liaison_cookie_consent";
  const ROOT_COOKIE_DOMAIN = ".liaisonreply.com";
  const LANDING_DEBUG_EVENT_KEY = "__liaisonLandingEvents";
  const DEMO_COPY_EXPERIMENT_ID = "landing_demo_copy_v1";
  const DEMO_COPY_STORAGE_KEY = "lk_exp_demo_copy_v1";
  const DEMO_COPY_QUERY_PARAM = "exp_demo_copy";
  const DEMO_COPY_VARIANTS = ["premium_leaning", "conversion_leaning"];
  const ANALYTICS_COOKIE_NAMES = [
    "_ga",
    "_ga_FMVPQNPPDD",
    "_gid",
    "_gat",
  ];
  let activeDemoCopyVariant = null;

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

  function normalizeDemoCopyVariant(value) {
    const normalized = String(value || "").trim().toLowerCase();
    return DEMO_COPY_VARIANTS.includes(normalized) ? normalized : null;
  }

  function readPersistedValue(key) {
    return safeGet(key) || readCookie(key);
  }

  function rememberPersistedValue(key, value, days = 30) {
    if (!allowsContinuityCookies()) {
      return;
    }

    safeSet(key, value);
    writeCookie(key, value, days);
  }

  function readDemoCopyVariantFromQuery() {
    const params = new URLSearchParams(window.location.search);
    return normalizeDemoCopyVariant(params.get(DEMO_COPY_QUERY_PARAM));
  }

  function resolveDemoCopyVariant() {
    const queryVariant = readDemoCopyVariantFromQuery();
    if (queryVariant) {
      return {
        variant: queryVariant,
        source: "query",
      };
    }

    const storedVariant = normalizeDemoCopyVariant(
      readPersistedValue(DEMO_COPY_STORAGE_KEY),
    );
    if (storedVariant) {
      return {
        variant: storedVariant,
        source: "stored",
      };
    }

    const randomVariant = Math.random() < 0.5
      ? DEMO_COPY_VARIANTS[0]
      : DEMO_COPY_VARIANTS[1];

    rememberPersistedValue(DEMO_COPY_STORAGE_KEY, randomVariant, 60);

    return {
      variant: randomVariant,
      source: "random",
    };
  }

  function rememberDemoCopyVariant(variant) {
    const normalized = normalizeDemoCopyVariant(variant);
    if (!normalized) {
      return;
    }

    rememberPersistedValue(DEMO_COPY_STORAGE_KEY, normalized, 60);
  }

  function buildExperimentAnalyticsPayload() {
    if (!activeDemoCopyVariant) {
      return {};
    }

    return {
      demo_copy_experiment_id: DEMO_COPY_EXPERIMENT_ID,
      demo_copy_variant: activeDemoCopyVariant,
    };
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
    safeRemove(DEMO_COPY_STORAGE_KEY);
    deleteCookie(ATTR_STORAGE_KEY);
    deleteCookie(AUTH_HINT_KEY);
    deleteCookie(DEMO_COPY_STORAGE_KEY);
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
        ...buildExperimentAnalyticsPayload(),
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
            ...buildExperimentAnalyticsPayload(),
            cta_surface: ctaSurface,
            cta_label: ctaLabel,
            billing_interval: billingInterval,
            destination_path: href,
            session_state: hasSessionHint() ? "active" : "anonymous",
          });
        }

        trackLandingEvent("landing_cta_clicked", {
          ...buildExperimentAnalyticsPayload(),
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
      rememberDemoCopyVariant(activeDemoCopyVariant);
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

  function getDemoCopyExperimentConfig(variant) {
    const visuals = [
      {
        image: "./assets/previews/reply-flow-step-01-heated-message.png",
        alt: "Compose screen with a heated incoming message pasted into Liaison Reply.",
      },
      {
        image: "./assets/previews/reply-flow-step-02-context-and-intent.png",
        alt: "Intent and tone controls selected in Liaison Reply before generating responses.",
      },
      {
        image: "./assets/previews/reply-flow-step-03-persona-selected.png",
        alt: "Compose screen showing the Diplomat persona selected for a difficult conversation.",
      },
      {
        image: "./assets/previews/reply-flow-step-04-generating.png",
        alt: "Generating state in Liaison Reply while creating three response options.",
      },
      {
        image: "./assets/previews/reply-flow-step-05-generated-replies.png",
        alt: "Generated replies with strategic coaching guidance visible in the same screen.",
      },
      {
        image: "./assets/previews/reply-flow-step-06-polish-in-progress.png",
        alt: "Polish action running on a selected generated reply card in Liaison Reply.",
      },
      {
        image: "./assets/previews/reply-flow-step-07-polished-reply.png",
        alt: "Polished response options ready to copy in the Liaison Reply compose flow.",
      },
      {
        image: "./assets/previews/reply-flow-step-08-live-coaching.png",
        alt: "Live coaching warning highlighting escalation risk in an edited reply.",
      },
    ];

    const variants = {
      premium_leaning: {
        headline:
          "Respond with clarity when the conversation gets heated.",
        description:
          "A calm, guided flow for high-stakes threads: capture context, compare strategic drafts, and keep control of every word.",
        proof:
          "Nothing auto-sends. Coaching stays visible until you finalize your message.",
        chips: [
          "Capture exact message",
          "Set tone and intent",
          "Select a persona",
          "Generate three drafts",
          "Review tactical coaching",
          "Polish phrasing",
          "Finalize and copy",
          "Check escalation risk",
        ],
        slides: [
          {
            kicker: "Reply builder",
            step: "Step 1: Capture the message",
            title: "Start from the exact message.",
            caption:
              "Paste the text verbatim so nuance and pressure stay intact.",
          },
          {
            kicker: "Reply builder",
            step: "Step 2: Set tone and intent",
            title: "Define your tactical posture.",
            caption:
              "Choose tone and intent first to guide the draft toward your outcome.",
          },
          {
            kicker: "Reply builder",
            step: "Step 3: Select persona",
            title: "Choose the right delivery style.",
            caption:
              "Persona shapes expression while preserving your core boundary.",
          },
          {
            kicker: "Reply builder",
            step: "Step 4: Generate options",
            title: "Build three strategic replies.",
            caption:
              "Get multiple approaches rooted in your context and chosen intent.",
          },
          {
            kicker: "Reply builder",
            step: "Step 5: Compare with coaching",
            title: "Review drafts with tactical notes.",
            caption:
              "See the strategic tradeoffs before committing to a final line.",
          },
          {
            kicker: "Live coaching",
            step: "Step 6: Polish wording",
            title: "Refine without losing control.",
            caption:
              "Polish for warmth or directness while keeping your position intact.",
          },
          {
            kicker: "Live coaching",
            step: "Step 7: Finalize and copy",
            title: "Lock the final version.",
            caption:
              "Make final edits, then copy when the message sounds like you.",
          },
          {
            kicker: "Live coaching",
            step: "Step 8: Validate escalation risk",
            title: "Catch escalation before send.",
            caption:
              "Live coaching flags reactive edits so you can de-escalate in time.",
          },
        ],
      },
      conversion_leaning: {
        headline:
          "Generate 3 better replies before you hit send.",
        description:
          "Real app flow: paste the message, pick intent, compare drafts, polish one, and catch tone issues live in under a minute.",
        proof:
          "Real UI. Real outputs. Start free and send a calmer reply faster.",
        chips: [
          "Paste message",
          "Pick intent",
          "Choose persona",
          "Get 3 replies",
          "See coaching",
          "Polish fast",
          "Copy final draft",
          "Avoid escalation",
        ],
        slides: [
          {
            kicker: "Reply builder",
            step: "Step 1: Paste the message",
            title: "Paste the exact message.",
            caption:
              "No summary needed. Start from the real message in seconds.",
          },
          {
            kicker: "Reply builder",
            step: "Step 2: Pick tone and intent",
            title: "Tell the app what outcome you want.",
            caption:
              "Set boundary, buy time, or calm it down before generating replies.",
          },
          {
            kicker: "Reply builder",
            step: "Step 3: Choose persona",
            title: "Pick the voice that fits.",
            caption:
              "Use persona controls to match the response style to the moment.",
          },
          {
            kicker: "Reply builder",
            step: "Step 4: Generate 3 replies",
            title: "Get three options instantly.",
            caption:
              "Compare angles fast instead of rewriting the same message repeatedly.",
          },
          {
            kicker: "Reply builder",
            step: "Step 5: Compare and coach",
            title: "See tactical guidance with each draft.",
            caption:
              "Coaching explains why each option works before you copy.",
          },
          {
            kicker: "Live coaching",
            step: "Step 6: Polish",
            title: "Polish in one tap.",
            caption:
              "Make it warmer, cleaner, or more direct without starting over.",
          },
          {
            kicker: "Live coaching",
            step: "Step 7: Finalize and copy",
            title: "Finalize your best draft.",
            caption:
              "Make quick edits and copy the reply when it is ready to send.",
          },
          {
            kicker: "Live coaching",
            step: "Step 8: Live warning",
            title: "Stop escalation before it leaves your phone.",
            caption:
              "If an edit gets reactive, live coaching warns you immediately.",
          },
        ],
      },
    };

    const normalizedVariant = normalizeDemoCopyVariant(variant) ||
      DEMO_COPY_VARIANTS[0];
    const config = variants[normalizedVariant] || variants[DEMO_COPY_VARIANTS[0]];

    return {
      variant: normalizedVariant,
      headline: config.headline,
      description: config.description,
      proof: config.proof,
      chips: config.chips,
      slides: config.slides.map((slide, index) => ({
        ...slide,
        ...visuals[index],
      })),
    };
  }

  function initHeroStory() {
    const story = document.querySelector("[data-hero-story]");
    if (!story) {
      return;
    }

    const section = story.closest("[data-demo-copy-experiment-section]");
    const headline = section?.querySelector("[data-demo-copy-headline]");
    const description = section?.querySelector("[data-demo-copy-description]");
    const kicker = story.querySelector("[data-hero-story-kicker]");
    const status = story.querySelector("[data-hero-story-status]");
    const image = story.querySelector("[data-hero-story-image]");
    const step = story.querySelector("[data-hero-story-step]");
    const title = story.querySelector("[data-hero-story-title]");
    const caption = story.querySelector("[data-hero-story-caption]");
    const nav = story.querySelector("[data-hero-story-nav]");
    const prev = story.querySelector("[data-hero-story-prev]");
    const next = story.querySelector("[data-hero-story-next]");
    const footer = story.querySelector("[data-demo-copy-footer]");
    const proofNote = story.querySelector("[data-demo-copy-proof-note]");

    if (
      !kicker || !status || !image || !step || !title || !caption || !nav ||
      !prev || !next
    ) {
      return;
    }

    const assignment = resolveDemoCopyVariant();
    const config = getDemoCopyExperimentConfig(assignment.variant);
    activeDemoCopyVariant = config.variant;
    story.setAttribute("data-demo-copy-variant", activeDemoCopyVariant);

    if (headline) {
      headline.textContent = config.headline;
    }

    if (description) {
      description.textContent = config.description;
    }

    if (proofNote) {
      proofNote.textContent = config.proof;
    }

    if (footer) {
      footer.replaceChildren();
      config.chips.forEach((chip) => {
        const node = document.createElement("span");
        node.textContent = chip;
        footer.append(node);
      });
    }

    const slides = config.slides;
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
    };

    const emitExposure = () => {
      if (story.dataset.experimentExposed === "true") {
        return;
      }

      story.dataset.experimentExposed = "true";
      trackLandingEvent("landing_experiment_exposed", {
        ...buildExperimentAnalyticsPayload(),
        experiment_surface: "demo-section",
        assignment_source: assignment.source,
        session_state: hasSessionHint() ? "active" : "anonymous",
      });
    };

    const exposureTarget = section || story;
    if (typeof window.IntersectionObserver !== "function") {
      emitExposure();
    } else {
      const observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            emitExposure();
            observer.disconnect();
          });
        },
        {
          threshold: 0.35,
        },
      );

      observer.observe(exposureTarget);
    }

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
