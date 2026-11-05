// Render collateral/coaches-registered-dallas.html → a shareable PNG
// (1080px wide, full height, 2x). Usage (from the repo root):
//   node collateral/render-coaches-table.mjs
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(
  "/opt/node22/lib/node_modules/playwright/index.mjs"
).catch(() => import("playwright"));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1080, height: 1000 },
  deviceScaleFactor: 2,
});
await page.goto(`file://${join(here, "coaches-registered-dallas.html")}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
const out = join(here, "coaches-registered-dallas.png");
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`rendered ${out}`);
