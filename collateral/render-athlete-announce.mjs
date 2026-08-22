// Render an IG "athlete registered" announcement from the template.
//
// Usage (from the repo root):
//   node collateral/render-athlete-announce.mjs \
//     "Athlete Name" athlete-name.jpg "QB" 2029 "Club Name" "City, ST"
//
// Args:
//   1. Athlete name
//   2. Photo filename inside collateral/athletes/ (action shot; portrait or
//      landscape both work — the template crops to cover)
//   3. Position(s), e.g. "QB" or "WR · ATH"
//   4. Class year, e.g. 2029
//   5. Club/travel team name
//   6. Hometown, e.g. "Dallas, TX"
//   7. (optional) Event line — defaults to the Dallas Event 01 line
//   8. (optional) Output filename — defaults to ig-athlete-<photo-name>.png
//
// If Playwright can't find a browser, set CHROMIUM_PATH to a Chromium binary.

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
const [name, photoFile, position, classYear, club, hometown, eventLine, outFile] =
  process.argv.slice(2);
if (!name || !photoFile || !position || !classYear || !club || !hometown) {
  console.error(
    'Usage: node render-athlete-announce.mjs "Name" photo.jpg "QB" 2029 "Club" "Hometown, ST" ["Event line"] [out.png]',
  );
  process.exit(1);
}

const html = readFileSync(join(here, "ig-athlete-committed.html"), "utf8")
  .replaceAll("{{NAME}}", name)
  .replaceAll("{{PHOTO}}", `athletes/${photoFile}`)
  .replaceAll("{{POSITION}}", position)
  .replaceAll("{{CLASS}}", classYear)
  .replaceAll("{{CLUB}}", club)
  .replaceAll("{{HOMETOWN}}", hometown)
  .replaceAll(
    "{{EVENT_LINE}}",
    eventLine ||
      "Showcase Combine &amp; Camp &middot; Dallas, TX &middot; Dec 11&ndash;13, 2026",
  );

const tmp = join(here, ".ig-athlete-committed.tmp.html");
writeFileSync(tmp, html);

const out = join(
  here,
  outFile || `ig-athlete-${photoFile.replace(/\.(png|jpg|jpeg)$/i, "")}.png`,
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
