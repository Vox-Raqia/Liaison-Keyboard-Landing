(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const topbar = document.querySelector(".topbar");

  function getStickyOffset() {
    const topbarHeight = topbar?.getBoundingClientRect().height ?? 0;
    return Math.max(0, Math.ceil(topbarHeight + 16));
  }

  function getHashTarget(hash) {
    if (!hash || hash === "#") {
      return null;
    }

    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return document.getElementById(hash.slice(1));
    }
  }

  function scrollToHash(
    hash,
    behavior = reducedMotion.matches ? "auto" : "smooth",
  ) {
    const target = getHashTarget(hash);

    if (!target) {
      return false;
    }

    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - getStickyOffset();

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior,
    });

    if (!target.hasAttribute("tabindex")) {
      target.setAttribute("tabindex", "-1");
    }

    target.focus({ preventScroll: true });
    return true;
  }

  function handleAnchorClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    const link = event.target.closest('a[href^="#"]');

    if (!link) {
      return;
    }

    const url = new URL(link.href, window.location.href);
    const samePage =
      url.pathname === window.location.pathname &&
      url.search === window.location.search;

    if (!samePage || !url.hash || url.hash === "#") {
      return;
    }

    const target = getHashTarget(url.hash);

    if (!target) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", url.hash);
    scrollToHash(url.hash);
  }

  function handleHashNavigation() {
    if (!window.location.hash) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollToHash(window.location.hash, "auto");
      });
    });
  }

  document.addEventListener("click", handleAnchorClick);
  window.addEventListener("hashchange", handleHashNavigation);

  if (document.readyState === "complete") {
    handleHashNavigation();
  } else {
    window.addEventListener("load", handleHashNavigation, { once: true });
  }

  const heroDemo = document.querySelector(".workflow-demo");

  if (!heroDemo) {
    return;
  }

  const replayButton = heroDemo.querySelector(".demo-replay");
  const scenePills = Array.from(
    heroDemo.querySelectorAll(".workflow-step-pill"),
  );
  const sceneSequence = [1, 2, 3];
  const sceneDurationsMs = {
    1: 2200,
    2: 3200,
    3: 3000,
  };
  const finalHoldMs = 1800;

  let timerId = null;
  let observer = null;
  let currentIndex = 0;
  let isVisible = false;

  function makeDecorativeControl(control) {
    control.classList.add("is-decorative-control");
    control.setAttribute("aria-hidden", "true");
    control.setAttribute("tabindex", "-1");
  }

  Array.from(heroDemo.querySelectorAll("button")).forEach((control) => {
    if (control !== replayButton) {
      makeDecorativeControl(control);
    }
  });

  function syncScenePills(scene) {
    scenePills.forEach((pill) => {
      pill.setAttribute(
        "aria-current",
        pill.dataset.step === String(scene) ? "true" : "false",
      );
    });
  }

  function setScene(scene) {
    heroDemo.dataset.scene = String(scene);
    syncScenePills(scene);
  }

  function clearPlayback() {
    if (timerId) {
      window.clearTimeout(timerId);
      timerId = null;
    }

    heroDemo.classList.remove("is-playing");
  }

  function armSceneAnimation() {
    heroDemo.classList.remove("is-playing");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroDemo.classList.add("is-playing");
      });
    });
  }

  function scheduleNext(delay) {
    timerId = window.setTimeout(() => {
      if (!isVisible || reducedMotion.matches) {
        return;
      }

      currentIndex = (currentIndex + 1) % sceneSequence.length;
      const scene = sceneSequence[currentIndex];
      setScene(scene);
      armSceneAnimation();

      const duration = sceneDurationsMs[scene] ?? sceneDurationsMs[3];
      const nextDelay = scene === 3 ? duration + finalHoldMs : duration;
      scheduleNext(nextDelay);
    }, delay);
  }

  function startPlayback() {
    if (reducedMotion.matches) {
      clearPlayback();
      setScene(3);
      return;
    }

    clearPlayback();
    currentIndex = 0;
    setScene(sceneSequence[currentIndex]);
    armSceneAnimation();
    scheduleNext(sceneDurationsMs[1]);
  }

  function handleVisibilityChange(entries) {
    const [entry] = entries;
    isVisible = Boolean(entry?.isIntersecting);

    if (reducedMotion.matches) {
      setScene(3);
      return;
    }

    if (isVisible) {
      startPlayback();
      return;
    }

    clearPlayback();
  }

  function handleReducedMotionChange(event) {
    if (replayButton) {
      replayButton.hidden = event.matches;
    }

    clearPlayback();
    setScene(event.matches ? 3 : 1);

    if (!event.matches && isVisible) {
      startPlayback();
    }
  }

  setScene(reducedMotion.matches ? 3 : 1);

  if (replayButton) {
    replayButton.hidden = reducedMotion.matches;
    replayButton.addEventListener("click", (event) => {
      event.preventDefault();

      if (!reducedMotion.matches) {
        startPlayback();
      }
    });
  }

  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", handleReducedMotionChange);
  } else if (typeof reducedMotion.addListener === "function") {
    reducedMotion.addListener(handleReducedMotionChange);
  }

  observer = new IntersectionObserver(handleVisibilityChange, {
    threshold: 0.45,
  });

  observer.observe(heroDemo);
})();
