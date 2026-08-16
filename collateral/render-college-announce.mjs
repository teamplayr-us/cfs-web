// Render an IG "college committed" announcement from the template.
//
// Usage (from the repo root):
//   node collateral/render-college-announce.mjs "Texas Wesleyan University" texas-wesleyan-mono.png
//
// Args:
//   1. College name as it should appear on the post
//   2. Logo filename inside public/colleges/ (use the -mono knockout variant)
//   3. (optional) Event line — defaults to "Event 01 · Dallas, TX · Dec 11–13, 2026"
//   4. (optional) City for the body line — defaults to "Dallas"
//   5. (optional) Output filename — defaults to ig-committed-<logo-name>.png
//
// If Playwright can't find a browser, set CHROMIUM_PATH to a Chromium binary.

import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Resolve playwright from the project, PLAYWRIGHT_PATH, or a global install.
const { chromium } = await (async () => {
  for (const spec of [
    "playwright",
    process.env.PLAYWRIGHT_PATH,
    "/opt/node22/lib/node_modules/playwright/index.mjs",
  ]) {
    if (!spec) continue;
    try {
      return await import(spec);
    } catch {
      // try the next candidate
    }
  }
  throw new Error("playwright not found — npm i -D playwright, or set PLAYWRIGHT_PATH");
})();

const here = dirname(fileURLToPath(import.meta.url));
const [name, logoFile, eventLine, city, outFile] = process.argv.slice(2);
if (!name || !logoFile) {
  console.error('Usage: node render-college-announce.mjs "College Name" logo-mono.png ["Event line"] [out.png]');
  process.exit(1);
}

const html = readFileSync(join(here, "ig-college-committed.html"), "utf8")
  .replaceAll("{{NAME}}", name)
  .replaceAll("{{LOGO}}", `../public/colleges/${logoFile}`)
  .replaceAll(
    "{{EVENT_LINE}}",
    eventLine || "Event 01 &middot; Dallas, TX &middot; Dec 11&ndash;13, 2026",
  )
  .replaceAll("{{CITY}}", city || "Dallas");

const tmp = join(here, ".ig-college-committed.tmp.html");
writeFileSync(tmp, html);

const out = join(
  here,
  outFile || `ig-committed-${logoFile.replace(/(-mono)?\.(png|jpg|jpeg)$/i, "")}.png`,
);

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
unlinkSync(tmp);
console.log(`rendered ${out}`);
