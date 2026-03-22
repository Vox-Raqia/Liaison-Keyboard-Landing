(() => {
  const heroDemo = document.querySelector('.workflow-demo');

  if (!heroDemo) {
    return;
  }

  const replayButton = heroDemo.querySelector('.demo-replay');
  const scenePills = Array.from(heroDemo.querySelectorAll('.workflow-step-pill'));
  const sceneSequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const sceneDurationsMs = {
    1: 3500,
    2: 1800,
    3: 1200,
    4: 2200,
    5: 1800,
    6: 2500,
    7: 3500,
    8: 2200,
    9: 1200,
    10: 6500,
  };
  const finalHoldMs = 3000;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let timerId = null;
  let observer = null;
  let currentIndex = 0;
  let isVisible = false;

  function syncScenePills(scene) {
    scenePills.forEach((pill) => {
      pill.setAttribute('aria-current', pill.dataset.step === String(scene) ? 'true' : 'false');
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

    heroDemo.classList.remove('is-playing');
  }

  function armSceneAnimation() {
    heroDemo.classList.remove('is-playing');

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        heroDemo.classList.add('is-playing');
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

      const duration = sceneDurationsMs[scene] ?? sceneDurationsMs[10];
      const nextDelay = scene === 10 ? duration + finalHoldMs : duration;
      scheduleNext(nextDelay);
    }, delay);
  }

  function startPlayback() {
    if (reducedMotion.matches) {
      clearPlayback();
      setScene(10);
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
      setScene(10);
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
    setScene(event.matches ? 10 : 1);

    if (!event.matches && isVisible) {
      startPlayback();
    }
  }

  setScene(reducedMotion.matches ? 10 : 1);

  if (replayButton) {
    replayButton.hidden = reducedMotion.matches;
    replayButton.addEventListener('click', () => {
      if (!reducedMotion.matches) {
        startPlayback();
      }
    });
  }

  if (typeof reducedMotion.addEventListener === 'function') {
    reducedMotion.addEventListener('change', handleReducedMotionChange);
  } else if (typeof reducedMotion.addListener === 'function') {
    reducedMotion.addListener(handleReducedMotionChange);
  }

  observer = new IntersectionObserver(handleVisibilityChange, {
    threshold: 0.45,
  });

  observer.observe(heroDemo);
})();
