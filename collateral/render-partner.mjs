// Render a partner announcement graphic to PNG.
//   node collateral/render-partner.mjs [html] [logo-path-relative-to-collateral] [out.png]
// Defaults: ig-partner-gamebreaker.html, no logo (placeholder), same-name .png
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = await import("/opt/node22/lib/node_modules/playwright/index.mjs"));
}

const dir = path.dirname(fileURLToPath(import.meta.url));
const html = process.argv[2] && process.argv[2] !== "-" ? process.argv[2] : "ig-partner-gamebreaker.html";
const logo = process.argv[3] && process.argv[3] !== "-" ? process.argv[3] : "";
const out = process.argv[4] ?? html.replace(/\.html$/, ".png");

const url = pathToFileURL(path.join(dir, html)).href + (logo ? `?logo=${encodeURIComponent(logo)}` : "");
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(dir, out) });
await browser.close();
console.log("wrote", path.join(dir, out));
