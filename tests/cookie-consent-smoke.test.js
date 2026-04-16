const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const { chromium } = require("playwright");

const repoRoot = path.resolve(__dirname, "..");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function createStaticServer(rootDir) {
  return http.createServer((request, response) => {
    const requestUrl = new URL(request.url, "http://127.0.0.1");
    const pathname = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
    const filePath = path.join(rootDir, pathname.replace(/^\/+/, ""));
    const normalized = path.normalize(filePath);

    if (!normalized.startsWith(rootDir)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    fs.readFile(normalized, (error, fileBuffer) => {
      if (error) {
        response.writeHead(error.code === "ENOENT" ? 404 : 500).end("Not found");
        return;
      }

      const extension = path.extname(normalized).toLowerCase();
      response.writeHead(200, {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "no-store",
      });
      response.end(fileBuffer);
    });
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      resolve(server.address());
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function readLocalStorageJson(page, key) {
  return page.evaluate((storageKey) => {
    const value = window.localStorage.getItem(storageKey);
    return value ? JSON.parse(value) : null;
  }, key);
}

test(
  "homepage consent, cookie settings, and support CTA state stay aligned",
  { timeout: 45000 },
  async (t) => {
    const server = createStaticServer(repoRoot);
    const address = await listen(server);
    const baseUrl = `http://${address.address}:${address.port}`;

    t.after(async () => {
      await close(server);
    });

    const browser = await chromium.launch();
    t.after(async () => {
      await browser.close();
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(
      `${baseUrl}/index.html?scenario_id=difficult-boss&ref_id=consent-smoke`,
      { waitUntil: "networkidle" },
    );

    const banner = page.locator("[data-cookie-banner]");
    await assert.doesNotReject(() => banner.waitFor({ state: "visible" }));

    await page
      .locator('[data-cookie-banner] [data-cookie-action="accept-all"]')
      .click();

    await page.waitForFunction(() => {
      const bannerNode = document.querySelector("[data-cookie-banner]");
      return !bannerNode || bannerNode.hidden;
    });

    const acceptedConsent = await readLocalStorageJson(
      page,
      "liaison_cookie_consent",
    );
    assert.equal(acceptedConsent?.continuity, true);

    const storedAttribution = await readLocalStorageJson(page, "lk_deeplink");
    assert.equal(storedAttribution?.scenario_id, "difficult-boss");
    assert.equal(storedAttribution?.ref_id, "consent-smoke");

    await page.goto(`${baseUrl}/support.html`, { waitUntil: "networkidle" });
    const hiddenWithoutSession = await page.locator("[data-session-secondary]")
      .evaluate((node) => node.hidden || node.classList.contains("is-hidden"));
    assert.equal(hiddenWithoutSession, true);

    await page.goto(`${baseUrl}/support.html?session=1`, {
      waitUntil: "networkidle",
    });

    const headerPrimaryText = await page
      .locator(".topbar [data-session-primary]")
      .textContent();
    assert.match(headerPrimaryText || "", /Open Liaison Reply/);

    const secondaryLink = page.locator("[data-session-secondary]");
    await assert.doesNotReject(() => secondaryLink.waitFor({ state: "visible" }));

    const secondaryText = await secondaryLink.textContent();
    assert.match(secondaryText || "", /Start a New Thread/);

    const secondaryHref = await secondaryLink.getAttribute("href");
    assert.match(secondaryHref || "", /\/chat\?new_thread=1/);

    const sessionHint = await page.evaluate(() =>
      window.localStorage.getItem("liaison_auth_hint")
    );
    assert.equal(sessionHint, "1");

    await page.goto(`${baseUrl}/cookies.html#cookie-settings`, {
      waitUntil: "networkidle",
    });

    const status = page.locator("[data-cookie-preference-status]");
    await page.waitForFunction(
      () =>
        document.querySelector("[data-cookie-preference-status]")?.textContent
          ?.includes("Continuity cookies are active."),
    );
    assert.match((await status.textContent()) || "", /Continuity cookies are active\./);

    await page.evaluate(() => {
      document.cookie = "_ga=GA1.1.local-consent-smoke; path=/; SameSite=Lax";
      document.cookie =
        "_ga_FMVPQNPPDD=GS2.1.local-consent-smoke; path=/; SameSite=Lax";
    });

    await page.locator('[data-cookie-action="necessary-only"]').click();

    await page.waitForFunction(
      () =>
        document.querySelector("[data-cookie-preference-status]")?.textContent
          ?.includes("Only necessary site storage is active."),
    );

    const feedback = await page.locator("[data-cookie-feedback]").textContent();
    assert.match(
      feedback || "",
      /Saved handoff details and optional analytics cookies have been cleared where supported\./,
    );

    const declinedConsent = await readLocalStorageJson(
      page,
      "liaison_cookie_consent",
    );
    assert.equal(declinedConsent?.continuity, false);

    await page.waitForFunction(() => !window.localStorage.getItem("lk_deeplink"));
    await page.waitForFunction(() => !window.localStorage.getItem("liaison_auth_hint"));
    await page.waitForFunction(() => !document.cookie.includes("_ga="));
    await page.waitForFunction(
      () => !document.cookie.includes("_ga_FMVPQNPPDD="),
    );

    await page.goto(`${baseUrl}/support.html`, { waitUntil: "networkidle" });

    const resetPrimaryText = await page
      .locator(".topbar [data-session-primary]")
      .textContent();
    assert.match(resetPrimaryText || "", /Start Free & Try a Reply/);

    const hiddenAfterRevocation = await page.locator("[data-session-secondary]")
      .evaluate((node) => node.hidden || node.classList.contains("is-hidden"));
    assert.equal(hiddenAfterRevocation, true);
  },
);
