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
    await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
    await page
      .locator("#profiles")
      .waitFor({ state: "attached", timeout: 10000 });
    const skip = page.getByRole("button", { name: /skip intro/i });
    if (await skip.isVisible().catch(() => false)) await skip.click();
    await page.waitForTimeout(300);
    await page.evaluate(() => document.fonts.ready);
    if ([320, 375, 1440].includes(viewport.width)) {
      await page.screenshot({
        path: `/private/tmp/portfolio-v4-${viewport.width}.png`,
        fullPage: false,
      });
    }
    await page
      .locator("#github")
      .evaluate((element) =>
        element.scrollIntoView({ behavior: "instant", block: "start" }),
      );
    await page.waitForTimeout(800);
    await page.locator(".archive-repo").first().waitFor({
      state: "attached",
      timeout: 3000,
    });
    if (viewport.width === 1440) {
      await page.screenshot({
        path: "/private/tmp/portfolio-v4-github-1440.png",
        fullPage: false,
      });
    }

    const result = await page.evaluate(() => {
      const root = document.documentElement;
      const heroTitle = document.querySelector(".hero-title");
      const hero = document.querySelector(".hero");
      const titleRect = heroTitle.getBoundingClientRect();
      const heroRect = hero.getBoundingClientRect();
      const repositoryRows = [...document.querySelectorAll(".archive-repo")];
      return {
        viewport: innerWidth,
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        heroTitleFits: titleRect.left >= 0 && titleRect.right <= innerWidth + 1,
        heroContainsTitle:
          titleRect.top >= heroRect.top && titleRect.bottom <= heroRect.bottom,
        profileCards: document.querySelectorAll(".profile-card").length,
        logos: document.querySelectorAll(".profile-brand svg").length,
        repositoryCount: Number(
          document.querySelector(".archive-count strong")?.textContent,
        ),
        listedRepositoryCount: repositoryRows.length,
        repositoryNames: repositoryRows.map((row) =>
          row.querySelector(".archive-repo-name")?.textContent.trim(),
        ),
        academicPercentile: document
          .querySelector(".academic-number")
          ?.textContent.trim(),
        missingAcademicYear: document
          .querySelector(".academic-facts")
          ?.textContent.includes("Not provided"),
        navigationReplay: Boolean(document.querySelector(".nav-replay")),
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

    if (viewport.width === 1440) {
      const search = page.getByRole("searchbox", {
        name: /search repositories/i,
      });
      await search.fill("PyReach");
      result.archiveSearchWorks =
        (await page.locator(".archive-repo").count()) === 1 &&
        (await page.locator(".archive-repo").innerText())
          .toLowerCase()
          .includes("pyreach");
      await search.fill("");
      const firstLanguage = await page
        .locator(".archive-language select option")
        .nth(1)
        .textContent();
      await page.locator(".archive-language select").selectOption({
        label: firstLanguage.trim(),
      });
      result.archiveLanguageFilterWorks = await page
        .locator(".archive-repo")
        .evaluateAll(
          (rows, selected) =>
            rows.every((row) =>
              row
                .querySelector(".archive-language-chip")
                .textContent.includes(selected),
            ),
          firstLanguage.trim(),
        );
      await page.locator(".archive-language select").selectOption({
        label: "All languages",
      });
    } else {
      result.archiveSearchWorks = true;
      result.archiveLanguageFilterWorks = true;
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    result.fullPageScrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth,
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    const passed =
      result.scrollWidth <= result.clientWidth &&
      result.fullPageScrollWidth <= result.clientWidth &&
      result.heroTitleFits &&
      result.heroContainsTitle &&
      result.profileCards === 3 &&
      result.logos === 3 &&
      result.repositoryCount > 0 &&
      result.repositoryCount === result.listedRepositoryCount &&
      result.navigationReplay &&
      result.archiveSearchWorks &&
      result.archiveLanguageFilterWorks &&
      result.academicPercentile.includes("98.93") &&
      result.missingAcademicYear &&
      result.missingNames === 0 &&
      result.navigationWorks &&
      errors.length === 0;
    console.log(JSON.stringify({ ...result, unavailableApis, errors, passed }));
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
    introVisible: Boolean(document.querySelector(".cinematic-intro")),
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    titleVisible:
      getComputedStyle(document.querySelector(".hero-title")).visibility !==
      "hidden",
    replayDisabled: document.querySelector(".nav-replay")?.disabled,
  }));
  console.log(
    JSON.stringify({
      reducedMotion: reduced,
      passed:
        !reduced.introVisible && reduced.titleVisible && reduced.replayDisabled,
    }),
  );
  if (reduced.introVisible || !reduced.titleVisible || !reduced.replayDisabled)
    failures.push({ reducedMotion: reduced });
  await reducedContext.close();

  const introContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const introPage = await introContext.newPage();
  await introPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  const skipIntro = introPage.getByRole("button", { name: /skip intro/i });
  await skipIntro.waitFor({ state: "visible", timeout: 5000 });
  await introPage.locator(".cinematic-name").waitFor({ state: "visible" });
  await introPage.waitForFunction(
    () =>
      document.querySelector(".intro-counter strong")?.textContent === "100%",
    undefined,
    { timeout: 15000 },
  );
  const sequenceCompleted = await introPage
    .getByRole("button", { name: /explore my universe/i })
    .isEnabled();
  await introPage.getByRole("button", { name: /explore my universe/i }).click();
  await introPage.waitForSelector(".cinematic-intro", { state: "detached" });
  const skipped = (await introPage.locator(".cinematic-intro").count()) === 0;
  const sessionRecorded =
    (await introPage.evaluate(() =>
      sessionStorage.getItem("uday-intro-seen"),
    )) === "1";
  await introPage.reload({ waitUntil: "domcontentloaded" });
  await introPage.waitForTimeout(200);
  const returning = (await introPage.locator(".cinematic-intro").count()) === 0;
  await introPage
    .getByRole("button", { name: /replay cinematic introduction/i })
    .click();
  await introPage.locator(".cinematic-intro").waitFor({ state: "visible" });
  const replayWorks = await introPage
    .getByRole("heading", { name: "Uday Saha" })
    .isVisible();
  await introPage.getByRole("button", { name: /skip intro/i }).click();
  const introResult = {
    sequenceCompleted,
    sessionRecorded,
    repeatVisitBypass: returning,
    replayWorks,
    passed: sequenceCompleted && sessionRecorded && returning && replayWorks,
  };
  console.log(JSON.stringify({ introSequence: introResult }));
  if (!introResult.passed) failures.push({ introSequence: introResult });
  await introContext.close();

  if (failures.length) process.exitCode = 1;
} finally {
  await browser.close();
}
