// Render collateral/coach-agenda-dallas.html → letter PDF + 2x PNG.
// Usage (from the repo root): node collateral/render-coach-agenda.mjs
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(
  "/opt/node22/lib/node_modules/playwright/index.mjs"
).catch(() => import("playwright"));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 816, height: 1056 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${join(here, "coach-agenda-dallas.html")}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.pdf({
  path: join(here, "coach-agenda-dallas.pdf"),
  width: "8.5in",
  height: "11in",
  printBackground: true,
  pageRanges: "1",
});
await page.screenshot({ path: join(here, "coach-agenda-dallas.png") });
await browser.close();
console.log("rendered coach-agenda-dallas (.pdf + .png)");
