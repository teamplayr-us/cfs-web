// Render the letter-size one-pagers (HTML → PDF + 2x PNG).
// Usage (from the repo root):
//   node collateral/render-one-pagers.mjs            # all four
//   node collateral/render-one-pagers.mjs parent team

import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const { chromium } = await import(
  "/opt/node22/lib/node_modules/playwright/index.mjs"
).catch(() => import("playwright"));

const names = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["coach", "parent", "team", "sponsorship"];

const browser = await chromium.launch();
for (const n of names) {
  const html = join(here, `cfs-${n}-one-pager.html`);
  const page = await browser.newPage({
    viewport: { width: 816, height: 1056 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file://${html}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.pdf({
    path: join(here, `cfs-${n}-one-pager.pdf`),
    width: "8.5in",
    height: "11in",
    printBackground: true,
    pageRanges: "1",
  });
  await page.screenshot({ path: join(here, `cfs-${n}-one-pager.png`) });
  await page.close();
  console.log(`rendered cfs-${n}-one-pager (.pdf + .png)`);
}
await browser.close();
