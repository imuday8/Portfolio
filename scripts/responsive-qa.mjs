import { chromium } from "playwright-core";

const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = process.env.PORTFOLIO_URL || "http://127.0.0.1:5173/";
const widths = [320, 375, 768, 1024, 1440, 1920];
const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: [
    "--no-sandbox",
    "--enable-webgl",
    "--ignore-gpu-blocklist",
    "--use-gl=angle",
    "--use-angle=swiftshader",
  ],
});
const failures = [];
const expectedProjects = ["PyReach", "Portfolio", "Hexamind"];

function record(name, result) {
  console.log(JSON.stringify({ name, ...result }));
  if (!result.passed) failures.push({ name, ...result });
}

async function monitor(page) {
  const errors = [];
  const unavailableApis = [];
  page.on("response", (response) => {
    const url = response.url();
    if (
      response.status() === 403 &&
      (url.includes("api.github.com") || url.includes("codeforces.com/api"))
    )
      unavailableApis.push(url);
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (
      unavailableApis.length &&
      message.text().includes("Failed to load resource") &&
      message.text().includes("403")
    )
      return;
    errors.push(message.text());
  });
  return { errors, unavailableApis };
}

try {
  for (const width of widths) {
    const height = width < 680 ? 850 : width < 1100 ? 900 : 1000;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const { errors, unavailableApis } = await monitor(page);
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /skip intro/i }).click({
      timeout: 10000,
    });
    await page
      .locator("#profiles")
      .waitFor({ state: "attached", timeout: 10000 });
    await page.waitForTimeout(260);
    await page.evaluate(() => document.fonts.ready);
    if ([320, 375, 1440].includes(width))
      await page.screenshot({
        path: `/private/tmp/portfolio-v5-${width}.png`,
        fullPage: false,
      });

    const initial = await page.evaluate(() => {
      const root = document.documentElement;
      const hero = document.querySelector(".hero");
      const title = document.querySelector(".hero-title");
      const description = document.querySelector(".hero-description");
      const titleBox = title.getBoundingClientRect();
      const descriptionBox = description.getBoundingClientRect();
      const heroBox = hero.getBoundingClientRect();
      const projects = [
        ...document.querySelectorAll("#work .project-chapter h3"),
      ].map((heading) =>
        heading.textContent.replace(/\s+/g, " ").trim().replace(/\.$/, ""),
      );
      const articleBoxes = [
        ...document.querySelectorAll("#work .project-chapter"),
      ].map((article) => {
        const art = article
          .querySelector(".project-art")
          .getBoundingClientRect();
        const copy = article
          .querySelector(".project-copy")
          .getBoundingClientRect();
        const intersects =
          art.left < copy.right &&
          art.right > copy.left &&
          art.top < copy.bottom &&
          art.bottom > copy.top;
        return {
          intersects,
          art: [art.left, art.top, art.right, art.bottom],
          copy: [copy.left, copy.top, copy.right, copy.bottom],
        };
      });
      return {
        viewport: innerWidth,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        heroTitleFits: titleBox.left >= 0 && titleBox.right <= innerWidth + 1,
        heroTitleInsideHero:
          titleBox.top >= heroBox.top && titleBox.bottom <= heroBox.bottom,
        heroTitleBeforeDescription: titleBox.bottom <= descriptionBox.top + 1,
        projectNames: projects,
        projectCount: projects.length,
        projectTextOverlapsArtwork: articleBoxes.some((box) => box.intersects),
        projectBoxes: articleBoxes,
        navigation: [...document.querySelectorAll(".desktop-nav a")].map(
          (link) => link.textContent.trim(),
        ),
        hasIntro: Boolean(document.querySelector(".cinematic-intro")),
        dashboardProjects: [
          ...document.querySelectorAll(".dashboard-project strong"),
        ].map((node) => node.textContent.trim()),
        dashboardMetrics: document.querySelectorAll(".dashboard-metric").length,
        capabilityCards: document.querySelectorAll(".capability-card").length,
        mobileNavigation: Boolean(document.querySelector("#mobile-nav")),
        scrollCue: document.querySelector(".hero-primary")?.textContent.trim(),
        hasExploreButton: [...document.querySelectorAll("button")].some(
          (button) => /explore my universe/i.test(button.textContent),
        ),
        hasEarthCanvas: Boolean(document.querySelector("canvas")),
        jeePercentile: document
          .querySelector(".academic-number")
          ?.textContent.trim(),
        rankFabricated: Boolean(document.querySelector(".academic-facts")),
        missingNames: [...document.querySelectorAll("a,button")].filter(
          (node) =>
            !(node.textContent.trim() || node.getAttribute("aria-label")),
        ).length,
      };
    });

    if (width <= 900) {
      const open = page.getByRole("button", { name: /open navigation menu/i });
      await open.click();
      const expanded = await page
        .getByRole("button", { name: /close navigation menu/i })
        .getAttribute("aria-expanded");
      await page.locator('#mobile-nav a[href="#profiles"]').click();
      await page.waitForTimeout(750);
      initial.navigationWorks =
        expanded === "true" && new URL(page.url()).hash === "#profiles";
    } else {
      const coding = page.locator('.desktop-nav a[href="#profiles"]');
      await coding.click();
      await page.waitForTimeout(750);
      initial.navigationWorks = new URL(page.url()).hash === "#profiles";
    }

    if (width === 1440) {
      await page
        .locator("#github")
        .evaluate((element) =>
          element.scrollIntoView({ behavior: "instant", block: "start" }),
        );
      await page.waitForTimeout(750);
      await page.screenshot({
        path: "/private/tmp/portfolio-v5-archive.png",
        fullPage: false,
      });
      const search = page.getByRole("searchbox", {
        name: /search repositories/i,
      });
      await search.fill("PyReach");
      initial.archiveSearchWorks =
        (await page.locator(".archive-repo").count()) === 1 &&
        (await page.locator(".archive-repo").innerText())
          .toLowerCase()
          .includes("pyreach");
      await search.fill("");
      const option = await page
        .locator(".archive-language select option")
        .nth(1)
        .textContent();
      await page.locator(".archive-language select").selectOption({
        label: option.trim(),
      });
      initial.archiveLanguageFilterWorks = await page
        .locator(".archive-repo")
        .evaluateAll(
          (rows, selected) =>
            rows.every((row) =>
              row
                .querySelector(".archive-language-chip")
                .textContent.includes(selected),
            ),
          option.trim(),
        );
      await page.locator(".archive-language select").selectOption({ index: 0 });
    } else {
      initial.archiveSearchWorks = true;
      initial.archiveLanguageFilterWorks = true;
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    initial.fullPageScrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    initial.githubCount = Number(
      await page.locator(".archive-count strong").textContent(),
    );
    initial.githubRows = await page.locator(".archive-repo").count();
    initial.profileCards = await page.locator(".profile-card").count();
    initial.brandLogos = await page.locator(".profile-brand svg").count();
    initial.passed =
      initial.scrollWidth <= initial.clientWidth &&
      initial.fullPageScrollWidth <= initial.clientWidth &&
      initial.heroTitleFits &&
      initial.heroTitleInsideHero &&
      initial.heroTitleBeforeDescription &&
      initial.projectCount === 3 &&
      JSON.stringify(initial.projectNames) ===
        JSON.stringify(expectedProjects) &&
      !initial.projectTextOverlapsArtwork &&
      JSON.stringify(initial.navigation) ===
        JSON.stringify(["Work", "Approach", "Signals", "About", "Contact"]) &&
      !initial.hasIntro &&
      initial.dashboardMetrics === 3 &&
      JSON.stringify(initial.dashboardProjects) ===
        JSON.stringify(["PyReach", "Portfolio", "Hexamind"]) &&
      initial.capabilityCards === 6 &&
      initial.navigationWorks &&
      initial.scrollCue.includes("Explore my work") &&
      !initial.hasExploreButton &&
      initial.hasEarthCanvas &&
      initial.jeePercentile.includes("98.93") &&
      !initial.rankFabricated &&
      initial.githubCount === 7 &&
      initial.githubRows === 7 &&
      initial.profileCards === 3 &&
      initial.brandLogos === 3 &&
      initial.archiveSearchWorks &&
      initial.archiveLanguageFilterWorks &&
      initial.missingNames === 0 &&
      errors.length === 0;
    record(`responsive-${width}`, { ...initial, unavailableApis, errors });
    await context.close();
  }

  const motionContext = await browser.newContext({
    viewport: { width: 375, height: 850 },
    reducedMotion: "reduce",
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await motionPage.locator("#profiles").waitFor({ state: "attached" });
  await motionPage.waitForTimeout(180);
  const reduced = await motionPage.evaluate(() => ({
    introVisible: Boolean(document.querySelector(".cinematic-intro")),
    replayDisabled: document.querySelector(".nav-replay")?.disabled,
    titleVisible:
      getComputedStyle(document.querySelector(".hero-title")).visibility !==
      "hidden",
    capabilityTransition: getComputedStyle(
      document.querySelector(".capability-card"),
    ).transitionDuration,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  record("reduced-motion", {
    ...reduced,
    passed:
      !reduced.introVisible &&
      reduced.titleVisible &&
      reduced.replayDisabled &&
      Number.parseFloat(reduced.capabilityTransition) <= 0.0001,
  });
  await motionContext.close();

  const introContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const introPage = await introContext.newPage();
  await introPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await introPage
    .locator(".cinematic-intro")
    .waitFor({ state: "visible", timeout: 10000 });
  const introTitle = await introPage.locator(".cinematic-name").getAttribute("aria-label");
  await introPage
    .locator(".cinematic-intro")
    .waitFor({ state: "detached", timeout: 15000 });
  const autoIntroCompletes = !(await introPage.locator(".cinematic-intro").count());
  await introPage
    .getByRole("button", { name: /replay cinematic introduction/i })
    .click();
  await introPage
    .locator(".cinematic-intro")
    .waitFor({ state: "visible", timeout: 3000 });
  const replayWorks = await introPage
    .getByRole("button", { name: /skip intro/i })
    .isVisible();
  await introPage.getByRole("button", { name: /skip intro/i }).click();
  record("cinematic-intro", {
    introTitle,
    autoIntroCompletes,
    replayWorks,
    passed:
      introTitle === "Uday Saha" && autoIntroCompletes && replayWorks,
  });
  await introContext.close();

  const referenceContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const referencePage = await referenceContext.newPage();
  const referenceMonitor = await monitor(referencePage);
  await referencePage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await referencePage.getByRole("button", { name: /skip intro/i }).click({
    timeout: 10000,
  });
  await referencePage.locator(".hero-dashboard").waitFor({ state: "visible" });
  await referencePage
    .locator(".scene-stage canvas")
    .waitFor({ state: "visible", timeout: 15000 })
    .catch(() => {});
  const landing = await referencePage.evaluate(() => ({
    title: document
      .querySelector(".hero-title")
      ?.innerText.replace(/\s+/g, " ")
      .trim(),
    introVisible: Boolean(document.querySelector(".cinematic-intro")),
    projectNames: [
      ...document.querySelectorAll(".dashboard-project strong"),
    ].map((node) => node.textContent.trim()),
    verifiedMetricCount: document.querySelectorAll(".dashboard-metric").length,
    entryButtons: [...document.querySelectorAll(".hero-actions a")].map(
      (node) => node.textContent.trim(),
    ),
    cardCount: document.querySelectorAll(".capability-card").length,
    earthCanvas: Boolean(document.querySelector("canvas")),
    glassDashboard:
      getComputedStyle(document.querySelector(".hero-dashboard")).backdropFilter,
  }));
  const dashboardTransformBefore = await referencePage
    .locator(".hero-dashboard")
    .evaluate((node) => getComputedStyle(node).transform);
  const sceneOpacityBefore = await referencePage
    .locator(".scene-stage")
    .evaluate((node) => getComputedStyle(node).opacity);
  await referencePage.mouse.wheel(0, 850);
  await referencePage.waitForTimeout(950);
  const scrollResult = await referencePage.evaluate(() => ({
    y: window.scrollY,
    sceneOpacity: getComputedStyle(document.querySelector(".scene-stage"))
      .opacity,
    dashboardTransform: getComputedStyle(
      document.querySelector(".hero-dashboard"),
    ).transform,
  }));
  const landingPassed =
    landing.title === "I build tools with intent." &&
    !landing.introVisible &&
    JSON.stringify(landing.projectNames) ===
      JSON.stringify(["PyReach", "Portfolio", "Hexamind"]) &&
    landing.verifiedMetricCount === 3 &&
    landing.entryButtons.length === 2 &&
    landing.cardCount === 6 &&
    landing.earthCanvas &&
    landing.glassDashboard !== "none" &&
    scrollResult.y > 100 &&
    dashboardTransformBefore !== scrollResult.dashboardTransform &&
    Number(scrollResult.sceneOpacity) > 0 &&
    Number(scrollResult.sceneOpacity) <= 1 &&
    referenceMonitor.errors.length === 0;
  record("reference-landing-and-scroll", {
    ...landing,
    sceneOpacityBefore,
    dashboardTransformBefore,
    scrollResult,
    errors: referenceMonitor.errors,
    passed: landingPassed,
  });
  const keyboardStart = await referencePage.evaluate(() => window.scrollY);
  await referencePage.keyboard.press("PageDown");
  await referencePage
    .waitForFunction(
      (previous) => window.scrollY > previous + 100,
      keyboardStart,
      { timeout: 3000 },
    )
    .catch(() => {});
  const keyboardScroll = await referencePage.evaluate(
    (previous) => window.scrollY > previous + 100,
    keyboardStart,
  );
  record("keyboard-scroll", { keyboardScroll, passed: keyboardScroll });
  await referenceContext.close();

  const touchContext = await browser.newContext({
    viewport: { width: 375, height: 850 },
    hasTouch: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await touchPage.getByRole("button", { name: /skip intro/i }).click({
    timeout: 10000,
  });
  await touchPage.locator(".hero-dashboard").waitFor({ state: "visible" });
  const touchSession = await touchContext.newCDPSession(touchPage);
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 180, y: 700, radiusX: 1, radiusY: 1, force: 1 }],
  });
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 180, y: 320, radiusX: 1, radiusY: 1, force: 1 }],
  });
  await touchSession.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await touchPage.waitForTimeout(600);
  const touchScroll = await touchPage.evaluate(() => window.scrollY > 0);
  record("touch-scroll", { touchScroll, passed: touchScroll });
  await touchContext.close();

  const fallbackBrowser = await chromium.launch({
    executablePath,
    headless: true,
    args: ["--no-sandbox", "--disable-webgl", "--disable-3d-apis"],
  });
  const fallbackPage = await fallbackBrowser.newPage({
    viewport: { width: 1280, height: 900 },
  });
  await fallbackPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await fallbackPage
    .locator(".earth-fallback")
    .waitFor({ state: "visible", timeout: 12000 })
    .catch(() => {});
  const fallbackResult = await fallbackPage
    .locator(".earth-fallback")
    .evaluate((node) => ({
      hasTexture: node.style.backgroundImage.includes(
        "earth-night-black-marble",
      ),
      accessibleDescription: node.getAttribute("aria-label"),
    }))
    .catch(() => ({ hasTexture: false, accessibleDescription: null }));
  record("webgl-fallback", {
    ...fallbackResult,
    passed:
      fallbackResult.hasTexture &&
      fallbackResult.accessibleDescription?.includes(
        "unavailable in this browser",
      ),
  });
  await fallbackBrowser.close();

  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
