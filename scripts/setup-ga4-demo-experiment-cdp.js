const { chromium } = require("playwright");

const CHROME_CDP_ENDPOINT = process.env.CHROME_CDP_ENDPOINT ||
  "http://127.0.0.1:9222";

const EXPERIMENT_DIMENSIONS = [
  {
    name: "Demo Copy Experiment ID",
    param: "demo_copy_experiment_id",
    description: "Experiment id for landing demo copy A/B test.",
  },
  {
    name: "Demo Copy Variant",
    param: "demo_copy_variant",
    description: "Assigned landing demo copy variant.",
  },
  {
    name: "Assignment Source",
    param: "assignment_source",
    description: "Variant assignment source: query, stored, or random.",
  },
];

async function isVisible(locator) {
  try {
    if (await locator.count() === 0) {
      return false;
    }
    return await locator.first().isVisible();
  } catch {
    return false;
  }
}

async function clickAny(locators, options = {}) {
  for (const locator of locators) {
    if (await isVisible(locator)) {
      await locator.first().click(options);
      return true;
    }
  }
  return false;
}

async function fillAny(locators, value) {
  for (const locator of locators) {
    if (!(await isVisible(locator))) {
      continue;
    }

    const input = locator.first();
    await input.click();
    await input.fill("");
    await input.fill(value);
    return true;
  }
  return false;
}

async function waitForSignIn(page, timeoutMs = 1800000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const url = page.url();
    const onGoogleSignIn = /accounts\.google\.com/i.test(url);
    const onAnalyticsApp = /analytics\.google\.com\/analytics\/web/i.test(url);
    const signInVisible = await isVisible(
      page.getByRole("link", { name: /sign in/i }),
    ) ||
      await isVisible(page.getByRole("button", { name: /sign in/i }));

    if (!onGoogleSignIn && (onAnalyticsApp || !signInVisible)) {
      return true;
    }

    await page.waitForTimeout(1500);
  }

  return false;
}

async function extractPropertyId(page) {
  const url = page.url();
  const urlMatch = url.match(/(?:\/|#|^)p(\d{4,})/i) ||
    url.match(/a\d+p(\d{4,})/i);
  if (urlMatch) {
    return urlMatch[1];
  }

  const body = await page.textContent("body").catch(() => "");
  if (body) {
    const bodyMatch = body.match(/\/p(\d+)\//i);
    if (bodyMatch) {
      return bodyMatch[1];
    }
  }

  return null;
}

async function ensureAnalyticsReady(page) {
  await page.goto("https://analytics.google.com/analytics/web/", {
    waitUntil: "domcontentloaded",
  });

  console.log(
    "Finish GA sign-in in your normal Chrome window. Waiting up to 30 minutes...",
  );
  const signedIn = await waitForSignIn(page);
  if (!signedIn) {
    throw new Error("Timed out waiting for Google sign-in.");
  }

  await page.waitForTimeout(3000);
}

async function gotoCustomDefinitions(page) {
  let propertyId = await extractPropertyId(page);

  if (!propertyId) {
    await page.goto("https://analytics.google.com/analytics/web/#/home", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForTimeout(3000);
    propertyId = await extractPropertyId(page);
  }

  if (!propertyId) {
    throw new Error(
      "Could not determine GA4 property id. Select the target property in GA and rerun.",
    );
  }

  const targetUrl =
    `https://analytics.google.com/analytics/web/#/p${propertyId}/admin/customdefinitions`;
  console.log(`Navigating to custom definitions for property p${propertyId}...`);
  await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2500);

  await clickAny([
    page.locator('button:has(.item-text:text-is("Data display"))'),
    page.locator('button:has-text("Data display")'),
    page.locator(':text-is("Data display")'),
  ], { force: true });
  await page.waitForTimeout(500);

  await clickAny([
    page.locator('button:has(.item-text:text-is("Custom definitions"))'),
    page.locator('button:has-text("Custom definitions")'),
    page.locator(':text-is("Custom definitions")'),
  ], { force: true });

  await page.waitForTimeout(2000);
}

async function waitForCreateCustomDimensionButton(page, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const createButton = page.locator(
      'button:has-text("Create custom dimension")',
    ).first();
    if (await createButton.count() > 0) {
      return createButton;
    }

    await clickAny([
      page.locator('button:has(.item-text:text-is("Data display"))'),
      page.locator('button:has-text("Data display")'),
      page.locator(':text-is("Data display")'),
    ], { force: true });
    await page.waitForTimeout(400);

    await clickAny([
      page.locator('button:has(.item-text:text-is("Custom definitions"))'),
      page.locator('button:has-text("Custom definitions")'),
      page.locator(':text-is("Custom definitions")'),
    ], { force: true });

    await page.waitForTimeout(1200);
  }

  return null;
}

async function dimensionExists(page, param) {
  const bodyText = await page.textContent("body").catch(() => "");
  return bodyText.toLowerCase().includes(param.toLowerCase());
}

async function createDimension(page, dimension) {
  const createButton = await waitForCreateCustomDimensionButton(page);
  if (!createButton) {
    throw new Error("Could not find 'Create custom dimension' button.");
  }

  const created = await clickAny([
    createButton,
    page.locator('button:has-text("Create custom dimension")'),
    page.locator(':text("Create custom dimension")'),
  ], { force: true });

  if (!created) {
    throw new Error("Could not find 'Create custom dimension' button.");
  }

  await page.waitForTimeout(1000);

  const nameFilled = await fillAny([
    page.locator('ga-slider-panel-container input[aria-labelledby="custom-name-input-label"]'),
    page.getByLabel(/dimension name/i).locator("input"),
    page.locator('input[aria-labelledby*="custom-name-input-label"]'),
  ], dimension.name);
  if (!nameFilled) {
    throw new Error("Could not fill dimension name.");
  }

  const scopeClicked = await clickAny([
    page.locator('ga-slider-panel-container [aria-labelledby*="scope-input-label"][role="combobox"]'),
    page.getByRole("combobox", { name: /scope/i }),
  ]);
  if (scopeClicked) {
    await clickAny([
      page.getByRole("option", { name: /^event$/i }),
      page.getByRole("listitem", { name: /^event$/i }),
      page.locator('[role="option"]:has-text("Event")'),
    ]);
  }

  const descriptionFilled = await fillAny([
    page.locator('ga-slider-panel-container input[aria-labelledby="description-input-label"]'),
    page.locator('input[aria-labelledby*="description-input-label"]'),
  ], dimension.description);
  if (!descriptionFilled) {
    console.warn("Description input was not found; continuing without description.");
  }

  const paramFilled = await fillAny([
    page.locator('ga-slider-panel-container input[aria-labelledby="parameter-name-input-label"]'),
    page.locator('input[aria-labelledby*="parameter-name-input-label"]'),
    page.getByLabel(/event parameter/i),
    page.locator('input[placeholder*="event parameter" i]'),
    page.locator('input[placeholder*="Select an event parameter" i]'),
  ], dimension.param);
  if (!paramFilled) {
    throw new Error("Could not fill event parameter.");
  }

  await page.keyboard.press("Enter").catch(() => {});

  const saved = await clickAny([
    page.locator('ga-slider-panel-container button:has-text("Save")'),
    page.getByRole("button", { name: /^save$/i }),
    page.locator('button:has-text("Save")'),
  ], { force: true });
  if (!saved) {
    throw new Error("Could not click Save.");
  }

  await page.waitForTimeout(3000);
  await page.locator("ga-slider-panel-container").waitFor({
    state: "hidden",
    timeout: 20000,
  }).catch(() => {});
}

async function ensureDimensions(page) {
  for (const dimension of EXPERIMENT_DIMENSIONS) {
    if (await dimensionExists(page, dimension.param)) {
      console.log(`Exists: ${dimension.param}`);
      continue;
    }

    console.log(`Creating: ${dimension.param}`);
    await createDimension(page, dimension);

    if (await dimensionExists(page, dimension.param)) {
      console.log(`Created: ${dimension.param}`);
      continue;
    }

    throw new Error(`Created flow ran, but ${dimension.param} not detected.`);
  }
}

async function run() {
  console.log(`Connecting to Chrome CDP at ${CHROME_CDP_ENDPOINT} ...`);
  const browser = await chromium.connectOverCDP(CHROME_CDP_ENDPOINT);

  try {
    const context = browser.contexts()[0];
    if (!context) {
      throw new Error(
        "No browser context found. Make sure Chrome is running with --remote-debugging-port=9222.",
      );
    }

    const page = context.pages()[0] || await context.newPage();
    await ensureAnalyticsReady(page);
    await gotoCustomDefinitions(page);
    await ensureDimensions(page);
    console.log("Done. All experiment dimensions are present.");
    await page.bringToFront();
    await page.waitForTimeout(1500);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
