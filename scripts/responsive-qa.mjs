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
    await page
      .locator("#profiles")
      .waitFor({ state: "attached", timeout: 10000 });
    const skip = page.getByRole("button", { name: /skip intro/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();
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
        navigationReplay: Boolean(
          document.querySelector(
            '[aria-label="Replay cinematic introduction"]',
          ),
        ),
        mobileNavigation: Boolean(document.querySelector("#mobile-nav")),
        scrollCue: document.querySelector(".scroll-cue")?.textContent.trim(),
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
        JSON.stringify([
          "Home",
          "Projects",
          "Achievements",
          "Coding",
          "About",
          "Contact",
        ]) &&
      initial.navigationReplay &&
      initial.navigationWorks &&
      initial.scrollCue.includes("SCROLL TO DISCOVER") &&
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
    titleVisible:
      getComputedStyle(document.querySelector(".hero-title")).visibility !==
      "hidden",
    replayDisabled: document.querySelector(".nav-replay")?.disabled,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
  }));
  record("reduced-motion", {
    ...reduced,
    passed:
      !reduced.introVisible && reduced.titleVisible && reduced.replayDisabled,
  });
  await motionContext.close();

  const introContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const introPage = await introContext.newPage();
  const introMonitor = await monitor(introPage);
  await introPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const skipIntro = introPage.getByRole("button", { name: /skip intro/i });
  await skipIntro.waitFor({ state: "visible", timeout: 5000 });
  const initialCounter = await introPage
    .locator(".intro-counter strong")
    .textContent();
  await introPage.waitForFunction(
    () =>
      document.querySelector(".intro-counter strong")?.textContent === "50%",
    undefined,
    { timeout: 22000 },
  );
  const flipState = await introPage
    .locator(".cinematic-letter")
    .evaluateAll((letters) => {
      const transforms = letters.map(
        (letter) => getComputedStyle(letter).transform,
      );
      return {
        count: letters.length,
        distinctTransforms: new Set(transforms).size,
      };
    });
  const hasExploreBefore = await introPage
    .getByRole("button", { name: /explore/i })
    .count();
  await introPage.waitForFunction(
    () =>
      document.querySelector(".intro-counter strong")?.textContent === "100%",
    undefined,
    { timeout: 16000 },
  );
  await introPage
    .locator(".hero-title")
    .waitFor({ state: "visible", timeout: 3000 });
  const sequenceResult = await introPage.evaluate(() => ({
    introGone: !document.querySelector(".cinematic-intro"),
    scrollCue: document.querySelector(".scroll-cue")?.textContent.trim(),
    sessionRecorded: sessionStorage.getItem("uday-intro-seen") === "1",
    sceneStatus:
      document.querySelector(".intro-status")?.textContent ??
      "handoff complete",
  }));
  const earthOpacityBefore = await introPage
    .locator(".scene-stage")
    .evaluate((node) => getComputedStyle(node).opacity);
  await introPage.mouse.wheel(0, 900);
  await introPage.waitForTimeout(750);
  const scrollResult = await introPage.evaluate(() => ({
    y: window.scrollY,
    hash: location.hash,
    sceneOpacity: getComputedStyle(document.querySelector(".scene-stage"))
      .opacity,
  }));
  await introPage.reload({ waitUntil: "domcontentloaded" });
  await introPage.locator("#profiles").waitFor({ state: "attached" });
  const returningVisit =
    (await introPage.locator(".cinematic-intro").count()) === 0;
  await introPage
    .getByRole("button", { name: /replay cinematic introduction/i })
    .click();
  await introPage.locator(".cinematic-intro").waitFor({ state: "visible" });
  await introPage.getByRole("button", { name: /skip intro/i }).click();
  const replayAndSkip =
    (await introPage.locator(".cinematic-intro").count()) === 0;
  await introPage
    .getByRole("button", { name: /replay cinematic introduction/i })
    .click();
  await introPage.locator(".cinematic-intro").waitFor({ state: "visible" });
  await introPage.keyboard.press("PageDown");
  await introPage
    .locator(".cinematic-intro")
    .waitFor({ state: "detached", timeout: 3000 });
  await introPage
    .waitForFunction(() => window.scrollY > 500, undefined, { timeout: 5000 })
    .catch(() => {});
  const keyboardFastForward = await introPage.evaluate(
    () =>
      window.scrollY > 500 && sessionStorage.getItem("uday-intro-seen") === "1",
  );
  const introPassed =
    initialCounter === "1%" &&
    flipState.count > 5 &&
    flipState.distinctTransforms > 2 &&
    hasExploreBefore === 0 &&
    sequenceResult.introGone &&
    sequenceResult.sessionRecorded &&
    sequenceResult.scrollCue.includes("SCROLL TO DISCOVER") &&
    scrollResult.y > 0 &&
    Math.abs(Number(earthOpacityBefore) - Number(scrollResult.sceneOpacity)) >
      0.05 &&
    returningVisit &&
    replayAndSkip &&
    keyboardFastForward &&
    introMonitor.errors.length === 0;
  record("cinematic-and-scroll", {
    initialCounter,
    flipState,
    hasExploreBefore,
    ...sequenceResult,
    scrollResult,
    earthOpacityBefore,
    returningVisit,
    replayAndSkip,
    keyboardFastForward,
    errors: introMonitor.errors,
    unavailableApis: introMonitor.unavailableApis,
    passed: introPassed,
  });
  await introContext.close();

  const touchContext = await browser.newContext({
    viewport: { width: 375, height: 850 },
    hasTouch: true,
  });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await touchPage
    .getByRole("button", { name: /skip intro/i })
    .waitFor({ state: "visible" });
  await touchPage.evaluate(() => {
    const root = document.querySelector(".cinematic-intro");
    const makeTouch = (y) =>
      new Touch({
        identifier: 1,
        target: root,
        clientX: 180,
        clientY: y,
        pageX: 180,
        pageY: y,
        screenX: 180,
        screenY: y,
      });
    root.dispatchEvent(
      new TouchEvent("touchstart", {
        touches: [makeTouch(260)],
        bubbles: true,
      }),
    );
    root.dispatchEvent(
      new TouchEvent("touchmove", {
        touches: [makeTouch(170)],
        bubbles: true,
        cancelable: true,
      }),
    );
  });
  await touchPage
    .locator(".cinematic-intro")
    .waitFor({ state: "detached", timeout: 3000 });
  await touchPage
    .waitForFunction(() => window.scrollY > 500, undefined, { timeout: 5000 })
    .catch(() => {});
  const touchResult = await touchPage.evaluate(() => ({
    touchFastForward: window.scrollY > 500,
    scrollY: window.scrollY,
    introSeen: sessionStorage.getItem("uday-intro-seen") === "1",
  }));
  record("touch-fast-forward", {
    ...touchResult,
    passed: touchResult.touchFastForward && touchResult.introSeen,
  });
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
