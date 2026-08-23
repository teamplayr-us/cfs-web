// Render an IG "team accepted" announcement from the template.
//
// Usage (from the repo root):
//   node collateral/render-org-announce.mjs \
//     "Program Name" program-logo.png "City/Region" "12U · 14U"
//
// Args:
//   1. Program name as it should appear on the post
//   2. Logo filename inside public/programs/ (transparent PNG, same file the
//      site's competing-programs board uses)
//   3. Home city/region — match the site board's location caption
//   4. Divisions they're competing in, e.g. "12U · 14U" (from the accepted
//      invite or the founder — never guessed)
//   5. (optional) Event line — defaults to "Event 01 · Dallas, TX · Dec 11–13, 2026"
//   6. (optional) City for the body line — defaults to "Dallas"
//   7. (optional) Output filename — defaults to ig-org-<logo-name>.png

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
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
const [name, logoFile, location, divisions, eventLine, city, outFile] =
  process.argv.slice(2);
if (!name || !logoFile || !location || !divisions) {
  console.error(
    'Usage: node render-org-announce.mjs "Program Name" logo.png "City/Region" "12U · 14U" ["Event line"] [City] [out.png]',
  );
  process.exit(1);
}

const html = readFileSync(join(here, "ig-org-committed.html"), "utf8")
  .replaceAll("{{NAME}}", name)
  .replaceAll("{{LOGO}}", `../public/programs/${logoFile}`)
  .replaceAll("{{LOCATION}}", location)
  .replaceAll("{{DIVISIONS}}", divisions)
  .replaceAll(
    "{{EVENT_LINE}}",
    eventLine || "Event 01 &middot; Dallas, TX &middot; Dec 11&ndash;13, 2026",
  )
  .replaceAll("{{CITY}}", city || "Dallas");

const tmp = join(here, ".ig-org-committed.tmp.html");
writeFileSync(tmp, html);

const out = join(
  here,
  outFile || `ig-org-${logoFile.replace(/\.(png|jpg|jpeg)$/i, "")}.png`,
);

// Browser: CHROMIUM_PATH, else the sandbox's preinstalled headless shell,
// else Playwright's own resolution.
const { globSync } = await import("node:fs");
const chromePath =
  process.env.CHROMIUM_PATH ??
  globSync("/opt/pw-browsers/*/chrome-linux/headless_shell")[0];
const browser = await chromium.launch(
  chromePath ? { executablePath: chromePath } : {},
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
await page.goto(`file://${tmp}`, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: out });
await browser.close();
unlinkSync(tmp);
console.log(`rendered ${out}`);
