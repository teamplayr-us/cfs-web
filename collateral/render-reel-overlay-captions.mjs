// Render the captions-variant Reels overlay (transparent 1080x1920).
// Usage (from the repo root):
//   node collateral/render-reel-overlay-captions.mjs [--preview]
// --preview also writes reel-overlay-captions-preview.png with a dark
// background and dashed markers on the title/caption zones (review only).
import { readFileSync, writeFileSync, unlinkSync, globSync } from "node:fs";
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
const preview = process.argv.includes("--preview");
const tmp = join(here, ".reel-overlay-captions.tmp.html");
writeFileSync(tmp, readFileSync(join(here, "reel-overlay-captions.html"), "utf8"));

const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(chromePath ? { executablePath: chromePath } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const out = join(here, "reel-overlay-captions.png");
await page.screenshot({ path: out, omitBackground: true });
console.log(`rendered ${out}`);
if (preview) {
  await page.evaluate(() => document.body.classList.add("preview"));
  const p = out.replace(/\.png$/, "-preview.png");
  await page.screenshot({ path: p });
  console.log(`rendered ${p} (review only)`);
}
await browser.close();
unlinkSync(tmp);
