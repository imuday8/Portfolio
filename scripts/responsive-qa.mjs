import { chromium } from "playwright-core";

const executablePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const baseUrl = process.env.PORTFOLIO_URL || "http://127.0.0.1:5173/";
const viewports = [320, 375, 768, 1024, 1440, 1920].map((width) => ({
  width,
  height: width < 680 ? 850 : width < 1100 ? 900 : 1000,
}));
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

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page
      .locator("#profiles")
      .waitFor({ state: "attached", timeout: 10000 });
    await page.waitForTimeout(3300);
    await page.evaluate(() => document.fonts.ready);
    const result = await page.evaluate(() => {
      const body = document.body;
      const root = document.documentElement;
      const heroTitle = document.querySelector(".hero-title");
      const hero = document.querySelector(".hero");
      const titleRect = heroTitle.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const links = [...document.querySelectorAll(".profile-card")].map(
        (card) => card.href,
      );
      return {
        viewport: innerWidth,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        maxScroll: Math.max(0, root.scrollWidth - root.clientWidth),
        heroTitleFits: titleRect.left >= 0 && titleRect.right <= innerWidth + 1,
        heroContainsTitle:
          titleRect.top >= heroRect.top && titleRect.bottom <= heroRect.bottom,
        profileCards: links.length,
        profileLinks: links,
        logos: document.querySelectorAll(".profile-brand svg").length,
        missingNames: [...document.querySelectorAll("a,button")].filter(
          (node) =>
            !(node.textContent.trim() || node.getAttribute("aria-label")),
        ).length,
      };
    });
    if (viewport.width === 320) {
      await page.getByRole("button", { name: /open navigation menu/i }).click();
      const opened = await page
        .getByRole("button", { name: /close navigation menu/i })
        .getAttribute("aria-expanded");
      await page.locator('#mobile-nav a[href="#profiles"]').click();
      await page.waitForTimeout(950);
      result.navigationWorks =
        opened === "true" && new URL(page.url()).hash === "#profiles";
    } else if (viewport.width === 1440) {
      await page.locator('.desktop-nav a[href="#profiles"]').click();
      await page.waitForTimeout(950);
      result.navigationWorks = new URL(page.url()).hash === "#profiles";
    } else {
      result.navigationWorks = true;
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    result.fullPageScrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    if (
      viewport.width === 320 ||
      viewport.width === 375 ||
      viewport.width === 1440
    ) {
      await page.screenshot({
        path: `/private/tmp/portfolio-${viewport.width}.png`,
        fullPage: true,
        animations: "disabled",
      });
    }
    const passed =
      result.scrollWidth <= result.clientWidth &&
      result.fullPageScrollWidth <= result.clientWidth &&
      result.heroTitleFits &&
      result.heroContainsTitle &&
      result.profileCards === 3 &&
      result.logos === 3 &&
      result.missingNames === 0 &&
      result.navigationWorks &&
      errors.length === 0;
    console.log(JSON.stringify({ ...result, errors, passed }));
    if (!passed) failures.push({ viewport: viewport.width, result, errors });
    await context.close();
  }

  const reducedContext = await browser.newContext({
    viewport: { width: 375, height: 850 },
    reducedMotion: "reduce",
  });
  const reducedPage = await reducedContext.newPage();
  await reducedPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await reducedPage.locator("#profiles").waitFor({ state: "attached" });
  await reducedPage.waitForTimeout(180);
  const reduced = await reducedPage.evaluate(() => ({
    introVisible: Boolean(document.querySelector(".boot-screen")),
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    titleVisible:
      getComputedStyle(document.querySelector(".hero-title")).visibility !==
      "hidden",
  }));
  console.log(
    JSON.stringify({
      reducedMotion: reduced,
      passed: !reduced.introVisible && reduced.titleVisible,
    }),
  );
  if (reduced.introVisible || !reduced.titleVisible)
    failures.push({ reducedMotion: reduced });
  await reducedContext.close();

  const introContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const introPage = await introContext.newPage();
  await introPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await introPage
    .getByRole("button", { name: /skip intro/i })
    .waitFor({ state: "visible", timeout: 5000 });
  await introPage.getByRole("button", { name: /skip intro/i }).click();
  await introPage.waitForTimeout(120);
  const skipped = (await introPage.locator(".boot-screen").count()) === 0;
  await introPage.reload({ waitUntil: "domcontentloaded" });
  await introPage.waitForTimeout(200);
  const returning = (await introPage.locator(".boot-screen").count()) === 0;
  console.log(
    JSON.stringify({
      introSkip: skipped,
      repeatVisitBypass: returning,
      passed: skipped && returning,
    }),
  );
  if (!skipped || !returning)
    failures.push({ introSkip: skipped, repeatVisitBypass: returning });
  await introContext.close();

  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
