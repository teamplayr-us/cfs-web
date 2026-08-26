// Render the transparent branded overlay for Instagram Reels (1080x1920).
//
// Usage (from the repo root):
//   node collateral/render-reel-overlay.mjs                        -> default branding
//   node collateral/render-reel-overlay.mjs "Dallas. December."    -> custom strap headline
//   node collateral/render-reel-overlay.mjs - - reel-clean.png     -> no strap (frame + logo only)
//
// Args (all optional):
//   1. Strap headline  — default "College Flag Showcase Series"; pass "-" to
//      drop the strap entirely (frame + logo chip only)
//   2. Strap sub line  — default "collegeflagshowcase.com"; "-" hides it
//   3. Output filename — default reel-overlay.png
//   4. "--preview"     — also writes <out>-preview.png with a simulated
//      dark background under the overlay, for review only (never post it)
//
// The output PNG has a TRANSPARENT background: layer it full-bleed on top
// of reel footage in the Instagram editor, CapCut, or Canva.

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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
const argv = process.argv.slice(2);
const preview = argv.includes("--preview");
const [headline, sub, outFile] = argv.filter((a) => a !== "--preview");

let html = readFileSync(join(here, "reel-overlay.html"), "utf8")
  .replaceAll("{{HEADLINE}}", headline && headline !== "-" ? headline : "College Flag Showcase Series")
  .replaceAll("{{SUB}}", sub && sub !== "-" ? sub : "collegeflagshowcase.com");

if (headline === "-") {
  html = html.replace(/<div class="strap">[\s\S]*?<\/div>/, "");
}

const tmp = join(here, ".reel-overlay.tmp.html");
const out = join(here, outFile || "reel-overlay.png");

const { globSync } = await import("node:fs");
const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(
  chromePath ? { executablePath: chromePath } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });

writeFileSync(tmp, html);
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out, omitBackground: true });
console.log(`rendered ${out}`);

if (preview) {
  await page.evaluate(() => document.body.classList.add("preview"));
  const previewOut = out.replace(/\.png$/, "-preview.png");
  await page.screenshot({ path: previewOut });
  console.log(`rendered ${previewOut} (review only)`);
}

await browser.close();
unlinkSync(tmp);
