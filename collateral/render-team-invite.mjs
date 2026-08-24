// Render an official per-team Showcase Tournament invitation graphic.
//
// Usage (from the repo root):
//   node collateral/render-team-invite.mjs "Program Name" public/programs/logo.png
//
// Args:
//   1. Invited TEAM name — org + division (invites are team-specific,
//      one per team), e.g. "One of One Girls Flag Football Club 14U"
//   2. Logo path relative to the REPO ROOT — e.g. public/programs/foo.png
//      for teams already on the site board, or collateral/invites/foo.png
//      for a new invitee (stage their logo there first; transparent PNG)
//   3. (optional) Event line — defaults to "Event 01 · Dallas, TX · Dec 11–13, 2026"
//   4. (optional) Venue line — defaults to "Craig Ranch Sports Complex · McKinney, TX"
//   5. (optional) Output filename — defaults to invite-<logo-name>.png
//
// The private registration link goes in the EMAIL BODY, never on the graphic.

import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, resolve, basename } from "node:path";

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
const [name, logoPath, eventLine, venueLine, outFile] = process.argv.slice(2);
if (!name || !logoPath) {
  console.error(
    'Usage: node render-team-invite.mjs "Program Name" public/programs/logo.png ["Event line"] ["Venue line"] [out.png]',
  );
  process.exit(1);
}

// Logo arg is repo-root-relative; the template resolves relative to collateral/.
const logoRel = relative(here, resolve(process.cwd(), logoPath));

const html = readFileSync(join(here, "invite-team-official.html"), "utf8")
  .replaceAll("{{NAME}}", name)
  .replaceAll("{{LOGO}}", logoRel)
  .replaceAll(
    "{{EVENT_LINE}}",
    eventLine || "Event 01 &middot; Dallas, TX &middot; Dec 11&ndash;13, 2026",
  )
  .replaceAll(
    "{{VENUE_LINE}}",
    venueLine || "Craig Ranch Sports Complex &middot; McKinney, TX",
  );

const tmp = join(here, ".invite-team-official.tmp.html");
writeFileSync(tmp, html);

const out = join(
  here,
  outFile ||
    `invite-${basename(logoPath).replace(/\.(png|jpg|jpeg)$/i, "")}.png`,
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
