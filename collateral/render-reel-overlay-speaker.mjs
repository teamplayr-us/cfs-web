// Render the speaker-ID Reels overlay (transparent 1080x1920).
// Usage (from the repo root):
//   node collateral/render-reel-overlay-speaker.mjs "Maddie Melton" "ETBU" [out.png] [--preview]
// Speaker name + org/school render as a lower-third ID tag; output name
// defaults to reel-overlay-speaker-<name>.png.
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
const argv = process.argv.slice(2);
const preview = argv.includes("--preview");
const [name, org, outFile] = argv.filter((a) => a !== "--preview");
if (!name || !org) {
  console.error('Usage: node render-reel-overlay-speaker.mjs "Name" "Org" [out.png] [--preview]');
  process.exit(1);
}

const html = readFileSync(join(here, "reel-overlay-speaker.html"), "utf8")
  .replaceAll("{{NAME}}", name)
  .replaceAll("{{ORG}}", org);
const tmp = join(here, ".reel-overlay-speaker.tmp.html");
writeFileSync(tmp, html);

const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const out = join(here, outFile || `reel-overlay-speaker-${slug}.png`);

const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(chromePath ? { executablePath: chromePath } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
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
