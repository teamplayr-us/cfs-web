// Render the branded Reels closing slide (1080x1920).
// Usage (from the repo root): node collateral/render-reel-closing.mjs
import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const { chromium } = await (async () => {
  for (const spec of [
    "playwright",
    process.env.PLAYWRIGHT_PATH,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
  ]) {
    if (!spec) continue;
    try { return await import(spec); } catch {}
  }
  throw new Error("playwright not found");
})();

const here = dirname(fileURLToPath(import.meta.url));
const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(chromePath ? { executablePath: chromePath } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${join(here, "reel-closing.html")}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const out = join(here, "reel-closing.png");
await page.screenshot({ path: out });
console.log(`rendered ${out}`);
await browser.close();
